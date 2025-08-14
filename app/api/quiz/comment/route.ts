import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { CommentSentiment } from '@prisma/client'

export async function POST(request: Request) {
  try {
    const { sessionId, styleImageId, text, sentiment, x, y, w, h } = await request.json()

    if (!sessionId || !styleImageId || !text) {
      return NextResponse.json({ error: 'sessionId, styleImageId, and text are required' }, { status: 400 })
    }

    let imageTagId: string | undefined = undefined
    let scoreChange = 0
    if (sentiment === 'positive') scoreChange = 3
    if (sentiment === 'negative') scoreChange = -3

    // Find if the comment was made on a tagged detail
    if (x !== null && y !== null && w !== null && h !== null) {
      const tagsOnImage = await prisma.imageTag.findMany({ where: { styleImageId } })
      const clickedTag = tagsOnImage.find(
        (tag) => x >= tag.x && x <= tag.x + tag.width && y >= tag.y && y <= tag.y + tag.height
      )

      if (clickedTag) {
        imageTagId = clickedTag.id
        if (scoreChange !== 0) {
          await prisma.detailScore.upsert({
            where: { sessionId_detailId: { sessionId, detailId: clickedTag.detailId } },
            update: { score: { increment: scoreChange } },
            create: { sessionId, detailId: clickedTag.detailId, score: scoreChange },
          })
        }
      }
    }

    const comment = await prisma.comment.create({
      data: {
        sessionId,
        styleImageId,
        text,
        sentiment: sentiment || 'neutral',
        x,
        y,
        w,
        h,
        imageTagId,
      },
    })

    return NextResponse.json(comment)
  } catch (error) {
    console.error('Error saving comment:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
