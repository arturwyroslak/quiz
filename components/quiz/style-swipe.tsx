"use client"

import React, { useState, useMemo, useRef, useEffect } from 'react'
import TinderCard from 'react-tinder-card'
import { Button } from '@/components/ui/button'
import { styleClusters } from '@/lib/quiz/style-clusters'
import { CommentModal } from './comment-modal'
import { MessageSquare } from 'lucide-react'

interface StyleImage {
  id: string;
  url: string;
}
interface Style {
  id: string;
  name: string;
  images: StyleImage[];
  cluster: number;
}

interface StyleSwipeProps {
  onFinish: (scores: Record<string, number>) => void;
  quizId: string;
}

export function StyleSwipe({ onFinish, quizId }: StyleSwipeProps) {
  const [allStyles, setAllStyles] = useState<Style[]>([])
  const [deck, setDeck] = useState<Style[]>([])
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [scores, setScores] = useState<Record<string, number>>({})
  const [rejectedStyles, setRejectedStyles] = useState<string[]>([])
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false)
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null)
  const currentIndexRef = useRef(currentIndex)

  useEffect(() => {
    fetch('/api/quiz/styles')
      .then(res => res.json())
      .then((data: Style[]) => {
        const stylesWithClusters = data.map(style => {
            const clusterIndex = styleClusters.findIndex(cluster => cluster.includes(style.name));
            return { ...style, cluster: clusterIndex };
        });
        setAllStyles(stylesWithClusters);

        const initialDeck = styleClusters.map((cluster, index) => {
            const stylesInCluster = stylesWithClusters.filter(s => s.cluster === index);
            if (stylesInCluster.length > 0) {
                return stylesInCluster[Math.floor(Math.random() * stylesInCluster.length)];
            }
            return null;
        }).filter((style): style is Style => style !== null);

        setDeck(initialDeck);
        setCurrentIndex(initialDeck.length - 1);
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
      Array(deck.length)
        .fill(0)
        .map((i) => React.createRef()),
    [deck.length]
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
    if (currentIndex < deck.length && childRefs[currentIndex].current) {
      await childRefs[currentIndex].current.swipe(dir)
    }
  }

  const rejectStyle = () => {
    if (currentIndex < 0) return;
    const currentStyleName = deck[currentIndex].name;
    setRejectedStyles(prev => [...prev, currentStyleName]);
    const newDeck = deck.filter(style => style.name !== currentStyleName);
    setDeck(newDeck);
    setCurrentIndex(newDeck.length - 1);
  }

  const handleOpenCommentModal = (imageId: string) => {
    setSelectedImageId(imageId);
    setIsCommentModalOpen(true);
  }

  const handleSaveComment = (comment: string) => {
    if (sessionId && selectedImageId) {
      fetch('/api/quiz/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, styleImageId: selectedImageId, text: comment }),
      });
    }
  }

  if (deck.length === 0) {
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
      <CommentModal
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        onSave={handleSaveComment}
      />
      <div className='relative h-[400px] w-full max-w-sm mx-auto my-8'>
        {deck.map((style, index) => (
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
              className='relative w-[300px] h-[400px] bg-white rounded-xl bg-cover bg-center shadow-lg group'
            >
              <h3 className='absolute bottom-4 left-4 text-white text-2xl font-bold bg-black bg-opacity-50 p-2 rounded'>{style.name}</h3>
              <Button
                onClick={() => handleOpenCommentModal(style.images[0].id)}
                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white hover:bg-opacity-75"
                size="icon"
              >
                <MessageSquare />
              </Button>
            </div>
          </TinderCard>
        ))}
      </div>
      <div className="flex justify-center gap-4">
        <Button onClick={() => swipe('left')} variant="destructive">Odrzuć</Button>
        <Button onClick={rejectStyle} variant="outline">Odrzuć styl</Button>
        <Button onClick={() => swipe('right')}>Akceptuj</Button>
      </div>
    </div>
  )
}
