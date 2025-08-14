"use client"

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import TinderCard from 'react-tinder-card'
import { Button } from '@/components/ui/button'
import { styleClusters } from '@/lib/quiz/style-clusters'
import { CommentModal } from './comment-modal'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

// Interfaces
interface StyleImage { id: string; url: string; }
interface Style { id: string; name: string; images: StyleImage[]; cluster: number; }
interface StyleStats { score: number; likedCount: number; shownCount: number; }

interface StyleSwipeProps {
  onFinish: (scores: Record<string, number>) => void;
  quizId: string;
}

export function StyleSwipe({ onFinish, quizId }: StyleSwipeProps) {
  // State
  const [allStyles, setAllStyles] = useState<Style[]>([]);
  const [deck, setDeck] = useState<Style[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [stats, setStats] = useState<Record<string, StyleStats>>({});
  const [rejectedStyles, setRejectedStyles] = useState<string[]>([]);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [consecutiveLeftSwipes, setConsecutiveLeftSwipes] = useState(0);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [totalSwipes, setTotalSwipes] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [clickCoords, setClickCoords] = useState<{x: number, y: number} | null>(null);

  const currentIndexRef = useRef(0);
  const canSwipe = useRef(true);

  // Memoized child refs for TinderCard
  const childRefs: any = useMemo(() => Array(deck.length).fill(0).map(() => React.createRef()), [deck.length]);

  const getRandomElement = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

  const composeNextDeck = useCallback(() => {
    const activeStyles = allStyles.filter(s => !rejectedStyles.includes(s.name));
    if (activeStyles.length === 0) {
      setIsFinished(true);
      return;
    }

    const sortedByScore = Object.entries(stats)
      .filter(([name]) => !rejectedStyles.includes(name))
      .sort(([, a], [, b]) => b.score - a.score);

    const top5Names = sortedByScore.slice(0, 5).map(([name]) => name);
    const unshownStyles = activeStyles.filter(s => (stats[s.name]?.shownCount || 0) === 0);

    let newDeck: Style[] = [];
    top5Names.forEach(name => {
      const style = allStyles.find(s => s.name === name);
      if (style) newDeck.push(style);
    });
    for (let i = 0; i < 3 && unshownStyles.length > 0; i++) {
      const randomUnshown = getRandomElement(unshownStyles);
      if (randomUnshown && !newDeck.find(s => s.id === randomUnshown.id)) {
        newDeck.push(randomUnshown);
        unshownStyles.splice(unshownStyles.indexOf(randomUnshown), 1);
      }
    }
    while (newDeck.length < 8 && activeStyles.length > 0) {
      const randomStyle = getRandomElement(activeStyles);
      if (!newDeck.find(s => s.id === randomStyle.id)) {
        newDeck.push(randomStyle);
      }
    }
    setDeck(newDeck);
    currentIndexRef.current = newDeck.length - 1;
    canSwipe.current = true;
  }, [allStyles, stats, rejectedStyles]);

  const checkStopCondition = useCallback(() => {
    if (totalSwipes >= 40) {
        setIsFinished(true);
        return;
    }
    const sortedByLikes = Object.entries(stats).sort(([, a], [, b]) => b.likedCount - a.likedCount);
    if (sortedByLikes.length < 4) return;
    const top3 = sortedByLikes.slice(0, 3);
    const fourth = sortedByLikes[3];
    const allTop3HaveEnoughLikes = top3.every(([, s]) => s.likedCount >= 4);
    const hasEnoughLead = top3.every(([, s]) => s.likedCount >= fourth[1].likedCount + 2);
    if (allTop3HaveEnoughLikes && hasEnoughLead) {
        setIsFinished(true);
    }
  }, [stats, totalSwipes]);

  useEffect(() => {
    fetch('/api/quiz/styles').then(res => res.json()).then((data: Style[]) => {
      const stylesWithClusters = data.map(style => ({
        ...style,
        cluster: styleClusters.findIndex(c => c.includes(style.name)),
      }));
      setAllStyles(stylesWithClusters);
      const initialStats: Record<string, StyleStats> = {};
      stylesWithClusters.forEach(s => {
        initialStats[s.name] = { score: 0, likedCount: 0, shownCount: 0 };
      });
      setStats(initialStats);
      const initialDeck = styleClusters.map((_, index) => {
        const stylesInCluster = stylesWithClusters.filter(s => s.cluster === index);
        return stylesInCluster.length > 0 ? getRandomElement(stylesInCluster) : null;
      }).filter((s): s is Style => s !== null);
      setDeck(initialDeck);
      currentIndexRef.current = initialDeck.length - 1;
    });

    fetch('/api/quiz/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quizId }),
    }).then(res => res.json()).then(data => setSessionId(data.id));
  }, [quizId]);

  const swiped = (direction: 'left' | 'right', style: Style) => {
    if (!canSwipe.current) return;
    canSwipe.current = false;
    let scoreChange = 0;
    let likeChange = 0;
    if (direction === 'right') {
      scoreChange = 2;
      likeChange = 1;
      setConsecutiveLeftSwipes(0);
    } else {
      scoreChange = -2;
      setConsecutiveLeftSwipes(prev => prev + 1);
    }
    setStats(prev => ({
        ...prev,
        [style.name]: {
            score: (prev[style.name]?.score || 0) + scoreChange,
            likedCount: (prev[style.name]?.likedCount || 0) + likeChange,
            shownCount: (prev[style.name]?.shownCount || 0) + 1,
        }
    }));
    setTotalSwipes(prev => prev + 1);
    if (sessionId) {
      fetch('/api/quiz/style-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, styleId: style.id, score: scoreChange }),
      });
    }
    currentIndexRef.current -= 1;
    if (currentIndexRef.current < 0) {
        composeNextDeck();
    } else {
        canSwipe.current = true;
    }
  };

  useEffect(() => {
    if (isFinished) return;
    checkStopCondition();
    if (consecutiveLeftSwipes >= 10) {
        setShowEmergencyModal(true);
        setConsecutiveLeftSwipes(0);
    }
  }, [stats, consecutiveLeftSwipes, checkStopCondition, isFinished]);

  const swipeUI = async (dir: 'left' | 'right') => {
    if (canSwipe.current && currentIndexRef.current >= 0 && currentIndexRef.current < deck.length) {
      await childRefs[currentIndexRef.current].current.swipe(dir);
    }
  };

  const rejectStyle = () => {
    if (currentIndexRef.current < 0) return;
    const currentStyle = deck[currentIndexRef.current];
    setRejectedStyles(prev => [...prev, currentStyle.name]);
    const newDeck = deck.filter(style => style.name !== currentStyle.name);
    setDeck(newDeck);
    currentIndexRef.current = newDeck.length - 1;
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, imageId: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100; // in percentage
    const y = ((e.clientY - rect.top) / rect.height) * 100; // in percentage
    setClickCoords({ x, y });
    setSelectedImageId(imageId);
    setIsCommentModalOpen(true);
  };

  const handleSaveComment = (comment: string) => {
    if (sessionId && selectedImageId) {
      fetch('/api/quiz/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            sessionId,
            styleImageId: selectedImageId,
            text: comment,
            x: clickCoords?.x,
            y: clickCoords?.y,
        }),
      });
    }
  };

  if (allStyles.length === 0) return <div>Ładowanie...</div>;

  if (isFinished) {
    const finalScores = Object.fromEntries(
        Object.entries(stats).map(([name, stat]) => [name, stat.score])
    );
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Runda 1 zakończona!</h2>
        <Button onClick={() => onFinish(finalScores)}>Przejdź do Rundy 2</Button>
      </div>
    );
  }

  return (
    <div>
      <CommentModal isOpen={isCommentModalOpen} onClose={() => setIsCommentModalOpen(false)} onSave={handleSaveComment} />
      <Dialog open={showEmergencyModal} onOpenChange={setShowEmergencyModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nie trafiamy w Twój gust?</DialogTitle></DialogHeader>
          <p>Wygląda na to, że odrzuciłeś wiele propozycji. Spróbuj opisać co lubisz w komentarzach lub odrzuć całe style, które Ci nie pasują.</p>
          <DialogFooter><Button onClick={() => setShowEmergencyModal(false)}>Kontynuuj</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <div className='relative h-[400px] w-full max-w-sm mx-auto my-8'>
        {deck.length > 0 ? deck.map((style, index) => (
          <TinderCard
            ref={childRefs[index]}
            className='absolute'
            key={style.id + index}
            onSwipe={(dir) => swiped(dir as 'left' | 'right', style)}
            preventSwipe={['up', 'down']}
          >
            <div
              style={{ backgroundImage: `url(${style.images[0]?.url || ''})` }}
              className='relative w-[300px] h-[400px] bg-white rounded-xl bg-cover bg-center shadow-lg group'
              onClick={(e) => handleImageClick(e, style.images[0].id)}
            >
              <h3 className='absolute bottom-4 left-4 text-white text-2xl font-bold bg-black bg-opacity-50 p-2 rounded'>{style.name}</h3>
            </div>
          </TinderCard>
        )) : <p>Komponowanie nowej talii...</p>}
      </div>

      <div className="flex justify-center gap-4">
        <Button onClick={() => swipeUI('left')} variant="destructive">Odrzuć</Button>
        <Button onClick={rejectStyle} variant="outline">Odrzuć styl</Button>
        <Button onClick={() => swipeUI('right')}>Akceptuj</Button>
      </div>
    </div>
  );
}
