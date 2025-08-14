import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { createErrorResponse, createSuccessResponse, handleGenericError } from '@/lib/error-handler';
import { logger } from '@/lib/logger';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return createErrorResponse('Unauthorized', null, 401);
    }

    const company = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!company || company.accountType !== 'COMPANY') {
      return createErrorResponse('Forbidden', null, 403);
    }

    const body = await request.json();
    const { name, email, phone, position, status } = body;

    if (!name || !email) {
      return createErrorResponse('Imię i nazwisko oraz email są wymagane', null, 400);
    }

    const existingMember = await prisma.teamMember.findFirst({
      where: { id: params.id, companyId: company.id },
    });

    if (!existingMember) {
      return createErrorResponse('Członek zespołu nie został znaleziony', null, 404);
    }

    if (email !== existingMember.email) {
      const emailInUse = await prisma.user.findUnique({ where: { email } });
      if (emailInUse) {
        return createErrorResponse('Ten adres email jest już używany', { field: 'email' }, 409);
      }
    }

    const updatedMember = await prisma.teamMember.update({
      where: { id: params.id },
      data: { name, email, phone, position, status: status === 'active' ? 'ACTIVE' : 'INACTIVE' },
    });

    return createSuccessResponse('Dane członka zespołu zostały zaktualizowane', { member: updatedMember });

  } catch (error) {
    logger.error('Error updating team member', {
      error: error instanceof Error ? error.message : 'Unknown error',
      memberId: params.id
    });
    return handleGenericError(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return createErrorResponse('Unauthorized', null, 401);
    }

    const company = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!company || company.accountType !== 'COMPANY') {
      return createErrorResponse('Forbidden', null, 403);
    }

    const existingMember = await prisma.teamMember.findFirst({
      where: { id: params.id, companyId: company.id },
    });

    if (!existingMember) {
      return createErrorResponse('Członek zespołu nie został znaleziony', null, 404);
    }

    await prisma.teamMember.delete({
      where: { id: params.id },
    });

    return createSuccessResponse('Członek zespołu został usunięty', null, 200);
  } catch (error) {
    logger.error('Error deleting team member', {
      error: error instanceof Error ? error.message : 'Unknown error',
      memberId: params.id
    });
    return handleGenericError(error);
  }
} 