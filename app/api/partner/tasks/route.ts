import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Pobieranie listy zadań partnera
export async function GET(request: NextRequest) {
  try {
    // Pobieranie i weryfikacja sesji
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Nie jesteś zalogowany' },
        { status: 401 }
      );
    }

    // Pobieranie parametrów zapytania
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Obliczanie offsetu dla paginacji
    const offset = (page - 1) * limit;

    // Budowanie warunków zapytania
    const where: any = { partnerId: session.user.id };
    if (status) {
      where.status = status;
    }
    if (priority) {
      where.priority = priority;
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Budowanie sortowania
    const orderBy: any = {};
    if (sortBy) {
      orderBy[sortBy] = sortOrder;
    }

    // Wykonanie zapytania z paginacją
    const tasksData = await prisma.task.findMany({
      where,
      orderBy,
      skip: offset,
      take: limit,
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

    // Pobieranie całkowitej liczby zadań (dla paginacji)
    const totalTasks = await prisma.task.count({ where });
    const totalPages = Math.ceil(totalTasks / limit);

    return NextResponse.json({
      tasks: tasksData,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalTasks,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.error('Błąd podczas pobierania zadań partnera:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas pobierania zadań' },
      { status: 500 }
    );
  }
}

// Dodawanie nowego zadania
export async function POST(request: NextRequest) {
  try {
    // Pobieranie i weryfikacja sesji
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Nie jesteś zalogowany' },
        { status: 401 }
      );
    }

    // Pobieranie danych z żądania
    const data = await request.json();

    // Walidacja danych
    if (!data.title) {
      return NextResponse.json(
        { error: 'Tytuł zadania jest wymagany' },
        { status: 400 }
      );
    }

    // Sprawdzenie, czy lead istnieje (jeśli podany)
    if (data.leadId) {
      const lead = await prisma.lead.findFirst({
        where: { 
          id: data.leadId,
          partnerId: session.user.id
        },
      });

      if (!lead) {
        return NextResponse.json(
          { error: 'Nieprawidłowy lead' },
          { status: 400 }
        );
      }
    }

    // Dodawanie nowego zadania
    const newTask = await prisma.task.create({
      data: {
        partnerId: session.user.id,
        leadId: data.leadId || null,
        title: data.title,
        description: data.description || null,
        priority: data.priority || 'medium',
        status: 'pending',
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      },
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
      message: 'Zadanie zostało pomyślnie dodane',
      task: newTask,
    });
  } catch (error) {
    console.error('Błąd podczas dodawania nowego zadania:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas dodawania nowego zadania' },
      { status: 500 }
    );
  }
} 