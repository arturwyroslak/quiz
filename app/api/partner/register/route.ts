import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { AccountType } from '@prisma/client';
import { hashPassword, generateReferralCode, generateToken, isValidEmail } from '@/lib/utils';
import { sendWelcomeEmail } from '@/lib/email/sender';

import { RegistrationSchema } from '@/lib/schemas';
import { createErrorResponse, createSuccessResponse, handleValidationError, handlePrismaError, handleGenericError } from '@/lib/error-handler';
import { rateLimitRegistration } from '@/lib/rate-limiter';

export async function POST(request: NextRequest) {
  // Apply rate limiting for registration attempts
  const rateLimitResponse = await rateLimitRegistration(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  // Skip CSRF validation for registration since user doesn't have session yet
  // Registration is protected by rate limiting and email verification instead

  try {
    // Parse and validate request data
    const data = await request.json();
    const validatedData = RegistrationSchema.parse(data);

    // Prepare data based on account type
    let name;
    let mappedAccountType: AccountType;
    if (validatedData.accountType === 'individual') {
      name = `${validatedData.firstName} ${validatedData.lastName}`;
      mappedAccountType = AccountType.PARTNER;
    } else {
      name = validatedData.companyName!;
      mappedAccountType = AccountType.COMPANY;
    }

    // Check if email already exists
    const existingUser = await prisma.user.findFirst({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return createErrorResponse(
        'Ten adres email jest już zarejestrowany',
        { field: 'email' },
        409
      );
    }

    // Check referral code if provided
    let referredById = null;
    if (validatedData.referralCode) {
      const referringUser = await prisma.user.findFirst({
        where: { referralCode: validatedData.referralCode },
      });

      if (referringUser) {
        referredById = referringUser.id;
      } else {
        return createErrorResponse(
          'Podany kod polecający jest nieprawidłowy',
          { field: 'referralCode' },
          400
        );
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);

    // Generate unique referral code for new user
    const newReferralCode = generateReferralCode();

    // Generate verification token
    const verificationToken = generateToken();

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        accountType: mappedAccountType,
        name,
        email: validatedData.email,
        password: hashedPassword,
        companyName: mappedAccountType === 'COMPANY' ? validatedData.companyName : null,
        phone: validatedData.phone || null,
        address: validatedData.address || null,
        referralCode: newReferralCode,
        referredById: referredById,
        verificationToken,
        isActive: false,
        isVerified: false,
        notifications: {
          create: {
            emailNewLeads: true,
            emailLeadUpdates: true,
            emailUserProgram: true,
            emailMarketing: false
          }
        }
      },
    });

    // Try to send welcome email with verification link
    const emailResult = await sendWelcomeEmail(validatedData.email, name, verificationToken);

    // Return success response
    if (emailResult.success) {
      return createSuccessResponse(
        'Rejestracja zakończona pomyślnie. Sprawdź swoją skrzynkę email, aby aktywować konto.',
        { userId: newUser.id },
        201
      );
    } else {
      // Log the email sending error but still return success since user is registered
      console.error('Welcome email failed to send:', emailResult.error);
      return createSuccessResponse(
        'Rejestracja zakończona pomyślnie. Wystąpił problem z wysłaniem emaila weryfikacyjnego. Skontaktuj się z obsługą, aby aktywować konto.',
        { 
          userId: newUser.id,
          emailSent: false,
          emailError: emailResult.error
        },
        201
      );
    }
  } catch (error) {
    console.error('Registration error:', error);
    
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
