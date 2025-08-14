"use client"

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import TinderCard from 'react-tinder-card'
import { Button } from "@/components/ui/button"
import { CommentModal, CommentSentiment } from './comment-modal'
import { PlayoffReason } from './playoff-round'
import { X, Heart } from 'lucide-react'
import { motion } from 'framer-motion'

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
    const initialStats: Record<string, RoundStats> = {};
    topStyles.forEach(style => {
      initialStats[style.id] = { likes: 0, dislikes: 0, totalShown: 0, status: 'pending' };
    });
    setStats(initialStats);

    let fullDeck: DeckCard[] = [];
    topStyles.forEach(style => {
      const roomImages = style.images.filter(img => img.room && selectedRooms.includes(img.room));
      const otherImages = style.images.filter(img => !img.room || !selectedRooms.includes(img.room!));
      const styleImages = [...roomImages, ...otherImages].slice(0, 4);
      styleImages.forEach(image => {
        fullDeck.push({ style, image });
      });
    });

    if (fullDeck.length > 30) {
      fullDeck = fullDeck.sort(() => 0.5 - Math.random()).slice(0, 30);
    }

    setDeck(fullDeck.sort(() => 0.5 - Math.random()));
    currentIndexRef.current = fullDeck.length -1;
  }, [topStyles, selectedRooms]);

  const checkStyleStatus = useCallback((styleId: string, currentStats: RoundStats) => {
    const { likes, dislikes, totalShown } = currentStats;
    if (totalShown === 0) return 'pending';
    if (dislikes / totalShown >= 0.75) return 'rejected';
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
    if (sentiment === 'positive') {
      setStats(prev => ({ ...prev, [style.id]: { ...prev[style.id], status: 'preferred' } }));
    } else if (sentiment === 'negative') {
      setStats(prev => ({ ...prev, [style.id]: { ...prev[style.id], status: 'rejected' } }));
    }
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
        <div className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4 font-heading-semibold">Runda 2 zakończona!</h2>
            <p className="text-gray-600 mb-6 font-body-regular">Dziękujemy za Twoje odpowiedzi. Jesteśmy coraz bliżej!</p>
            <Button onClick={handleFinishRound} size="lg" className="bg-gradient-to-r from-[#b38a34] to-[#9a7529] text-white">Przejdź do kolejnego etapu</Button>
        </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full">
      <CommentModal isOpen={isCommentModalOpen} onClose={() => setIsCommentModalOpen(false)} onSave={handleSaveComment} />
      <h2 className="text-2xl font-bold mb-2 text-center font-heading-semibold">Runda 2: Zawężenie wyboru</h2>
      <p className="mb-8 text-gray-600 text-center font-body-regular max-w-md">Oceń poniższe inspiracje, abyśmy mogli lepiej dopasować rekomendacje. Tym razem skupiamy się na stylach, które wstępnie Ci się spodobały.</p>

      <div className='relative h-[50vh] w-full max-w-md mx-auto my-8 flex justify-center items-center'>
        {deck.length > 0 ? deck.map((card, index) => (
          <TinderCard
            ref={childRefs[index]}
            className='absolute'
            key={card.image.id}
            onSwipe={(dir) => swiped(dir as 'left' | 'right', card)}
            preventSwipe={['up', 'down']}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ backgroundImage: `url(${card.image.url || ''})` }}
              className='relative w-[90vw] max-w-sm h-[50vh] bg-white rounded-2xl bg-cover bg-center shadow-2xl group cursor-pointer'
              onClick={(e) => handleImageClick(e, card)}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 p-2 bg-black/40 rounded-lg">
                    <p className="text-white font-heading-bold text-lg drop-shadow-lg">{card.style.name}</p>
                </div>
            </motion.div>
          </TinderCard>
        )) : <p className="text-center text-gray-500">Ładowanie talii...</p>}
      </div>

       <div className="flex justify-center items-center gap-4 mt-4">
        <Button onClick={() => swipeUI('left')} variant="outline" size="lg" className="rounded-full p-4 w-20 h-20 border-2 border-red-500 text-red-500 hover:bg-red-500/10">
          <X size={32} />
        </Button>
        <Button onClick={() => swipeUI('right')} variant="outline" size="lg" className="rounded-full p-4 w-20 h-20 border-2 border-green-500 text-green-500 hover:bg-green-500/10">
          <Heart size={32} />
        </Button>
      </div>
    </div>
  )
}
