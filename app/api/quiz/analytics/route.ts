import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
    }

    // Get comprehensive analytics for the session
    const analytics = await prisma.quizAnalytics.findMany({
      where: { sessionId },
      orderBy: { timestamp: 'asc' }
    });

    // Calculate behavioral insights
    const totalInteractions = analytics.length;
    const decisionChanges = analytics.filter(a => a.isDecisionChange).length;
    const averageReactionTime = analytics
      .filter(a => a.reactionTime !== null)
      .reduce((sum, a) => sum + (a.reactionTime || 0), 0) / 
      Math.max(analytics.filter(a => a.reactionTime !== null).length, 1);

    const interactionTypes = analytics.reduce((acc, a) => {
      acc[a.interactionType] = (acc[a.interactionType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Session duration
    const sessionStart = analytics[0]?.timestamp;
    const sessionEnd = analytics[analytics.length - 1]?.timestamp;
    const sessionDuration = sessionStart && sessionEnd ? 
      new Date(sessionEnd).getTime() - new Date(sessionStart).getTime() : 0;

    const insights = {
      totalInteractions,
      decisionChanges,
      decisionChangeRate: totalInteractions > 0 ? decisionChanges / totalInteractions : 0,
      averageReactionTime: Math.round(averageReactionTime),
      sessionDuration,
      interactionTypes,
      confidenceLevel: decisionChanges < 3 ? 'high' : decisionChanges < 6 ? 'medium' : 'low'
    };

    return NextResponse.json({
      analytics,
      insights
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}