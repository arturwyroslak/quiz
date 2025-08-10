import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword, generateToken } from '@/lib/utils';
import { sendPasswordResetEmail } from '@/lib/email';
import { PasswordResetSchema, passwordSchema } from '@/lib/schemas';
import { createErrorResponse, createSuccessResponse, handleValidationError, handlePrismaError, handleGenericError } from '@/lib/error-handler';
import { rateLimitPasswordReset } from '@/lib/rate-limiter';

export async function POST(request: NextRequest) {
  // Apply rate limiting for password reset attempts
  const rateLimitResponse = await rateLimitPasswordReset(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const data = await request.json();
    const validatedData = PasswordResetSchema.parse(data);

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user) {
      // For security, return success even if email doesn't exist
      return createSuccessResponse(
        'Jeśli konto istnieje, wysłaliśmy link resetujący'
      );
    }

    // Generate reset token
    const resetToken = generateToken();
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Update user with reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetTokenExpiry,
      },
    });

    // Send password reset email
    await sendPasswordResetEmail(validatedData.email, resetToken);

    return createSuccessResponse(
      'Link resetujący został wysłany'
    );

  } catch (error) {
    console.error('Password reset generation error:', error);
    
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

export async function PUT(request: NextRequest) {
  // Apply rate limiting for password reset attempts
  const rateLimitResponse = await rateLimitPasswordReset(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const data = await request.json();
    const { resetPasswordToken } = data;
    
    // Validate password
    const validatedPassword = passwordSchema.parse(data.password);
    
    if (!resetPasswordToken) {
      return createErrorResponse(
        'Token resetujący jest wymagany',
        { field: 'resetToken' },
        400
      );
    }

    // Find user with valid reset token
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: resetPasswordToken,
        resetPasswordExpires: {
          gt: new Date(), // Token is still valid
        },
      },
    });

    if (!user) {
      return createErrorResponse(
        'Nieprawidłowy lub wygasły token resetujący',
        { field: 'resetToken' },
        400
      );
    }

    // Hash new password
    const hashedPassword = await hashPassword(validatedPassword);

    // Update user password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
        isVerified: true,
      },
    });

    return createSuccessResponse(
      'Hasło zostało pomyślnie zresetowane'
    );

  } catch (error) {
    console.error('Password reset error:', error);
    
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