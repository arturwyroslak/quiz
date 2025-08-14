import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (!user || user.accountType !== 'COMPANY') {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const body = await request.json();
    const { name, email, phone, position, status } = body;

    // Validate required fields
    if (!name || !email) {
      return new NextResponse('Name and email are required', { status: 400 });
    }

    // Check if team member exists and belongs to the company
    const existingMember = await prisma.teamMember.findFirst({
      where: {
        id: params.id,
        companyId: user.id,
      },
    });

    if (!existingMember) {
      return new NextResponse('Team member not found', { status: 404 });
    }

    // Check if new email is already in use by another team member
    if (email !== existingMember.email) {
      const emailInUse = await prisma.teamMember.findFirst({
        where: {
          email,
          NOT: {
            id: params.id,
          },
        },
      });

      if (emailInUse) {
        return new NextResponse('Email already in use', { status: 400 });
      }
    }

    const updatedMember = await prisma.teamMember.update({
      where: { id: params.id },
      data: {
        name,
        email,
        phone,
        position,
        status: status === 'active' ? 'ACTIVE' : 'INACTIVE',
      },
    });

    return NextResponse.json(updatedMember);
  } catch (error) {
    console.error('Error updating team member:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (!user || user.accountType !== 'COMPANY') {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Check if team member exists and belongs to the company
    const existingMember = await prisma.teamMember.findFirst({
      where: {
        id: params.id,
        companyId: user.id,
      },
    });

    if (!existingMember) {
      return new NextResponse('Team member not found', { status: 404 });
    }

    // Delete the team member
    await prisma.teamMember.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting team member:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 