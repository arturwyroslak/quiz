import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { quizId, userId } = await request.json()

    if (!quizId) {
      return NextResponse.json({ error: 'quizId is required' }, { status: 400 })
    }

    const session = await prisma.quizSession.create({
      data: {
        quizId,
        userId,
      },
    })

    return NextResponse.json(session)
  } catch (error) {
    console.error('Error creating quiz session:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
