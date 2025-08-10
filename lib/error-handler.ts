import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ErrorResponse } from './schemas';
import { logger } from './logger';

export interface ApiError {
  error: string;
  details?: any;
  timestamp?: string;
}

/**
 * Creates a consistent error response object
 */
export function createErrorResponse(
  error: string,
  details?: any,
  statusCode: number = 500
): NextResponse {
  const errorResponse: ApiError = {
    error,
    timestamp: new Date().toISOString(),
    ...(details && { details })
  };

  // Don't expose stack traces in production
  if (process.env.NODE_ENV === 'production' && details?.stack) {
    delete errorResponse.details.stack;
  }

  return NextResponse.json(errorResponse, { status: statusCode });
}

/**
 * Creates a consistent success response object
 */
export function createSuccessResponse(
  message: string,
  data?: any,
  statusCode: number = 200
): NextResponse {
  const successResponse = {
    success: true,
    message,
    timestamp: new Date().toISOString(),
    ...(data && { data })
  };

  return NextResponse.json(successResponse, { status: statusCode });
}

/**
 * Handles Zod validation errors and returns formatted error response
 */
export function handleValidationError(error: z.ZodError): NextResponse {
  const formattedErrors = error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message,
    code: err.code
  }));

  return createErrorResponse(
    'Błąd walidacji danych',
    formattedErrors,
    400
  );
}

/**
 * Handles Prisma errors and returns appropriate error response
 */
export function handlePrismaError(error: any): NextResponse {
  // P2002: Unique constraint failed
  if (error.code === 'P2002') {
    return createErrorResponse(
      'Ten adres email jest już zarejestrowany',
      { field: error.meta?.target?.[0] || 'email' },
      409
    );
  }

  // P2025: Record not found
  if (error.code === 'P2025') {
    return createErrorResponse(
      'Nie znaleziono zasobu',
      null,
      404
    );
  }

  // P2003: Foreign key constraint failed
  if (error.code === 'P2003') {
    return createErrorResponse(
      'Naruszenie więzów integralności danych',
      { field: error.meta?.field_name },
      400
    );
  }

  // Generic database error
  logger.error('Database error', {
    error: error.message,
    code: error.code,
    meta: error.meta,
    stack: error.stack
  });
  return createErrorResponse(
    'Błąd bazy danych',
    process.env.NODE_ENV === 'development' ? error.message : null,
    500
  );
}

/**
 * Handles generic errors and returns appropriate error response
 */
export function handleGenericError(error: any): NextResponse {
  logger.error('Unhandled error', {
    error: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined,
    type: typeof error,
    details: error
  });
  
  // Don't expose internal errors in production
  if (process.env.NODE_ENV === 'production') {
    return createErrorResponse(
      'Wystąpił nieoczekiwany błąd',
      null,
      500
    );
  }

  return createErrorResponse(
    'Wystąpił nieoczekiwany błąd',
    { message: error.message },
    500
  );
}

/**
 * Wrapper for API route handlers with consistent error handling
 */
export function withErrorHandling(
  handler: (req: Request, ...args: any[]) => Promise<NextResponse>
) {
  return async (req: Request, ...args: any[]): Promise<NextResponse> => {
    try {
      return await handler(req, ...args);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return handleValidationError(error);
      }
      
      if (error && typeof error === 'object' && 'code' in error) {
        return handlePrismaError(error);
      }
      
      return handleGenericError(error);
    }
  };
}
