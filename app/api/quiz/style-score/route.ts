import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { 
      sessionId, 
      styleId, 
      imageId, 
      styleScoreChange,
      detailScoreChange,
      detailIds,
      interactionType,
      reactionTime,
      isDecisionChange = false
    } = await request.json()

    if (!sessionId || !styleId || styleScoreChange === undefined || !imageId) {
      return NextResponse.json(
        { error: 'sessionId, styleId, styleScoreChange, and imageId are required' },
        { status: 400 }
      )
    }

    // Enhanced scoring according to documentation:
    // Right swipe: +2 points for style, +1 point for all tag materials/details
    // Left swipe: -2 points for style, -1 point for tag materials/details 
    // Comment: ±3 points for specific detail based on sentiment

    const styleScorePromise = prisma.styleScore.upsert({
      where: {
        sessionId_styleId: {
          sessionId,
          styleId,
        },
      },
      update: {
        score: {
          increment: styleScoreChange,
        },
      },
      create: {
        sessionId,
        styleId,
        score: styleScoreChange,
      },
    })

    // Update detail scores for tagged elements
    let detailScorePromises: any[] = [];
    if (detailIds && detailIds.length > 0) {
      detailScorePromises = detailIds.map((detailId: string) =>
        prisma.detailScore.upsert({
          where: { sessionId_detailId: { sessionId, detailId } },
          update: { score: { increment: detailScoreChange } },
          create: { sessionId, detailId, score: detailScoreChange },
        })
      );
    } else {
      // Fallback to get detail IDs from image tags
      const imageTags = await prisma.imageTag.findMany({
        where: { styleImageId: imageId },
        select: { detailId: true },
      })
      
      const imageDetailIds = imageTags.map((tag) => tag.detailId);
      detailScorePromises = imageDetailIds.map((detailId) =>
        prisma.detailScore.upsert({
          where: { sessionId_detailId: { sessionId, detailId } },
          update: { score: { increment: detailScoreChange || (styleScoreChange > 0 ? 1 : -1) } },
          create: { sessionId, detailId, score: detailScoreChange || (styleScoreChange > 0 ? 1 : -1) },
        })
      );
    }

    // Track behavioral analytics if provided
    const analyticsPromise = reactionTime || isDecisionChange ? 
      prisma.quizAnalytics.create({
        data: {
          sessionId,
          styleId,
          imageId,
          interactionType: interactionType || 'swipe',
          reactionTime,
          isDecisionChange,
          metadata: {
            detailIds,
            styleScoreChange,
            detailScoreChange
          }
        }
      }) : Promise.resolve(null);

    const [styleScore, ...detailScores] = await prisma.$transaction([
      styleScorePromise,
      ...detailScorePromises,
    ]);

    // Store analytics separately to avoid transaction issues
    let analyticsData = null;
    if (reactionTime || isDecisionChange) {
      try {
        analyticsData = await analyticsPromise;
      } catch (error) {
        console.warn('Failed to store analytics data:', error);
      }
    }

    return NextResponse.json({ 
      styleScore, 
      detailScores,
      analyticsTracked: !!analyticsData
    })
  } catch (error) {
    console.error('Error saving style score:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
