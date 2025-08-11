import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { sessionId, styleImageId, text } = await request.json()

    if (!sessionId || !styleImageId || !text) {
      return NextResponse.json({ error: 'sessionId, styleImageId, and text are required' }, { status: 400 })
    }

    const comment = await prisma.comment.create({
      data: {
        sessionId,
        styleImageId,
        text,
      },
    })

    return NextResponse.json(comment)
  } catch (error) {
    console.error('Error saving comment:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
