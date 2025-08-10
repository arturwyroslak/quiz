import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    if (session.user.accountType !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    // Fetch all users with their details
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        accountType: true,
        isVerified: true,
        isActive: true,
        phone: true,
        companyName: true,
        createdAt: true,
        updatedAt: true,
        // Don't include password or sensitive data
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ users }, { status: 200 });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    if (session.user.accountType !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const { email, name, accountType, isActive, companyName, phone } = await request.json();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(tempPassword, 12);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        accountType,
        isActive,
        isVerified: true, // Admin-created users are automatically verified
        companyName: accountType === 'COMPANY' ? companyName : null,
        phone
      }
    });

    // Send welcome email with temporary password
    try {
      const { sendWelcomeEmail } = await import('@/lib/email/sender');
      const emailSent = await sendWelcomeEmail(email, name, tempPassword);
      
      if (!emailSent) {
        console.warn(`Failed to send welcome email to ${email}`);
      }
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
    }

    return NextResponse.json({ 
      message: 'User created successfully and welcome email sent',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        accountType: newUser.accountType,
        isActive: newUser.isActive
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
