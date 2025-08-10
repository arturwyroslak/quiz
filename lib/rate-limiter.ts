import { RateLimiterMemory, RateLimiterRedis } from 'rate-limiter-flexible';
import { NextRequest, NextResponse } from 'next/server';
import { createErrorResponse } from './error-handler';

// Rate limiter for login attempts
const loginRateLimiter = new RateLimiterMemory({
  points: 5, // Number of attempts
  duration: 60 * 15, // Per 15 minutes
  blockDuration: 60 * 15, // Block for 15 minutes
});

// Rate limiter for registration attempts
const registrationRateLimiter = new RateLimiterMemory({
  points: 3, // Number of attempts
  duration: 60 * 60, // Per hour
  blockDuration: 60 * 60, // Block for 1 hour
});

// Rate limiter for password reset attempts
const passwordResetRateLimiter = new RateLimiterMemory({
  points: 3, // Number of attempts
  duration: 60 * 60, // Per hour
  blockDuration: 60 * 60, // Block for 1 hour
});

// Rate limiter for API requests (general)
const apiRateLimiter = new RateLimiterMemory({
  points: 100, // Number of requests
  duration: 60 * 15, // Per 15 minutes
  blockDuration: 60 * 5, // Block for 5 minutes
});

// Rate limiter for form submissions
const formSubmissionRateLimiter = new RateLimiterMemory({
  points: 10, // Number of submissions
  duration: 60 * 5, // Per 5 minutes
  blockDuration: 60 * 5, // Block for 5 minutes
});

/**
 * Gets the client IP address from the request
 */
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return request.ip || 'unknown';
}

/**
 * Rate limiting middleware for login attempts
 */
export async function rateLimitLogin(request: NextRequest): Promise<NextResponse | null> {
  const clientIP = getClientIP(request);
  
  try {
    await loginRateLimiter.consume(clientIP);
    return null; // Allow the request to proceed
  } catch (rateLimiterRes) {
    const remainingPoints = rateLimiterRes.remainingPoints || 0;
    const msBeforeNext = rateLimiterRes.msBeforeNext || 0;
    
    const response = createErrorResponse(
      'Zbyt wiele prób logowania. Spróbuj ponownie później.',
      {
        retryAfter: Math.round(msBeforeNext / 1000),
        remainingAttempts: remainingPoints
      },
      429
    );
    
    // Add rate limiting headers
    response.headers.set('Retry-After', String(Math.round(msBeforeNext / 1000)));
    response.headers.set('X-RateLimit-Limit', '5');
    response.headers.set('X-RateLimit-Remaining', String(remainingPoints));
    
    return response;
  }
}

/**
 * Rate limiting middleware for registration attempts
 */
export async function rateLimitRegistration(request: NextRequest): Promise<NextResponse | null> {
  const clientIP = getClientIP(request);
  
  try {
    await registrationRateLimiter.consume(clientIP);
    return null; // Allow the request to proceed
  } catch (rateLimiterRes) {
    const remainingPoints = rateLimiterRes.remainingPoints || 0;
    const msBeforeNext = rateLimiterRes.msBeforeNext || 0;
    
    const response = createErrorResponse(
      'Zbyt wiele prób rejestracji. Spróbuj ponownie później.',
      {
        retryAfter: Math.round(msBeforeNext / 1000),
        remainingAttempts: remainingPoints
      },
      429
    );
    
    // Add rate limiting headers
    response.headers.set('Retry-After', String(Math.round(msBeforeNext / 1000)));
    response.headers.set('X-RateLimit-Limit', '3');
    response.headers.set('X-RateLimit-Remaining', String(remainingPoints));
    
    return response;
  }
}

/**
 * Rate limiting middleware for password reset attempts
 */
