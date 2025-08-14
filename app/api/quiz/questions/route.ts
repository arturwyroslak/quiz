import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const quizId = searchParams.get('quizId')

  if (!quizId) {
    return NextResponse.json({ error: 'quizId is required' }, { status: 400 })
  }

  try {
    const questionsFromDb = await prisma.question.findMany({
      where: {
        quizId: quizId,
      },
      orderBy: {
        order: 'asc',
      },
    })

    // Parse string fields into arrays
    const questions = questionsFromDb.map(q => ({
      ...q,
      tags: q.tags ? q.tags.split(',').map(tag => tag.trim()) : [],
      relevantRooms: q.relevantRooms ? q.relevantRooms.split(',').map(room => room.trim()) : [],
    }));


    return NextResponse.json(questions)
  } catch (error) {
    console.error('Error fetching questions:', error)
    // It's good practice to not expose raw error messages to the client
    if (error instanceof Error) {
        // Log the actual error for debugging
        console.error(error.message);
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
