import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Pobieranie szczegółów zadania
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

    const payload = await getToken({ req: request });
    if (!payload || !payload.id) {
      return NextResponse.json(
        { error: 'Nieprawidłowy token' },
        { status: 401 }
      );
    }

    const taskId = params.id;

    // Pobieranie zadania
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        partnerId: payload.id,
      },
      include: {
        lead: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
            phone: true,
          },
        },
      },
    });

    if (!task) {
      return NextResponse.json(
        { error: 'Zadanie nie zostało znalezione' },
        { status: 404 }
      );
    }

    return NextResponse.json({ task });
  } catch (error) {
    console.error('Błąd podczas pobierania zadania:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas pobierania zadania' },
      { status: 500 }
    );
  }
}

// Aktualizacja zadania
export async function PUT(
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

    const payload = await getToken({ req: request });
    if (!payload || !payload.id) {
      return NextResponse.json(
        { error: 'Nieprawidłowy token' },
        { status: 401 }
      );
    }

    const taskId = params.id;
    const data = await request.json();

    // Sprawdzenie, czy zadanie istnieje i należy do partnera
    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        partnerId: payload.id,
      },
    });

    if (!existingTask) {
      return NextResponse.json(
        { error: 'Zadanie nie zostało znalezione' },
        { status: 404 }
      );
    }

    // Sprawdzenie, czy lead istnieje (jeśli podany)
    if (data.leadId) {
      const lead = await prisma.lead.findFirst({
        where: { 
          id: data.leadId,
          partnerId: payload.id 
        },
      });

      if (!lead) {
        return NextResponse.json(
          { error: 'Nieprawidłowy lead' },
          { status: 400 }
        );
      }
    }

    // Przygotowanie danych do aktualizacji
    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.leadId !== undefined) updateData.leadId = data.leadId;
    if (data.dueDate !== undefined) {
      updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    }
    updateData.updatedAt = new Date();

    // Aktualizacja zadania
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
      include: {
        lead: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Zadanie zostało pomyślnie zaktualizowane',
      task: updatedTask,
    });
  } catch (error) {
    console.error('Błąd podczas aktualizacji zadania:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas aktualizacji zadania' },
      { status: 500 }
    );
  }
}

// Usuwanie zadania
export async function DELETE(
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

    const payload = await getToken({ req: request });
    if (!payload || !payload.id) {
      return NextResponse.json(
        { error: 'Nieprawidłowy token' },
        { status: 401 }
      );
    }

    const taskId = params.id;

    // Sprawdzenie, czy zadanie istnieje i należy do partnera
    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        partnerId: payload.id,
      },
    });

    if (!existingTask) {
      return NextResponse.json(
        { error: 'Zadanie nie zostało znalezione' },
        { status: 404 }
      );
    }

    // Usuwanie zadania
    await prisma.task.delete({
      where: { id: taskId },
    });

    return NextResponse.json({
      success: true,
      message: 'Zadanie zostało pomyślnie usunięte',
    });
  } catch (error) {
    console.error('Błąd podczas usuwania zadania:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas usuwania zadania' },
      { status: 500 }
    );
  }
} 