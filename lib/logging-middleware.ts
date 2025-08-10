import { NextRequest, NextResponse } from 'next/server';
import { logger, CorrelationManager } from './logger';

// Request timing storage
const requestTimings = new Map<string, number>();

/**
 * Logging middleware for HTTP requests and responses
 */
export function withLogging(
  handler: (request: NextRequest, ...args: any[]) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: any[]): Promise<NextResponse> => {
    const startTime = Date.now();
    const correlationId = CorrelationManager.getCorrelationId(request);
    
    // Store timing for this request
    requestTimings.set(correlationId, startTime);
    
    // Log incoming request
    logger.logRequest(request, correlationId);
    
    try {
      // Execute the handler
      const response = await handler(request, ...args);
      
      // Add correlation ID to response headers
      CorrelationManager.addCorrelationHeaders(response.headers, correlationId);
      
      // Calculate duration
      const duration = Date.now() - startTime;
      
      // Log response
      logger.logResponse(
        request,
        response.status,
        correlationId,
        duration
      );
      
      // Clean up timing storage
      requestTimings.delete(correlationId);
      
      return response;
    } catch (error) {
      // Calculate duration for error response
      const duration = Date.now() - startTime;
      
      // Log error response
      logger.logResponse(
        request,
        500,
        correlationId,
        duration,
        { error: error instanceof Error ? error.message : 'Unknown error' }
      );
      
      // Clean up timing storage
      requestTimings.delete(correlationId);
      
      // Re-throw the error
      throw error;
    }
  };
}

/**
 * Enhanced middleware that combines authentication with logging
 */
export function withAuthAndLogging(
  handler: (request: NextRequest, ...args: any[]) => Promise<NextResponse>,
  authOptions?: {
    requireAuth?: boolean;
    requiredRole?: string;
  }
) {
  return withLogging(async (request: NextRequest, ...args: any[]): Promise<NextResponse> => {
    const correlationId = CorrelationManager.getCorrelationId(request);
    
    // If auth is required, perform authentication logging
    if (authOptions?.requireAuth) {
      const authHeader = request.headers.get('authorization');
      
      if (!authHeader) {
        logger.logSecurity('Unauthorized access attempt', {
          correlationId,
          url: request.url,
          method: request.method,
          ip: request.ip || request.headers.get('x-forwarded-for') || 'unknown',
          reason: 'Missing authorization header'
        });
        
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }
    
    return handler(request, ...args);
  });
}

/**
 * API route wrapper with comprehensive logging
 */
export function createApiHandler(
  handler: (request: NextRequest, context: { correlationId: string }) => Promise<NextResponse>
) {
  return withLogging(async (request: NextRequest): Promise<NextResponse> => {
    const correlationId = CorrelationManager.getCorrelationId(request);
    
    try {
      return await handler(request, { correlationId });
    } catch (error) {
      logger.error('API Handler Error', {
        correlationId,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        url: request.url,
        method: request.method,
      });
      
      return NextResponse.json(
        { error: 'Internal Server Error', correlationId },
        { status: 500 }
      );
    }
  });
}

/**
 * Cleanup function for request timings (should be called periodically)
 */
export function cleanupRequestTimings(): void {
  const now = Date.now();
  const maxAge = 5 * 60 * 1000; // 5 minutes
  
  for (const [correlationId, startTime] of requestTimings.entries()) {
    if (now - startTime > maxAge) {
      requestTimings.delete(correlationId);
    }
  }
}

// Cleanup timings periodically
setInterval(cleanupRequestTimings, 60000); // Every minute
