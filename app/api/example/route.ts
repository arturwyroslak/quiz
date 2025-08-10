import { NextRequest, NextResponse } from 'next/server';
import { createApiHandler } from '@/lib/logging-middleware';
import { logger } from '@/lib/logger';

/**
 * Example API route demonstrating structured logging implementation
 * This route shows how to use the logging system with correlation IDs
 */
export const GET = createApiHandler(async (request: NextRequest, { correlationId }) => {
  logger.info('Processing example GET request', {
    correlationId,
    endpoint: '/api/example',
    method: 'GET'
  });

  // Simulate some processing
  const processingStart = Date.now();
  
  // Example of logging with sensitive data that gets scrubbed
  const exampleData = {
    userId: 'user123',
    email: 'user@example.com',
    password: 'secret123', // This will be scrubbed
    token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...', // This will be scrubbed
    name: 'John Doe',
    accountType: 'PARTNER'
  };

  logger.info('Example data processing', {
    correlationId,
    data: exampleData // Sensitive fields will be automatically scrubbed
  });

  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const processingTime = Date.now() - processingStart;
  
  logger.info('Example request completed', {
    correlationId,
    processingTime,
    success: true
  });

  return NextResponse.json({
    success: true,
    message: 'Example API route with structured logging',
    correlationId,
    processingTime,
    timestamp: new Date().toISOString()
  });
});

export const POST = createApiHandler(async (request: NextRequest, { correlationId }) => {
  logger.info('Processing example POST request', {
    correlationId,
    endpoint: '/api/example',
    method: 'POST'
  });

  try {
    const body = await request.json();
    
    logger.info('Received POST data', {
      correlationId,
      bodyKeys: Object.keys(body),
      dataSize: JSON.stringify(body).length
    });

    // Example of authentication logging
    if (body.email && body.password) {
      logger.logAuth('Authentication attempt', {
        email: body.email, // Will be masked
        correlationId,
        success: true
      });
    }

    // Example of database logging
    logger.logDatabase('User lookup', {
      correlationId,
      operation: 'SELECT',
      table: 'users',
      duration: 45
    });

    // Example of security logging
    if (body.suspicious) {
      logger.logSecurity('Suspicious activity detected', {
        correlationId,
        ip: request.ip || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        suspiciousField: body.suspicious
      });
    }

    return NextResponse.json({
      success: true,
      message: 'POST request processed successfully',
      correlationId,
      received: Object.keys(body),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Error processing POST request', {
      correlationId,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json({
      success: false,
      error: 'Failed to process request',
      correlationId
    }, { status: 500 });
  }
});
