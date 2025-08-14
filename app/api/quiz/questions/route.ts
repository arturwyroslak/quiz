import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const quizId = searchParams.get('quizId')

  if (!quizId) {
    return NextResponse.json({ error: 'quizId is required' }, { status: 400 })
  }

  try {
    const questions = await prisma.question.findMany({
      where: {
        quizId: quizId,
      },
    })

    return NextResponse.json(questions)
  } catch (error) {
    console.error('Error fetching questions:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
