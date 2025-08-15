import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Create new session
export async function POST(request: Request) {
  try {
    const { quizId, userId, selectedRooms } = await request.json()

    if (!quizId) {
      return NextResponse.json({ error: 'quizId is required' }, { status: 400 })
    }

    const session = await prisma.quizSession.create({
      data: {
        quizId,
        userId,
      },
    })

    // Add selected rooms to session if provided
    if (selectedRooms && selectedRooms.length > 0) {
      const rooms = await prisma.room.findMany({
        where: { name: { in: selectedRooms } }
      });

      await prisma.quizSessionRoom.createMany({
        data: rooms.map(room => ({
          sessionId: session.id,
          roomId: room.id
        }))
      });
    }

    return NextResponse.json(session)
  } catch (error) {
    console.error('Error creating quiz session:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// Get session details or resume session
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get('sessionId');
    const userId = url.searchParams.get('userId');

    if (sessionId) {
      // Get specific session
      const session = await prisma.quizSession.findUnique({
        where: { id: sessionId },
        include: {
          rooms: {
            include: {
              room: true
            }
          },
          styleScores: {
            include: {
              style: true
            }
          },
          detailScores: {
            include: {
              detail: true
            }
          },
          comments: true
        }
      });

      if (!session) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
      }

      return NextResponse.json(session);
    } else if (userId) {
      // Get user's incomplete sessions for resume
      const incompleteSessions = await prisma.quizSession.findMany({
        where: {
          userId,
          isCompleted: false
        },
        include: {
          quiz: true,
          rooms: {
            include: {
              room: true
            }
          }
        },
        orderBy: {
          updatedAt: 'desc'
        }
      });

      return NextResponse.json(incompleteSessions);
    }

    return NextResponse.json({ error: 'sessionId or userId required' }, { status: 400 });
  } catch (error) {
    console.error('Error fetching session:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// Update session (for pause/resume functionality)
export async function PATCH(request: Request) {
  try {
    const { sessionId, isCompleted, lastStep, progress } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
    }

    const updateData: any = {
      updatedAt: new Date()
    };

    if (isCompleted !== undefined) {
      updateData.isCompleted = isCompleted;
    }

    // Store session state for resume functionality
    // This could be expanded to store current quiz step, progress, etc.
    
    const session = await prisma.quizSession.update({
      where: { id: sessionId },
      data: updateData
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error('Error updating session:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
