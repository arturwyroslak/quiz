import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { sessionId, styleImageId, text, x, y } = await request.json()

    if (!sessionId || !styleImageId || !text) {
      return NextResponse.json({ error: 'sessionId, styleImageId, and text are required' }, { status: 400 })
    }

    const comment = await prisma.comment.create({
      data: {
        sessionId,
        styleImageId,
        text,
        x,
        y,
      },
    })

    return NextResponse.json(comment)
  } catch (error) {
    console.error('Error saving comment:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
