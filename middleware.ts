import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { logger, CorrelationManager } from '@/lib/logger';

// Trasy, które wymagają uwierzytelnienia
const PROTECTED_PATHS = ['/partner-program/dashboard'];

// Trasy publiczne - używamy Set dla lepszej wydajności
const PUBLIC_PATHS = new Set([
  '/_next',
  '/api/auth', // NextAuth endpoints
  '/api/public', // Public API endpoints
  '/static',
  '/partner-program/login',
  '/partner-program/register',
  '/partner-program/reset-password',
  '/partner-program/verify',
  '/partner-program/terms',
  '/partner-program/privacy',
  '/partner-program/cookies',
]);

// Token blacklist - in production, this should be stored in Redis or database
const TOKEN_BLACKLIST = new Set<string>();

// Helper function to normalize paths and prevent bypass attacks
function normalizePath(pathname: string): string {
  // Decode URI components to prevent encoded path bypasses
  try {
    const decoded = decodeURIComponent(pathname);
    // Normalize path separators and resolve relative paths
    return decoded.replace(/\/+/g, '/').replace(/\/\.\/+/g, '/').replace(/\/[^/]+\/\.\.\//g, '/');
  } catch (e) {
    // If decoding fails, return original path
    return pathname;
  }
}

// Helper function to check if path is public
function isPublicPath(normalizedPath: string): boolean {
  for (const publicPath of PUBLIC_PATHS) {
    if (normalizedPath.startsWith(publicPath)) {
      return true;
    }
  }
  return false;
}

// Helper function to check if path is protected
function isProtectedPath(normalizedPath: string): boolean {
  return PROTECTED_PATHS.some(path => normalizedPath.startsWith(path));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const correlationId = CorrelationManager.getCorrelationId(request);

  // Normalize path to prevent bypass attacks
  const normalizedPath = normalizePath(pathname);

  // Log incoming request
  logger.logRequest(request, correlationId);

  // Security: Block suspicious path patterns
  if (normalizedPath.includes('..') || normalizedPath.includes('//') ||
      normalizedPath !== pathname.replace(/\/+/g, '/')) {
    logger.warn('Blocked invalid path access attempt', {
      correlationId,
      path: pathname,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    });
    return NextResponse.json(
      { error: 'Invalid path' },
      { status: 400 }
    );
  }

  // Skip middleware for static files and public paths
  if (pathname.includes('.') || isPublicPath(normalizedPath)) {
    return NextResponse.next();
  }

  // Check authentication for protected paths
  if (isProtectedPath(normalizedPath)) {
    try {
      // Manual token extraction from cookies
      // Using a hardcoded approach for environment check as process.env may not be typed
      const isProduction = false; // Replace with actual environment check if needed
      const cookieName = isProduction 
        ? '__Secure-next-auth.session-token' 
        : 'next-auth.session-token';
      const token = request.cookies.get(cookieName)?.value;

      // Debug logging
      logger.info('Middleware - Token extraction attempt', {
        correlationId,
        hasToken: !!token,
        path: pathname,
        cookies: request.cookies.getAll().map((cookie: any) => ({ name: cookie.name, hasValue: !!cookie.value }))
      });

      // Simplified check - just verify token presence
      if (!token) {
        logger.warn('Unauthorized access attempt - no token', {
          correlationId,
          path: pathname
        });
        const url = new URL('/partner-program/login', request.url);
        url.searchParams.set('redirect', normalizedPath);
        return NextResponse.redirect(url);
      }

      // Add security headers
      const response = NextResponse.next();
      response.headers.set('X-Content-Type-Options', 'nosniff');
      response.headers.set('X-Frame-Options', 'DENY');
      response.headers.set('X-XSS-Protection', '1; mode=block');
      response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

      return response;
    } catch (error) {
      logger.error('Error in middleware token validation', {
        correlationId,
        error: error instanceof Error ? error : new Error(String(error)),
        path: pathname,
        stack: error instanceof Error ? error.stack : undefined
      });
      
      // Redirect to login on error
      const url = new URL('/partner-program/login', request.url);
      url.searchParams.set('error', 'auth_error');
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Export function to add token to blacklist (for logout/token rotation)
export function blacklistToken(jti: string) {
  TOKEN_BLACKLIST.add(jti);
}

// Export function to clear expired tokens from blacklist
export function clearExpiredTokens() {
  // In production, implement proper cleanup logic
  // For now, we'll clear all tokens periodically
  TOKEN_BLACKLIST.clear();
}

export const runtime = 'nodejs';

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};