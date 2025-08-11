import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { sessionId, styleId, score } = await request.json()

    if (!sessionId || !styleId || score === undefined) {
      return NextResponse.json({ error: 'sessionId, styleId, and score are required' }, { status: 400 })
    }

    // Upsert to handle existing scores for the same style in the same session
    const styleScore = await prisma.styleScore.upsert({
      where: {
        sessionId_styleId: {
          sessionId,
          styleId,
        },
      },
      update: {
        score: {
          increment: score,
        },
      },
      create: {
        sessionId,
        styleId,
        score,
      },
    })

    return NextResponse.json(styleScore)
  } catch (error) {
    console.error('Error saving style score:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
