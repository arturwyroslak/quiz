import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { hash } from "bcrypt";
import crypto from "crypto";
import { sendTeamMemberWelcomeEmail } from "@/lib/email/sender";

// Zod validation schema for team member creation
const TeamMemberSchema = z.object({
  name: z.string().min(2, { message: "Imię i nazwisko są wymagane" }),
  email: z.string().email({ message: "Wprowadź poprawny adres e-mail" }),
  phone: z.string().refine((val) => val === '' || /^\+?[0-9]{9,15}$/.test(val), {
    message: "Wprowadź poprawny numer telefonu",
  }).optional().transform(val => val === '' ? null : val),
  position: z.string().optional().transform(val => val === '' ? null : val),
  status: z.enum(['active', 'inactive']).default('active')
});

// GET: Fetch team members
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  // Check if user is authenticated and a company partner
  if (!session || session.user.accountType !== 'COMPANY') {
    return NextResponse.json(
      { error: "Unauthorized" }, 
      { status: 401 }
    );
  }

  try {
    // Fetch team members for the current company
    const teamMembersFromDb = await prisma.teamMember.findMany({
      where: { 
        companyId: session.user.id 
      }
    });

    // Map status to isActive for frontend compatibility
    const teamMembers = teamMembersFromDb.map(member => ({
      ...member,
      isActive: member.status === 'ACTIVE'
    }));

    return NextResponse.json(
      { 
        teamMembers, 
        total: teamMembers.length 
      }, 
      { status: 200 }
    );

  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { error: "Nie udało się pobrać listy pracowników" }, 
      { status: 500 }
    );
  }
}

// POST: Add new team member
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  // Check if user is authenticated and a company partner
  if (!session || session.user.accountType !== 'COMPANY') {
    return NextResponse.json(
      { error: "Unauthorized" }, 
      { status: 401 }
    );
  }

  try {
    // Parse and validate request body
    const body = await req.json();
    const validatedData = TeamMemberSchema.parse(body);
    const { name, email, phone, position, status } = validatedData;

    // Check if user with this email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Użytkownik o tym adresie e-mail już istnieje" }, { status: 409 });
    }

    // Generate token and temporary password
    const passwordSetupToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const temporaryPassword = await hash(crypto.randomBytes(32).toString("hex"), 12);

    // Use a transaction to create User and TeamMember
    await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          email,
          name,
          phone,
          password: temporaryPassword,
          accountType: 'TEAM_MEMBER',
          resetPasswordToken: passwordSetupToken,
          resetPasswordExpires: tokenExpiry,
          isVerified: false, // Will be verified when password is set
          isActive: status === 'active', // Set user's active status from form
        },
      });

      await tx.teamMember.create({
        data: {
          name,
          email,
          phone,
          position,
          status: status === 'active' ? 'ACTIVE' : 'INACTIVE',
          companyId: session.user.id,
        },
      });
    });

    // Send password setup email
    await sendTeamMemberWelcomeEmail(email, name, passwordSetupToken);

    return NextResponse.json(
      { 
        message: "Pracownik został pomyślnie dodany. E-mail z instrukcjami został wysłany."
      }, 
      { status: 201 }
    );

  } catch (error) {
    console.error('Error adding team member:', error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: "Błąd walidacji", 
          details: error.errors 
        }, 
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Nie udało się dodać pracownika" }, 
      { status: 500 }
    );
  }
}

// PUT: Update team member status
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  // Check if user is authenticated and a company partner
  if (!session || session.user.accountType !== 'COMPANY') {
    return NextResponse.json(
      { error: "Unauthorized" }, 
      { status: 401 }
    );
  }

  try {
    const { teamMemberId, status } = await req.json();

    // Validate status
    const statusSchema = z.enum(['active', 'inactive']);
    const validatedStatus = statusSchema.parse(status);

    // Verify team member belongs to the company
    const teamMember = await prisma.teamMember.findUnique({
      where: { 
        id: teamMemberId,
        companyId: session.user.id 
      }
    });

    if (!teamMember) {
      return NextResponse.json(
        { error: "Nie znaleziono pracownika" }, 
        { status: 404 }
      );
    }

    // Update team member status
    const updatedTeamMember = await prisma.teamMember.update({
      where: { id: teamMemberId },
      data: { status: validatedStatus === 'active' ? 'ACTIVE' : 'INACTIVE' }
    });

    return NextResponse.json(
      { 
        message: "Status pracownika został zaktualizowany", 
        teamMember: updatedTeamMember 
      }, 
      { status: 200 }
    );

  } catch (error) {
    console.error('Error updating team member status:', error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: "Błąd walidacji", 
          details: error.errors 
        }, 
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Nie udało się zaktualizować statusu pracownika" }, 
      { status: 500 }
    );
  }
} 