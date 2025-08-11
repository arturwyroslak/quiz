"use client"

import React, { useState, useMemo, useRef, useEffect } from 'react'
import TinderCard from 'react-tinder-card'
import { Button } from '@/components/ui/button'

interface Style {
  id: string;
  name: string;
  images: { url: string }[];
}

interface StyleSwipeProps {
  onFinish: (scores: Record<string, number>) => void;
  quizId: string;
}

export function StyleSwipe({ onFinish, quizId }: StyleSwipeProps) {
  const [styles, setStyles] = useState<Style[]>([])
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [scores, setScores] = useState<Record<string, number>>({})
  const currentIndexRef = useRef(currentIndex)

  useEffect(() => {
    fetch('/api/quiz/styles')
      .then(res => res.json())
      .then(data => {
        setStyles(data)
        setCurrentIndex(data.length - 1)
      })

    fetch('/api/quiz/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quizId }),
    })
      .then(res => res.json())
      .then(data => setSessionId(data.id))
  }, [quizId])

  const childRefs: any = useMemo(
    () =>
      Array(styles.length)
        .fill(0)
        .map((i) => React.createRef()),
    [styles.length]
  )

  const updateCurrentIndex = (val: number) => {
    setCurrentIndex(val)
    currentIndexRef.current = val
  }

  const swiped = (direction: string, styleId: string, name: string, index: number) => {
    let scoreChange = 0
    if (direction === 'right') {
      scoreChange = 2
    } else if (direction === 'left') {
      scoreChange = -2
    }

    if (sessionId) {
        fetch('/api/quiz/style-score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId, styleId, score: scoreChange }),
        })
    }

    setScores((prev) => ({ ...prev, [name]: (prev[name] || 0) + scoreChange }))
    updateCurrentIndex(index - 1)
  }

  const outOfFrame = (name: string, idx: number) => {
    if (currentIndexRef.current >= idx && childRefs[idx].current) {
        childRefs[idx].current.restoreCard()
    }
  }

  const swipe = async (dir: 'left' | 'right') => {
    if (currentIndex < styles.length && childRefs[currentIndex].current) {
      await childRefs[currentIndex].current.swipe(dir)
    }
  }

  if (styles.length === 0) {
      return <div>Ładowanie...</div>
  }

  if (currentIndex < 0) {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Quiz zakończony!</h2>
            <Button onClick={() => onFinish(scores)}>Zobacz wyniki</Button>
        </div>
    )
  }

  return (
    <div>
      <div className='relative h-[400px] w-full max-w-sm mx-auto my-8'>
        {styles.map((style, index) => (
          <TinderCard
            ref={childRefs[index]}
            className='absolute'
            key={style.name}
            onSwipe={(dir) => swiped(dir, style.id, style.name, index)}
            onCardLeftScreen={() => outOfFrame(style.name, index)}
            preventSwipe={['up', 'down']}
          >
            <div
              style={{ backgroundImage: 'url(' + (style.images[0]?.url || '') + ')' }}
              className='relative w-[300px] h-[400px] bg-white rounded-xl bg-cover bg-center shadow-lg'
            >
              <h3 className='absolute bottom-4 left-4 text-white text-2xl font-bold bg-black bg-opacity-50 p-2 rounded'>{style.name}</h3>
            </div>
          </TinderCard>
        ))}
      </div>
      <div className="flex justify-center gap-4">
        <Button onClick={() => swipe('left')} variant="destructive">Odrzuć</Button>
        <Button onClick={() => swipe('right')}>Akceptuj</Button>
      </div>
    </div>
  )
}
