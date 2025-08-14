"use client"

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import TinderCard from 'react-tinder-card'
import { Button } from "@/components/ui/button"
import { CommentModal, CommentSentiment } from './comment-modal'
import { PlayoffReason } from './playoff-round'

// Interfaces
interface StyleImage { id: string; url: string; room?: string; }
interface Style { id: string; name: string; images: StyleImage[]; }
interface DeckCard { style: Style; image: StyleImage; }
type StyleStatus = 'pending' | 'preferred' | 'rejected';
interface RoundStats {
  likes: number;
  dislikes: number;
  totalShown: number;
  status: StyleStatus;
}
export type NarrowDownOutcome = 'clear_result' | PlayoffReason;

interface NarrowDownRoundProps {
  topStyles: Style[];
  selectedRooms: string[];
  onFinish: (finalScores: Record<string, number>, outcome: NarrowDownOutcome) => void;
}

export function NarrowDownRound({ topStyles, selectedRooms, onFinish }: NarrowDownRoundProps) {
  const [deck, setDeck] = useState<DeckCard[]>([]);
  const [stats, setStats] = useState<Record<string, RoundStats>>({});
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [selectedCardForComment, setSelectedCardForComment] = useState<DeckCard | null>(null);
  const [clickCoords, setClickCoords] = useState<{x: number, y: number} | null>(null);

  const currentIndexRef = useRef(0);
  const childRefs: any = useMemo(() => Array(deck.length).fill(0).map(() => React.createRef()), [deck.length]);

  useEffect(() => {
    // Initialize stats for the round
    const initialStats: Record<string, RoundStats> = {};
    topStyles.forEach(style => {
      initialStats[style.id] = { likes: 0, dislikes: 0, totalShown: 0, status: 'pending' };
    });
    setStats(initialStats);

    // Build the deck
    let fullDeck: DeckCard[] = [];
    topStyles.forEach(style => {
      // Prioritize images for selected rooms
      const roomImages = style.images.filter(img => img.room && selectedRooms.includes(img.room));
      const otherImages = style.images.filter(img => !img.room || !selectedRooms.includes(img.room!));

      // Take up to 4 images, prioritizing room-specific ones
      const styleImages = [...roomImages, ...otherImages].slice(0, 4);

      styleImages.forEach(image => {
        fullDeck.push({ style, image });
      });
    });

    // Enforce max 30 photos
    if (fullDeck.length > 30) {
      // Simple shuffle and slice for now. A better approach would be more strategic.
      fullDeck = fullDeck.sort(() => 0.5 - Math.random()).slice(0, 30);
    }

    setDeck(fullDeck.sort(() => 0.5 - Math.random())); // Shuffle the final deck
    currentIndexRef.current = fullDeck.length - 1;
  }, [topStyles, selectedRooms]);

  const checkStyleStatus = useCallback((styleId: string, currentStats: RoundStats) => {
    const { likes, dislikes, totalShown } = currentStats;
    if (totalShown === 0) return 'pending';

    // Rejection threshold
    if (dislikes / totalShown >= 0.75) return 'rejected';

    // Preference threshold
    if (likes / totalShown >= 0.5 && likes >= 2) return 'preferred';

    return 'pending';
  }, []);

  const swiped = (direction: 'left' | 'right', card: DeckCard) => {
    const { style } = card;

    setStats(prev => {
      const newStats = { ...prev };
      const styleStats = newStats[style.id];

      if (direction === 'right') styleStats.likes += 1;
      else styleStats.dislikes += 1;
      styleStats.totalShown += 1;

      styleStats.status = checkStyleStatus(style.id, styleStats);

      return newStats;
    });

    currentIndexRef.current -= 1;
  };

  const swipeUI = async (dir: 'left' | 'right') => {
    if (currentIndexRef.current >= 0 && currentIndexRef.current < deck.length) {
      await childRefs[currentIndexRef.current].current.swipe(dir);
    }
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, card: DeckCard) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setClickCoords({ x, y });
    setSelectedCardForComment(card);
    setIsCommentModalOpen(true);
  };

  const handleSaveComment = (comment: string, sentiment: CommentSentiment) => {
    if (!selectedCardForComment) return;
    const { style } = selectedCardForComment;

    // A strong sentiment from a comment can directly influence the style's status
    if (sentiment === 'positive') {
      setStats(prev => ({ ...prev, [style.id]: { ...prev[style.id], status: 'preferred' } }));
    } else if (sentiment === 'negative') {
      setStats(prev => ({ ...prev, [style.id]: { ...prev[style.id], status: 'rejected' } }));
    }
    // Here you would also send the comment to the backend API
  };

  const handleFinishRound = () => {
    let outcome: NarrowDownOutcome = 'clear_result';
    const allStats = Object.values(stats);
    const totalLikes = allStats.reduce((sum, s) => sum + s.likes, 0);
    const totalDislikes = allStats.reduce((sum, s) => sum + s.dislikes, 0);
    const totalShown = allStats.reduce((sum, s) => sum + s.totalShown, 0);

    if (totalShown > 0) {
        if (totalLikes === 0) outcome = 'all_disliked';
        else if (totalDislikes === 0) outcome = 'all_liked';
        else if (!allStats.some(s => s.status === 'preferred' || s.status === 'rejected')) {
            outcome = 'indecisive';
        }
    }

    const finalScores: Record<string, number> = {};
    Object.entries(stats).forEach(([styleId, roundStat]) => {
        // Simple scoring: +1 for like, -1 for dislike. Preferred/rejected status gives a bonus.
        let score = roundStat.likes - roundStat.dislikes;
        if(roundStat.status === 'preferred') score += 5;
        if(roundStat.status === 'rejected') score -= 5;
        finalScores[styleId] = score;
    });
    onFinish(finalScores, outcome);
  };

  const isFinished = currentIndexRef.current < 0;

  if (isFinished) {
    return (
        <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Runda 2 zakończona!</h2>
            <p className="mb-8">Dziękujemy za Twoje odpowiedzi. Kliknij poniżej, aby przejść dalej.</p>
            <Button onClick={handleFinishRound}>Przejdź do kolejnego etapu</Button>
        </div>
    );
  }

  return (
    <div>
      <CommentModal isOpen={isCommentModalOpen} onClose={() => setIsCommentModalOpen(false)} onSave={handleSaveComment} />
      <h2 className="text-2xl font-bold mb-4 text-center">Runda 2: Zawężenie wyboru</h2>
      <p className="mb-8 text-gray-600 text-center">Oceń poniższe inspiracje, abyśmy mogli lepiej dopasować rekomendacje.</p>

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
                <div className="absolute bottom-2 right-2 p-2 bg-black bg-opacity-50 rounded-lg">
                    <p className="text-white font-bold">{card.style.name}</p>
                </div>
            </div>
          </TinderCard>
        )) : <p className="text-center">Ładowanie talii...</p>}
      </div>

       <div className="flex justify-center gap-4 mt-4">
        <Button onClick={() => swipeUI('left')} variant="destructive">Nie podoba mi się</Button>
        <Button onClick={() => swipeUI('right')}>Podoba mi się</Button>
      </div>
    </div>
  )
}
