import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from '@/lib/db';
import { createErrorResponse, createSuccessResponse } from '@/lib/error-handler';
import { logger } from '@/lib/logger';

export async function GET(req: NextRequest) {
  logger.info('Dashboard stats request started');

  const session = await getServerSession(authOptions);
  
  // Check if user is authenticated
  if (!session) {
    logger.warn('Unauthorized dashboard stats request');
    return createErrorResponse("Unauthorized", null, 401);
  }

  // Check if user is verified and active
  if (!session.user.isVerified || !session.user.isActive) {
    logger.warn('Dashboard stats request by unverified/inactive user', {
      userId: session.user.id,
      isVerified: session.user.isVerified,
      isActive: session.user.isActive
    });
    return createErrorResponse(
      "Konto nie jest aktywne lub zweryfikowane",
      null,
      403
    );
  }

  try {
    const userId = session.user.id;
    const currentDate = new Date();
    const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    
    // Get total leads count
    const totalLeads = await prisma.lead.count({
      where: {
        partnerId: userId
      }
    });

    // Get leads this month
    const leadsThisMonth = await prisma.lead.count({
      where: {
        partnerId: userId,
        createdAt: {
          gte: currentMonth
        }
      }
    });

    // Get converted leads count
    const convertedLeads = await prisma.lead.count({
      where: {
        partnerId: userId,
        status: 'CONVERTED'
      }
    });

    // Get pending leads count
    const pendingLeads = await prisma.lead.count({
      where: {
        partnerId: userId,
        status: 'PENDING'
      }
    });

    // Calculate estimated commission (simplified calculation)
    // This would need to be adjusted based on your actual commission structure
    const estimatedCommissionPerLead = 200; // 200 PLN per converted lead
    const totalCommission = convertedLeads * estimatedCommissionPerLead;
    
    // Commission this month (leads converted this month)
    const convertedThisMonth = await prisma.lead.count({
      where: {
        partnerId: userId,
        status: 'CONVERTED',
        updatedAt: {
          gte: currentMonth
        }
      }
    });
    const commissionThisMonth = convertedThisMonth * estimatedCommissionPerLead;

    const stats = {
      totalLeads,
      leadsThisMonth,
      convertedLeads,
      pendingLeads,
      totalCommission,
      commissionThisMonth,
      conversionRate: totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0
    };

    logger.info('Dashboard stats retrieved successfully', {
      userId,
      totalLeads,
      convertedLeads
    });

    return createSuccessResponse(
      "Statystyki pobrane pomyślnie",
      { stats },
      200
    );

  } catch (error) {
    logger.error('Dashboard stats error', {
      error: error instanceof Error ? error : new Error(String(error)),
      metadata: { userId: session?.user?.id }
    });
    
    return createErrorResponse(
      "Błąd podczas pobierania statystyk",
      null,
      500
    );
  }
}
