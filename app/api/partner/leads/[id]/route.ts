import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Pobieranie szczegółów leada
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Pobieranie i weryfikacja sesji NextAuth
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Nie jesteś zalogowany' },
        { status: 401 }
      );
    }

    const leadId = params.id;

    // Pobieranie leada
    const lead = await prisma.lead.findFirst({
      where: {
        id: leadId,
        partnerId: session.user.id,
      },
    });

    if (!lead) {
      return NextResponse.json(
        { error: 'Lead nie został znaleziony' },
        { status: 404 }
      );
    }

    return NextResponse.json({ lead });
  } catch (error) {
    console.error('Błąd podczas pobierania leada:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas pobierania leada' },
      { status: 500 }
    );
  }
}

// Aktualizacja leada
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Pobieranie i weryfikacja sesji NextAuth
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Nie jesteś zalogowany' },
        { status: 401 }
      );
    }

    const leadId = params.id;
    const data = await request.json();

    // Sprawdzenie, czy lead istnieje i należy do partnera
    const existingLead = await prisma.lead.findFirst({
      where: {
        id: leadId,
        partnerId: session.user.id,
      },
    });

    if (!existingLead) {
      return NextResponse.json(
        { error: 'Lead nie został znaleziony' },
        { status: 404 }
      );
    }

    // Przygotowanie danych do aktualizacji
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.company !== undefined) updateData.company = data.company;
    if (data.source !== undefined) updateData.source = data.source;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.notes !== undefined) updateData.notes = data.notes;
    updateData.updatedAt = new Date();

    // Aktualizacja leada
    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: 'Lead został pomyślnie zaktualizowany',
      lead: updatedLead,
    });
  } catch (error) {
    console.error('Błąd podczas aktualizacji leada:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas aktualizacji leada' },
      { status: 500 }
    );
  }
}

// Usuwanie leada
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Pobieranie i weryfikacja sesji NextAuth
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Nie jesteś zalogowany' },
        { status: 401 }
      );
    }

    const leadId = params.id;

    // Sprawdzenie, czy lead istnieje i należy do partnera
    const existingLead = await prisma.lead.findFirst({
      where: {
        id: leadId,
        partnerId: session.user.id,
      },
    });

    if (!existingLead) {
      return NextResponse.json(
        { error: 'Lead nie został znaleziony' },
        { status: 404 }
      );
    }

    // Usuwanie leada
    await prisma.lead.delete({
      where: { id: leadId },
    });

    return NextResponse.json({
      success: true,
      message: 'Lead został pomyślnie usunięty',
    });
  } catch (error) {
    console.error('Błąd podczas usuwania leada:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas usuwania leada' },
      { status: 500 }
    );
  }
}