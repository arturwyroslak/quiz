import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET handler to fetch notification settings
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Nie jesteś zalogowany' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { notifications: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'Użytkownik nie znaleziony' }, { status: 404 });
    }

    return NextResponse.json({ notifications: user.notifications });

  } catch (error) {
    console.error('Błąd podczas pobierania ustawień powiadomień:', error);
    return NextResponse.json({ error: 'Wystąpił błąd serwera' }, { status: 500 });
  }
}

// PUT handler to update notification settings
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Nie jesteś zalogowany' }, { status: 401 });
    }

    const { notifications } = await request.json();

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        notifications: {
          update: {
            emailNewLeads: notifications.emailNewLeads,
            emailLeadUpdates: notifications.emailLeadUpdates,
            emailUserProgram: notifications.emailUserProgram,
            emailMarketing: notifications.emailMarketing,
          },
        },
      },
      select: { notifications: true },
    });

    return NextResponse.json({ success: true, notifications: updatedUser.notifications });

  } catch (error) {
    console.error('Błąd podczas aktualizacji ustawień powiadomień:', error);
    return NextResponse.json({ error: 'Wystąpił błąd serwera' }, { status: 500 });
  }
}
