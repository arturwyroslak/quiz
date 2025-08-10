import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Pobieranie tokenu z parametrów URL
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    // Walidacja tokenu
    if (!token) {
      return NextResponse.json(
        { error: 'Brakujący token weryfikacyjny' },
        { status: 400 }
      );
    }

    // Pobieranie użytkownika z bazy danych na podstawie tokenu
    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    });

    // Sprawdzenie, czy użytkownik istnieje
    if (!user) {
      return NextResponse.json(
        { error: 'Nieprawidłowy token weryfikacyjny lub konto zostało już zweryfikowane' },
        { status: 400 }
      );
    }

    // Sprawdzenie, czy konto jest już zweryfikowane
    if (user.isVerified) {
      return NextResponse.json(
        { error: 'Konto zostało już zweryfikowane' },
        { status: 400 }
      );
    }

    // Aktualizacja statusu weryfikacji konta
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        isActive: true,
        verificationToken: null,
        updatedAt: new Date(),
      },
    });

    // Przekierowanie do strony logowania z komunikatem o sukcesie
    const loginUrl = new URL('/partner-program/login', request.url);
    loginUrl.searchParams.set('verified', 'true');
    return NextResponse.redirect(loginUrl);
  } catch (error) {
    console.error('Błąd podczas weryfikacji konta użytkownika:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas weryfikacji konta. Spróbuj ponownie później.' },
      { status: 500 }
    );
  }
}