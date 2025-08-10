import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { hashPassword, verifyPassword } from '@/lib/utils';

// Pobieranie danych konta użytkownika
export async function GET(request: NextRequest) {
  try {
    // Pobieranie i weryfikacja sesji NextAuth
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Nie jesteś zalogowany' },
        { status: 401 }
      );
    }

    // Pobieranie danych użytkownika
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        notifications: true
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Użytkownik nie został znaleziony' },
        { status: 404 }
      );
    }

    // Usunięcie wrażliwych danych przed wysłaniem odpowiedzi
    const { password, ...safeUserData } = user;

    return NextResponse.json({ user: safeUserData });
  } catch (error) {
    console.error('Błąd podczas pobierania danych konta użytkownika:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas pobierania danych konta' },
      { status: 500 }
    );
  }
}

// Aktualizacja danych konta użytkownika
export async function PUT(request: NextRequest) {
  try {
    // Pobieranie i weryfikacja sesji NextAuth
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Nie jesteś zalogowany' },
        { status: 401 }
      );
    }

    // Pobieranie danych z żądania
    const data = await request.json();
    
    // Pobieranie bieżących danych użytkownika
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Użytkownik nie został znaleziony' },
        { status: 404 }
      );
    }

    // Walidacja danych
    const updateData: any = {};

    // Aktualizacja danych osobowych
    if (data.personalData) {
      if (data.personalData.name) {
        updateData.name = data.personalData.name;
      }
      if (data.personalData.company) {
        updateData.company = data.personalData.company;
      }
      if (data.personalData.phone) {
        updateData.phone = data.personalData.phone;
      }
      if (data.personalData.address) {
        updateData.address = data.personalData.address;
      }
    }

    // Aktualizacja hasła
    if (data.passwordChange) {
      if (!data.passwordChange.currentPassword || !data.passwordChange.newPassword) {
        return NextResponse.json(
          { error: 'Podaj obecne i nowe hasło' },
          { status: 400 }
        );
      }

      // Sprawdzenie obecnego hasła
      const isCurrentPasswordValid = await verifyPassword(
        data.passwordChange.currentPassword,
        currentUser.password
      );

      if (!isCurrentPasswordValid) {
        return NextResponse.json(
          { error: 'Obecne hasło jest nieprawidłowe' },
          { status: 400 }
        );
      }

      // Hashowanie nowego hasła
      const newPasswordHash = await hashPassword(data.passwordChange.newPassword);
      updateData.password = newPasswordHash;
    }

    // Wykonanie aktualizacji danych użytkownika
    if (Object.keys(updateData).length > 0) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          ...updateData,
          updatedAt: new Date(),
        },
      });
    }

    // Aktualizacja ustawień powiadomień
    if (data.notificationSettings) {
      await prisma.userNotification.update({
        where: { userId: session.user.id },
        data: {
          emailNewLeads: data.notificationSettings.emailNewLeads,
          emailLeadUpdates: data.notificationSettings.emailLeadUpdates,
          emailUserProgram: data.notificationSettings.emailUserProgram,
          emailMarketing: data.notificationSettings.emailMarketing,
          updatedAt: new Date(),
        },
      });
    }

    return NextResponse.json({ success: true, message: 'Dane konta zostały zaktualizowane' });
  } catch (error) {
    console.error('Błąd podczas aktualizacji danych konta użytkownika:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas aktualizacji danych konta' },
      { status: 500 }
    );
  }
}