import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Sprawdzenie czy użytkownik jest zalogowany
    const session = await getServerSession(authOptions);
    
    // Tworzenie odpowiedzi
    const response = NextResponse.json(
      {
        success: true,
        message: 'Wylogowanie zakończone pomyślnie',
      },
      { status: 200 }
    );

    // NextAuth obsługuje wylogowanie automatycznie przez session management
    // Usuwamy wszystkie cookies związane z sesją
    response.cookies.delete('next-auth.session-token');
    response.cookies.delete('next-auth.callback-url');
    response.cookies.delete('next-auth.csrf-token');

    return response;
  } catch (error) {
    console.error('Błąd podczas wylogowywania partnera:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas wylogowywania. Spróbuj ponownie później.' },
      { status: 500 }
    );
  }
}