import { NextRequest, NextResponse } from 'next/server';
import { getCSRFTokenForSession } from '@/lib/csrf';

/**
 * GET /api/csrf-token
 * Returns a CSRF token for the current authenticated session
 */
export async function GET(request: NextRequest) {
  try {
    const csrfToken = await getCSRFTokenForSession(request);
    
    if (!csrfToken) {
      return NextResponse.json(
        { error: 'No active session found' },
        { status: 401 }
      );
    }
    
    return NextResponse.json({ csrfToken });
  } catch (error) {
    console.error('Error generating CSRF token:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
