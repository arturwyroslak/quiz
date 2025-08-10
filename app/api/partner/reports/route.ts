import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ReportGenerationSchema } from '@/lib/schemas';
import { createErrorResponse, createSuccessResponse, handleValidationError, handlePrismaError, handleGenericError } from '@/lib/error-handler';
import { rateLimitAPI } from '@/lib/rate-limiter';
import { format } from "date-fns";
import { createObjectCsvWriter } from "csv-writer";
import * as ExcelJS from "exceljs";
import * as fs from "fs";
import * as path from "path";


// Utility function to generate unique filename
function generateUniqueFilename(prefix: string, extension: string) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `${prefix}_${timestamp}${extension}`;
}

// Utility function to ensure directory exists
function ensureDirectoryExists(directory: string) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

export async function POST(req: NextRequest) {
  // Apply rate limiting for API requests
  const rateLimitResponse = await rateLimitAPI(req);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  const session = await getServerSession(authOptions);
  
  // Check if user is authenticated
  if (!session) {
    return createErrorResponse("Unauthorized", null, 401);
  }

  try {
    // Parse and validate request body
    const body = await req.json();
    const validatedData = ReportGenerationSchema.parse(body);

    // Fetch leads based on report type and date range
    const leadsQuery = {
      where: {
        partnerId: session.user.id,
        createdAt: {
          gte: new Date(validatedData.startDate),
          lte: new Date(validatedData.endDate)
        }
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        status: true,
        estimatedValue: true,
        createdAt: true
      }
    };

    let leads = [];
    if (validatedData.reportType === 'leads' || validatedData.reportType === 'combined') {
      leads = await prisma.lead.findMany(leadsQuery);
    }
    // TODO: Add commissions logic if needed for 'commissions' or 'combined'

    // Prepare report data
    const reportData = leads.map(lead => ({
      id: lead.id,
      name: `${lead.firstName} ${lead.lastName}`,
      email: lead.email,
      phone: lead.phone || 'N/A',
      status: lead.status,
      estimatedValue: lead.estimatedValue || 0,
      commission: (lead.estimatedValue || 0) * 0.1, // 10% commission rate
      date: format(lead.createdAt, 'yyyy-MM-dd')
    }));

    // Ensure reports directory exists in a writable location
    const reportsDir = path.join('/tmp', 'reports');
    ensureDirectoryExists(reportsDir);

    // Generate CSV
    const csvFilename = generateUniqueFilename('partner_report', '.csv');
    const csvPath = path.join(reportsDir, csvFilename);
    const csvWriter = createObjectCsvWriter({
      path: csvPath,
      header: [
        {id: 'id', title: 'ID'},
        {id: 'name', title: 'Imię i nazwisko'},
        {id: 'email', title: 'E-mail'},
        {id: 'phone', title: 'Telefon'},
        {id: 'status', title: 'Status'},
        {id: 'estimatedValue', title: 'Wartość zgłoszenia'},
        {id: 'commission', title: 'Prowizja'},
        {id: 'date', title: 'Data'}
      ]
    });
    await csvWriter.writeRecords(reportData);

    // Generate XLSX
    const xlsxFilename = generateUniqueFilename('partner_report', '.xlsx');
    const xlsxPath = path.join(reportsDir, xlsxFilename);
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Raport');

    // Add headers
    worksheet.columns = [
      { header: 'ID', key: 'id' },
      { header: 'Imię i nazwisko', key: 'name' },
      { header: 'E-mail', key: 'email' },
      { header: 'Telefon', key: 'phone' },
      { header: 'Status', key: 'status' },
      { header: 'Wartość zgłoszenia', key: 'estimatedValue' },
      { header: 'Prowizja', key: 'commission' },
      { header: 'Data', key: 'date' }
    ];

    // Add data
    reportData.forEach(record => {
      worksheet.addRow(record);
    });

    // Save workbook
    await workbook.xlsx.writeFile(xlsxPath);

    // Create report record in database
    const reportRecord = await prisma.report.create({
      data: {
        title: `Raport partnerski z ${format(new Date(), 'yyyy-MM-dd')}`,
        type: validatedData.reportType,
        generatedBy: session.user.id,
        data: {
          parameters: {
            startDate: validatedData.startDate,
            endDate: validatedData.endDate
          },
          // Note: these URLs are temporary and may not be accessible in a serverless environment
          // A long-term solution would use cloud storage (e.g., S3)
          urls: {
            csv: `/api/partner/reports/download?file=${csvFilename}`, // Example of a potential download route
            xlsx: `/api/partner/reports/download?file=${xlsxFilename}`
          },
          paths: {
            csv: csvPath,
            xlsx: xlsxPath
          }
        }
      }
    });

    return createSuccessResponse(
      "Raport został wygenerowany",
      {
        csvUrl: `/api/partner/reports/download?file=${csvFilename}`,
        xlsxUrl: `/api/partner/reports/download?file=${xlsxFilename}`,
        reportId: reportRecord.id
      }
    );

  } catch (error) {
    console.error('Report generation error:', error);

    // Handle validation errors
    if (error instanceof Error && error.name === 'ZodError') {
      return handleValidationError(error as any);
    }

    // Handle Prisma errors
    if (error && typeof error === 'object' && 'code' in error) {
      return handlePrismaError(error);
    }

    // Handle generic errors
    return handleGenericError(error);
  }
}

// GET: Fetch previous reports
export async function GET(req: NextRequest) {
  // Apply rate limiting for API requests
  const rateLimitResponse = await rateLimitAPI(req);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  const session = await getServerSession(authOptions);
  
  // Check if user is authenticated
  if (!session) {
    return createErrorResponse("Unauthorized", null, 401);
  }

  try {
    // Fetch paginated reports
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    const reports = await prisma.report.findMany({
      where: { 
        generatedBy: session.user.id
      },
      orderBy: { 
        createdAt: 'desc' 
      },
      skip: offset,
      take: limit
    });

    const totalReports = await prisma.report.count({
      where: { 
        generatedBy: session.user.id
      }
    });

    return createSuccessResponse(
      "Raporty zostały pobrane pomyślnie",
      {
        reports,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalReports / limit),
          totalReports,
          reportsPerPage: limit
        }
      }
    );

  } catch (error) {
    console.error('Error fetching reports:', error);
    
    // Handle Prisma errors
    if (error && typeof error === 'object' && 'code' in error) {
      return handlePrismaError(error);
    }
    
    // Handle generic errors
    return handleGenericError(error);
  }
}
