import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { randomBytes, createHmac } from 'crypto';

/**
 * Generates a CSRF token for the given session
 * @param sessionId - The session ID to bind the token to
 * @returns A secure CSRF token
 */
export function generateCSRFToken(sessionId: string): string {
  const secret = process.env.NEXTAUTH_SECRET || 'fallback_secret';
  const timestamp = Date.now().toString();
  const nonce = randomBytes(16).toString('hex');
  
  const payload = `${sessionId}:${timestamp}:${nonce}`;
  const hmac = createHmac('sha256', secret);
  hmac.update(payload);
  const signature = hmac.digest('hex');
  
  return Buffer.from(`${payload}:${signature}`).toString('base64');
}

/**
 * Verifies a CSRF token
 * @param token - The CSRF token to verify
 * @param sessionId - The session ID to verify against
 * @param maxAge - Maximum age in milliseconds (default: 1 hour)
 * @returns True if the token is valid
 */
export function verifyCSRFToken(
  token: string, 
  sessionId: string, 
  maxAge: number = 60 * 60 * 1000
): boolean {
  try {
    const secret = process.env.NEXTAUTH_SECRET || 'fallback_secret';
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const [receivedSessionId, timestamp, nonce, signature] = decoded.split(':');
    
    if (receivedSessionId !== sessionId) {
      return false;
    }
    
    const tokenAge = Date.now() - parseInt(timestamp);
    if (tokenAge > maxAge) {
      return false;
    }
    
    const payload = `${receivedSessionId}:${timestamp}:${nonce}`;
    const hmac = createHmac('sha256', secret);
    hmac.update(payload);
    const expectedSignature = hmac.digest('hex');
    
    return signature === expectedSignature;
  } catch (error) {
    console.error('CSRF token verification failed:', error);
    return false;
  }
}

/**
 * Middleware to validate CSRF tokens on mutating requests
 * @param request - The incoming request
 * @returns True if the request is valid, false otherwise
 */
export async function validateCSRFToken(request: NextRequest): Promise<boolean> {
  const method = request.method;
  
  // Only check CSRF for mutating methods
  if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    return true;
  }
  
  // Get the session token to identify the user
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });
  
  if (!token) {
    return false; // No session, no CSRF protection needed but also no access
  }
  
  // Get CSRF token from header or body
  const csrfToken = request.headers.get('X-CSRF-Token') || 
                   request.headers.get('x-csrf-token');
  
  if (!csrfToken) {
    console.warn('Missing CSRF token in request');
    return false;
  }
  
  const isValid = verifyCSRFToken(csrfToken, token.id as string);
  
  if (!isValid) {
    console.warn('Invalid CSRF token in request');
  }
  
  return isValid;
}

/**
 * API route helper to get CSRF token for the current session
 * @param request - The incoming request
 * @returns CSRF token if user is authenticated, null otherwise
 */
export async function getCSRFTokenForSession(request: NextRequest): Promise<string | null> {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });
  
  if (!token) {
    return null;
  }
  
  return generateCSRFToken(token.id as string);
}