export async function rateLimitPasswordReset(request: NextRequest): Promise<NextResponse | null> {
  const clientIP = getClientIP(request);
  
  try {
    await passwordResetRateLimiter.consume(clientIP);
    return null; // Allow the request to proceed
  } catch (rateLimiterRes) {
    const remainingPoints = rateLimiterRes.remainingPoints || 0;
    const msBeforeNext = rateLimiterRes.msBeforeNext || 0;
    
    const response = createErrorResponse(
      'Zbyt wiele prób resetowania hasła. Spróbuj ponownie później.',
      {
        retryAfter: Math.round(msBeforeNext / 1000),
        remainingAttempts: remainingPoints
      },
      429
    );
    
    // Add rate limiting headers
    response.headers.set('Retry-After', String(Math.round(msBeforeNext / 1000)));
    response.headers.set('X-RateLimit-Limit', '3');
    response.headers.set('X-RateLimit-Remaining', String(remainingPoints));
    
    return response;
  }
}

/**
 * Rate limiting middleware for general API requests
 */
export async function rateLimitAPI(request: NextRequest): Promise<NextResponse | null> {
  const clientIP = getClientIP(request);
  
  try {
    await apiRateLimiter.consume(clientIP);
    return null; // Allow the request to proceed
  } catch (rateLimiterRes) {
    const remainingPoints = rateLimiterRes.remainingPoints || 0;
    const msBeforeNext = rateLimiterRes.msBeforeNext || 0;
    
    const response = createErrorResponse(
      'Zbyt wiele żądań. Spróbuj ponownie później.',
      {
        retryAfter: Math.round(msBeforeNext / 1000),
        remainingAttempts: remainingPoints
      },
      429
    );
    
    // Add rate limiting headers
    response.headers.set('Retry-After', String(Math.round(msBeforeNext / 1000)));
    response.headers.set('X-RateLimit-Limit', '100');
    response.headers.set('X-RateLimit-Remaining', String(remainingPoints));
    
    return response;
  }
}

/**
 * Rate limiting middleware for form submissions
 */
export async function rateLimitFormSubmission(request: NextRequest): Promise<NextResponse | null> {
  const clientIP = getClientIP(request);
  
  try {
    await formSubmissionRateLimiter.consume(clientIP);
    return null; // Allow the request to proceed
  } catch (rateLimiterRes) {
    const remainingPoints = rateLimiterRes.remainingPoints || 0;
    const msBeforeNext = rateLimiterRes.msBeforeNext || 0;
    
    const response = createErrorResponse(
      'Zbyt wiele wysłanych formularzy. Spróbuj ponownie później.',
      {
        retryAfter: Math.round(msBeforeNext / 1000),
        remainingAttempts: remainingPoints
      },
      429
    );
    
    // Add rate limiting headers
    response.headers.set('Retry-After', String(Math.round(msBeforeNext / 1000)));
    response.headers.set('X-RateLimit-Limit', '10');
    response.headers.set('X-RateLimit-Remaining', String(remainingPoints));
    
    return response;
  }
}

/**
 * Generic rate limiting function
 */
export async function applyRateLimit(
  request: NextRequest,
  limiter: RateLimiterMemory,
  errorMessage: string,
  limit: number
): Promise<NextResponse | null> {
  const clientIP = getClientIP(request);
  
  try {
    await limiter.consume(clientIP);
    return null; // Allow the request to proceed
  } catch (rateLimiterRes) {
    const remainingPoints = rateLimiterRes.remainingPoints || 0;
    const msBeforeNext = rateLimiterRes.msBeforeNext || 0;
    
    const response = createErrorResponse(
      errorMessage,
      {
        retryAfter: Math.round(msBeforeNext / 1000),
        remainingAttempts: remainingPoints
      },
      429
    );
    
    // Add rate limiting headers
    response.headers.set('Retry-After', String(Math.round(msBeforeNext / 1000)));
    response.headers.set('X-RateLimit-Limit', String(limit));
    response.headers.set('X-RateLimit-Remaining', String(remainingPoints));
    
    return response;
  }
}
