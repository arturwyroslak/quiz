import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { sessionId, questionId, value } = await request.json()

    if (!sessionId || !questionId || value === undefined) {
      return NextResponse.json({ error: 'sessionId, questionId, and value are required' }, { status: 400 })
    }

    const answer = await prisma.answer.create({
      data: {
        sessionId,
        questionId,
        value,
      },
    })

    return NextResponse.json(answer)
  } catch (error) {
    console.error('Error saving answer:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
