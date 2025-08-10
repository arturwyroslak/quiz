import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Pobieranie historii leada
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Pobieranie i weryfikacja tokenu
    const token = request.cookies.get('partner_token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Nie jesteś zalogowany' },
        { status: 401 }
      );
    }

    const leadId = params.id;

    // Sprawdzenie, czy lead należy do partnera
    const lead = await prisma.lead.findFirst({
      where: {
        id: leadId,
        partnerId: token, // Użyj tokenu z cookies jako partnerId
      },
    });

    if (!lead) {
      return NextResponse.json(
        { error: 'Lead nie został znaleziony' },
        { status: 404 }
      );
    }

    // Pobieranie historii leada
    const history = await prisma.leadHistory.findMany({
      where: { leadId: leadId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ history });
  } catch (error) {
    console.error('Błąd podczas pobierania historii leada:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas pobierania historii leada' },
      { status: 500 }
    );
  }
}

// Dodawanie wpisu do historii leada
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Pobieranie i weryfikacja tokenu
    const token = request.cookies.get('partner_token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Nie jesteś zalogowany' },
        { status: 401 }
      );
    }

    const leadId = params.id;
    const data = await request.json();

    // Sprawdzenie, czy lead należy do partnera
    const lead = await prisma.lead.findFirst({
      where: {
        id: leadId,
        partnerId: token, // Użyj tokenu z cookies jako partnerId
      },
    });

    if (!lead) {
      return NextResponse.json(
        { error: 'Lead nie został znaleziony' },
        { status: 404 }
      );
    }

    // Walidacja danych
    if (!data.action) {
      return NextResponse.json(
        { error: 'Akcja jest wymagana' },
        { status: 400 }
      );
    }

    // Dodawanie wpisu do historii
    const historyEntry = await prisma.leadHistory.create({
      data: {
        leadId: leadId,
        action: data.action,
        user: data.user || 'Partner',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Wpis do historii został dodany',
      historyEntry,
    });
  } catch (error) {
    console.error('Błąd podczas dodawania wpisu do historii:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas dodawania wpisu do historii' },
      { status: 500 }
    );
  }
} 