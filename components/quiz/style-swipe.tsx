"use client"

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import TinderCard from 'react-tinder-card'
import { Button } from '@/components/ui/button'
import { styleClusters } from '@/lib/quiz/style-clusters'
import { CommentModal, CommentSentiment } from './comment-modal'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Textarea } from '@/components/ui/textarea'

// Interfaces
interface StyleImage { id: string; url: string; room?: string; }
interface Style { id: string; name: string; images: StyleImage[]; cluster: number; }
interface DeckCard { style: Style; image: StyleImage; }
interface StyleStats { score: number; likedCount: number; shownCount: number; shownImageUrls: Set<string>; }
export type FinishReason = 'condition_met' | 'limit_reached';

interface StyleSwipeProps {
  onFinish: (scores: Record<string, number>, reason: FinishReason) => void;
  quizId: string;
  selectedRooms: string[];
}

export function StyleSwipe({ onFinish, quizId, selectedRooms }: StyleSwipeProps) {
  // State
  const [allStyles, setAllStyles] = useState<Style[]>([]);
  const [deck, setDeck] = useState<DeckCard[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [stats, setStats] = useState<Record<string, StyleStats>>({});
  const [rejectedStyles, setRejectedStyles] = useState<string[]>([]);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [selectedCardForComment, setSelectedCardForComment] = useState<DeckCard | null>(null);
  const [consecutiveLeftSwipes, setConsecutiveLeftSwipes] = useState(0);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showPoolTooSmallModal, setShowPoolTooSmallModal] = useState(false);
  const [userPreferenceText, setUserPreferenceText] = useState("");
  const [totalSwipes, setTotalSwipes] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [finishReason, setFinishReason] = useState<FinishReason | null>(null);
  const [clickCoords, setClickCoords] = useState<{x: number, y: number} | null>(null);

  const currentIndexRef = useRef(0);
  const canSwipe = useRef(true);

  // Memoized child refs for TinderCard
  const childRefs: any = useMemo(() => Array(deck.length).fill(0).map(() => React.createRef()), [deck.length]);

  const getRandomElement = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

  const getImageForStyle = useCallback((style: Style, stat: StyleStats): StyleImage | null => {
      const unshownImages = style.images.filter(img => !stat.shownImageUrls.has(img.url));
      if (unshownImages.length === 0) return null; // No new images for this style

      const roomSpecificImages = unshownImages.filter(img => img.room && selectedRooms.includes(img.room));
      if (roomSpecificImages.length > 0) return getRandomElement(roomSpecificImages);

      const genericImages = unshownImages.filter(img => !img.room);
      if (genericImages.length > 0) return getRandomElement(genericImages);

      return getRandomElement(unshownImages); // Fallback to any unshown image
  }, [selectedRooms]);

  const composeNextDeck = useCallback(() => {
    const activeStyles = allStyles.filter(s => !rejectedStyles.includes(s.name));
    if (activeStyles.length === 0) {
      setFinishReason('condition_met'); // Or some other reason
      setIsFinished(true);
      return;
    }

    const sortedByScore = Object.entries(stats)
      .filter(([name]) => !rejectedStyles.includes(name))
      .sort(([, a], [, b]) => b.score - a.score);

    const top5Names = sortedByScore.slice(0, 5).map(([name]) => name);
    const unshownStyles = activeStyles.filter(s => (stats[s.name]?.shownCount || 0) === 0);

    let potentialPicks: Style[] = [];
    top5Names.forEach(name => {
      const style = allStyles.find(s => s.name === name);
      if (style) potentialPicks.push(style);
    });
    for (let i = 0; i < 3 && unshownStyles.length > 0; i++) {
      const randomUnshown = getRandomElement(unshownStyles);
      if (randomUnshown && !potentialPicks.find(s => s.id === randomUnshown.id)) {
        potentialPicks.push(randomUnshown);
        unshownStyles.splice(unshownStyles.indexOf(randomUnshown), 1);
      }
    }
    // Per documentation, if pool is too small, add more photos from remaining styles.
    const deckSize = showPoolTooSmallModal ? 12 : 8;
    while (potentialPicks.length < deckSize && activeStyles.length > 0) {
      const randomStyle = getRandomElement(activeStyles);
      if (!potentialPicks.find(s => s.id === randomStyle.id)) {
        potentialPicks.push(randomStyle);
      }
    }

    const newDeck: DeckCard[] = [];
    potentialPicks.forEach(style => {
        // TODO: Use userPreferenceText to guide card selection. This is not possible
        // without tags or other metadata on images.
        const image = getImageForStyle(style, stats[style.name]);
        if (image) {
            newDeck.push({ style, image });
        }
    });

    setDeck(newDeck);
    currentIndexRef.current = newDeck.length - 1;
    canSwipe.current = true;
  }, [allStyles, stats, rejectedStyles, getImageForStyle, showPoolTooSmallModal]);

  const checkStopCondition = useCallback(() => {
    if (totalSwipes >= 40) {
        setFinishReason('limit_reached');
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
        setFinishReason('condition_met');
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
        initialStats[s.name] = { score: 0, likedCount: 0, shownCount: 0, shownImageUrls: new Set() };
      });

      const initialDeck: DeckCard[] = [];
      styleClusters.forEach((_, index) => {
        const stylesInCluster = stylesWithClusters.filter(s => s.cluster === index);
        if (stylesInCluster.length > 0) {
            const style = getRandomElement(stylesInCluster);
            const image = getImageForStyle(style, initialStats[style.name]);
            if (image) {
                initialDeck.push({ style, image });
                initialStats[style.name].shownImageUrls.add(image.url);
            }
        }
      });
      setStats(initialStats);
      setDeck(initialDeck);
      currentIndexRef.current = initialDeck.length - 1;
    });

    fetch('/api/quiz/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quizId, selectedRooms }),
    }).then(res => res.json()).then(data => setSessionId(data.id));
  }, [quizId, selectedRooms, getImageForStyle]);

  const swiped = (direction: 'left' | 'right', card: DeckCard) => {
    if (!canSwipe.current) return;
    canSwipe.current = false;
    const { style, image } = card;
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
            shownImageUrls: new Set(prev[style.name]?.shownImageUrls).add(image.url),
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

  useEffect(() => {
    if (allStyles.length > 0 && rejectedStyles.length / allStyles.length > 0.5) {
        if (!showPoolTooSmallModal) { // Prevent re-triggering
            setShowPoolTooSmallModal(true);
        }
    }
  }, [rejectedStyles, allStyles, showPoolTooSmallModal]);

  const swipeUI = async (dir: 'left' | 'right') => {
    if (canSwipe.current && currentIndexRef.current >= 0 && currentIndexRef.current < deck.length) {
      await childRefs[currentIndexRef.current].current.swipe(dir);
    }
  };

  const rejectStyle = () => {
    if (currentIndexRef.current < 0) return;
    const currentCard = deck[currentIndexRef.current];
    setRejectedStyles(prev => [...prev, currentCard.style.name]);
    // This immediately removes the card from view, should also trigger next
    swipeUI('left');
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, card: DeckCard) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100; // in percentage
    const y = ((e.clientY - rect.top) / rect.height) * 100; // in percentage
    setClickCoords({ x, y });
    setSelectedCardForComment(card);
    setIsCommentModalOpen(true);
  };

  const handleSaveComment = (comment: string, sentiment: CommentSentiment) => {
    if (!selectedCardForComment || !sessionId) return;

    const { style, image } = selectedCardForComment;
    let scoreChange = 0;
    if (sentiment === 'positive') scoreChange = 3;
    if (sentiment === 'negative') scoreChange = -3;

    if (scoreChange !== 0) {
        setStats(prev => ({
            ...prev,
            [style.name]: {
                ...prev[style.name],
                score: (prev[style.name]?.score || 0) + scoreChange,
            }
        }));
    }

    fetch('/api/quiz/comment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        styleImageId: image.id,
        text: comment,
        sentiment,
        x: clickCoords?.x,
        y: clickCoords?.y,
        w: 10, // Mocked width
        h: 10, // Mocked height
      }),
    });
  };

  if (allStyles.length === 0) return <div>Ładowanie...</div>;

  if (isFinished && finishReason) {
    const finalScores = Object.fromEntries(
        Object.entries(stats).map(([name, stat]) => [name, stat.score])
    );
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Runda 1 zakończona!</h2>
        <Button onClick={() => onFinish(finalScores, finishReason)}>Przejdź dalej</Button>
      </div>
    );
  }

  return (
    <div>
      <CommentModal isOpen={isCommentModalOpen} onClose={() => setIsCommentModalOpen(false)} onSave={handleSaveComment} />

      <Dialog open={showPoolTooSmallModal} onOpenChange={setShowPoolTooSmallModal}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Pula stylów jest mała</DialogTitle>
                <DialogDescription>
                    Wygląda na to, że wiele stylów Ci nie odpowiada. Aby pomóc nam lepiej trafić w Twój gust, opisz proszę w kilku słowach, co lubisz lub czego szukasz w aranżacji wnętrz.
                </DialogDescription>
            </DialogHeader>
            <Textarea
                value={userPreferenceText}
                onChange={(e) => setUserPreferenceText(e.target.value)}
                placeholder="Np. 'lubię naturalne światło i dużo drewna', 'szukam czegoś nowoczesnego, ale przytulnego'..."
            />
            <DialogFooter>
                <Button onClick={() => setShowPoolTooSmallModal(false)}>Zapisz i kontynuuj</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEmergencyModal} onOpenChange={setShowEmergencyModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nie trafiamy w Twój gust?</DialogTitle></DialogHeader>
          <p>Wygląda na to, że odrzuciłeś wiele propozycji. Spróbuj opisać co lubisz w komentarzach lub odrzuć całe style, które Ci nie pasują.</p>
          <DialogFooter><Button onClick={() => setShowEmergencyModal(false)}>Kontynuuj</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <div className='relative h-[400px] w-full max-w-sm mx-auto my-8'>
        {deck.length > 0 ? deck.map((card, index) => (
          <TinderCard
            ref={childRefs[index]}
            className='absolute'
            key={card.image.id}
            onSwipe={(dir) => swiped(dir as 'left' | 'right', card)}
            preventSwipe={['up', 'down']}
          >
            <div
              style={{ backgroundImage: `url(${card.image.url || ''})` }}
              className='relative w-[300px] h-[400px] bg-white rounded-xl bg-cover bg-center shadow-lg group'
              onClick={(e) => handleImageClick(e, card)}
            >
              {/* Style name removed as per requirement */}
            </div>
          </TinderCard>
        )) : <p>Komponowanie nowej talii...</p>}
      </div>

      <div className="flex justify-center gap-4 mt-4">
        <Button onClick={() => swipeUI('left')} variant="destructive">Odrzuć</Button>
        <Button onClick={rejectStyle} variant="outline">Odrzuć styl</Button>
        <Button onClick={() => swipeUI('right')}>Akceptuj</Button>
      </div>
    </div>
  );
}
