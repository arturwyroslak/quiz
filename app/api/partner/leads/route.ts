import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from '@/lib/db';
import { LeadSubmissionSchema } from '@/lib/schemas';
import { createErrorResponse, createSuccessResponse, handleValidationError, handlePrismaError, handleGenericError } from '@/lib/error-handler';
import { rateLimitFormSubmission } from '@/lib/rate-limiter';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  logger.info('Lead submission started', { 
    userAgent: req.headers.get('user-agent') || undefined,
    ip: req.headers.get('x-forwarded-for') || undefined
  });

  // Apply rate limiting for form submissions
  const rateLimitResponse = await rateLimitFormSubmission(req);
  if (rateLimitResponse) {
    logger.warn('Rate limit exceeded for lead submission');
    return rateLimitResponse;
  }

  const session = await getServerSession(authOptions);
  
  // Check if user is authenticated
  if (!session) {
    logger.warn('Unauthorized lead submission attempt');
    return createErrorResponse("Unauthorized", null, 401);
  }

  logger.info('Lead submission by user', { 
    userId: session.user.id,
    email: session.user.email || undefined,
    accountType: session.user.accountType
  });

  // Check if user is verified and active
  if (!session.user.isVerified || !session.user.isActive) {
    logger.warn('Lead submission by unverified/inactive user', {
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
    // Parse and validate request body
    const body = await req.json();
    logger.info('Lead submission data received', { 
      hasFirstName: !!body.firstName,
      hasLastName: !!body.lastName,
      hasEmail: !!body.email,
      hasPhone: !!body.phone
    });
    
    const validatedData = LeadSubmissionSchema.parse(body);

    // Create lead in database
    const newLead = await prisma.lead.create({
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone,
        address: validatedData.address,
        preferences: validatedData.preferences,
        partnerId: session.user.id,
        status: 'PENDING',
        // Optional: Add employee ID if applicable
        ...(session.user.accountType === 'COMPANY' ? {} : {})
      }
    });

    // Log lead creation
    logger.info('Lead created successfully', {
      leadId: newLead.id,
      partnerId: session.user.id,
      email: newLead.email
    });

    // Powiadom partnera e-mailem o nowym leadzie
    try {
      const { sendNewLeadNotification } = await import('@/lib/email');
      await sendNewLeadNotification(session.user.email || '', `${newLead.firstName} ${newLead.lastName}`, newLead.id);
    } catch (notifyErr) {
      logger.error('Error sending lead notification email', {
        error: notifyErr instanceof Error ? notifyErr : new Error(String(notifyErr)),
        metadata: { leadId: newLead.id }
      });
    }

    logger.info('Lead submission successful', { 
      leadId: newLead.id,
      userId: session.user.id
    });

    return createSuccessResponse(
      "Zgłoszenie zostało pomyślnie utworzone",
      { lead: newLead },
      201
    );

  } catch (error) {
    logger.error('Lead submission error', {
      error: error instanceof Error ? error : new Error(String(error)),
      metadata: { userId: session?.user?.id }
    });
    
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