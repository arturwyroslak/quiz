// This endpoint is deprecated. Use NextAuth for authentication instead.
// Redirects to NextAuth signin for consistency.

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Log the deprecation but don't expose sensitive information
  console.warn('Deprecated /api/partner/login endpoint accessed. Use NextAuth instead.');
  
  return NextResponse.json(
    { 
      error: 'This endpoint is deprecated. Please use the NextAuth authentication flow.',
      redirect: '/api/auth/signin'
    },
    { status: 410 } // Gone
  );
}
