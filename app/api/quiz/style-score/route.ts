import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { sessionId, styleId, score, imageId } = await request.json()

    if (!sessionId || !styleId || score === undefined || !imageId) {
      return NextResponse.json(
        { error: 'sessionId, styleId, score, and imageId are required' },
        { status: 400 }
      )
    }

    const styleScorePromise = prisma.styleScore.upsert({
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

    const detailScoreChange = score / 2 // +1 for right swipe, -1 for left
    const imageTags = await prisma.imageTag.findMany({
      where: { styleImageId: imageId },
      select: { detailId: true },
    })

    const detailIds = imageTags.map((tag) => tag.detailId)

    const detailScorePromises = detailIds.map((detailId) =>
      prisma.detailScore.upsert({
        where: { sessionId_detailId: { sessionId, detailId } },
        update: { score: { increment: detailScoreChange } },
        create: { sessionId, detailId, score: detailScoreChange },
      })
    )

    const [styleScore, ...detailScores] = await prisma.$transaction([
      styleScorePromise,
      ...detailScorePromises,
    ])

    return NextResponse.json({ styleScore, detailScores })
  } catch (error) {
    console.error('Error saving style score:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
