"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, Clock, RotateCcw, Target } from 'lucide-react'

interface QuizInsights {
  totalSwipes: number;
  likedCount: number;
  rejectedStyles: number;
  averageReactionTime?: number;
  decisionChanges: number;
  confidenceLevel: 'high' | 'medium' | 'low';
  dominantCategories: string[];
  sessionDuration: number;
}

interface QuizInsightsPanelProps {
  insights: QuizInsights;
  currentStep: string;
  totalSteps: number;
}

export function QuizInsightsPanel({ insights, currentStep, totalSteps }: QuizInsightsPanelProps) {
  const {
    totalSwipes,
    likedCount,
    rejectedStyles,
    averageReactionTime,
    decisionChanges,
    confidenceLevel,
    dominantCategories,
    sessionDuration
  } = insights;

  const likeRate = totalSwipes > 0 ? (likedCount / totalSwipes) * 100 : 0;
  const changeRate = totalSwipes > 0 ? (decisionChanges / totalSwipes) * 100 : 0;

  const getConfidenceColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConfidenceIcon = (level: string) => {
    switch (level) {
      case 'high': return '🎯';
      case 'medium': return '🤔';
      case 'low': return '❓';
      default: return '⭐';
    }
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  if (totalSwipes === 0) {
    return null; // Don't show insights until user starts interacting
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-[#FEFCF8] to-[#F8F4EF] border-[#b38a34]/20">
      <CardHeader className="pb-3">
        <CardTitle className="font-heading-semibold text-lg flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#b38a34]" />
          Twoje Preferencje
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Confidence Level */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-body-medium text-gray-600">Pewność wyborów:</span>
          <Badge className={`${getConfidenceColor(confidenceLevel)} font-body-semibold`}>
            {getConfidenceIcon(confidenceLevel)} {confidenceLevel === 'high' ? 'Wysoka' : confidenceLevel === 'medium' ? 'Średnia' : 'Niska'}
          </Badge>
        </div>

        {/* Like Rate */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-body-medium text-gray-600">Współczynnik polubień:</span>
            <span className="text-sm font-body-semibold text-[#b38a34]">{Math.round(likeRate)}%</span>
          </div>
          <Progress value={likeRate} className="h-2" />
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-green-600" />
            <span className="text-gray-600">Polubienia: <strong>{likedCount}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-orange-600" />
            <span className="text-gray-600">Zmiany: <strong>{decisionChanges}</strong></span>
          </div>
          {averageReactionTime && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-gray-600">Czas: <strong>{Math.round(averageReactionTime/1000)}s</strong></span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 text-red-600 font-bold">✕</span>
            <span className="text-gray-600">Odrzucone: <strong>{rejectedStyles}</strong></span>
          </div>
        </div>

        {/* Dominant Categories */}
        {dominantCategories.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm font-body-medium text-gray-600">Ulubione kategorie:</span>
            <div className="flex flex-wrap gap-1">
              {dominantCategories.slice(0, 3).map(category => (
                <Badge key={category} variant="outline" className="text-xs font-body-regular">
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Adaptive Recommendations */}
        {confidenceLevel === 'low' && changeRate > 20 && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800 font-body-regular">
              💡 Widzimy, że się wahasz. Może spróbuj skupić się na pierwszym wrażeniu lub skorzystaj z komentarzy?
            </p>
          </div>
        )}

        {likeRate < 20 && totalSwipes > 10 && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800 font-body-regular">
              💡 Mało polubień? Spróbuj dodać komentarze opisujące, czego szukasz.
            </p>
          </div>
        )}

        {likeRate > 80 && totalSwipes > 5 && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs text-green-800 font-body-regular">
              ✨ Świetnie! Masz wyraźne preferencje. Quiz może zakończyć się wcześniej.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}