"use client"

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import TinderCard from 'react-tinder-card'
import { Button } from '@/components/ui/button'
import { styleClusters } from '@/lib/quiz/style-clusters'
import { CommentModal, CommentSentiment } from './comment-modal'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Textarea } from '@/components/ui/textarea'

// --- Updated Interfaces ---
interface Detail { id: string; name: string; category: string; imageUrl: string; }
interface ImageTag { id: string; x: number; y: number; width: number; height: number; detail: Detail; }
interface StyleImage { id: string; url: string; room?: string; tags: ImageTag[]; }
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
  const [selectedTagForComment, setSelectedTagForComment] = useState<ImageTag | null>(null);
  const [consecutiveLeftSwipes, setConsecutiveLeftSwipes] = useState(0);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showPoolTooSmallModal, setShowPoolTooSmallModal] = useState(false);
  const [userPreferenceText, setUserPreferenceText] = useState("");
  const [totalSwipes, setTotalSwipes] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [finishReason, setFinishReason] = useState<FinishReason | null>(null);
  const [clickCoords, setClickCoords] = useState<{x: number, y: number} | null>(null);
  const [detailStats, setDetailStats] = useState<Record<string, { score: number }>>({});

  const currentIndexRef = useRef(0);
  const canSwipe = useRef(true);

  const childRefs: any = useMemo(() => Array(deck.length).fill(0).map(() => React.createRef()), [deck.length]);
  const getRandomElement = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

  const composeNextDeck = useCallback(() => {
    const activeStyles = allStyles.filter(s => !rejectedStyles.includes(s.name));
    if (activeStyles.length === 0) {
      setFinishReason('condition_met');
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
    unshownStyles.slice(0,3).forEach(style => {
        if (!potentialPicks.find(s => s.id === style.id)) potentialPicks.push(style);
    });

    const deckSize = showPoolTooSmallModal ? 12 : 8;
    while (potentialPicks.length < deckSize && activeStyles.length > 0) {
      const randomStyle = getRandomElement(activeStyles.filter(s => !potentialPicks.includes(s)));
      if (randomStyle) potentialPicks.push(randomStyle);
    }

    const newDeck: DeckCard[] = [];
    const tempShownUrls = new Set<string>();
    potentialPicks.forEach(style => {
        const unshownImages = style.images.filter(img => !stats[style.name].shownImageUrls.has(img.url));
        if (unshownImages.length === 0) return;

        const scoredImages = unshownImages.map(image => {
            if (tempShownUrls.has(image.url)) return { image, score: Infinity };

            // Calculate score based on the sum of scores of its details.
            // A lower score means less exposure to already-liked items, promoting variety.
            let imageScore = image.tags.reduce((acc, tag) => acc + (detailStats[tag.detail.id]?.score || 0), 0);

            // If the user provided text feedback, use it to influence the score.
            if (userPreferenceText) {
                const preferenceBonus = image.tags.reduce((acc, tag) => {
                    if (userPreferenceText.toLowerCase().includes(tag.detail.name.toLowerCase())) {
                        return acc - 5; // Give a bonus by reducing the score.
                    }
                    return acc;
                }, 0);
                imageScore += preferenceBonus;
            }

            return { image, score: imageScore };
        }).sort((a, b) => a.score - b.score);

        const bestImage = scoredImages[0]?.image;

        if (bestImage) {
            newDeck.push({ style, image: bestImage });
            tempShownUrls.add(bestImage.url);
        }
    });

    setDeck(newDeck);
    currentIndexRef.current = newDeck.length - 1;
    canSwipe.current = true;
  }, [allStyles, stats, rejectedStyles, showPoolTooSmallModal, detailStats, userPreferenceText]);

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
      setStats(initialStats);

      const initialDetailStats: Record<string, { score: number }> = {};
      stylesWithClusters.forEach(style => {
          style.images.forEach(image => {
              image.tags.forEach(tag => {
                  if (!initialDetailStats[tag.detail.id]) {
                      initialDetailStats[tag.detail.id] = { score: 0 };
                  }
              });
          });
      });
      setDetailStats(initialDetailStats);

      const initialDeck: DeckCard[] = [];
      const shownUrls = new Set<string>();
      styleClusters.forEach((_, index) => {
        const stylesInCluster = stylesWithClusters.filter(s => s.cluster === index);
        if (stylesInCluster.length > 0) {
            const style = getRandomElement(stylesInCluster);
            const image = style.images.find(img => !shownUrls.has(img.url) && selectedRooms.includes(img.room || ''));
            if (image) {
                initialDeck.push({ style, image });
                initialStats[style.name].shownImageUrls.add(image.url);
                shownUrls.add(image.url);
            }
        }
      });
      setDeck(initialDeck);
      currentIndexRef.current = initialDeck.length - 1;
    });

    fetch('/api/quiz/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quizId, selectedRooms }),
    }).then(res => res.json()).then(data => setSessionId(data.id));
  }, [quizId, selectedRooms]);

  const swiped = (direction: 'left' | 'right', card: DeckCard) => {
    if (!canSwipe.current) return;
    canSwipe.current = false;
    const { style, image } = card;
    let styleScoreChange = 0;
    let likeChange = 0;
    let detailScoreChange = 0;

    if (direction === 'right') {
      styleScoreChange = 2;
      likeChange = 1;
      detailScoreChange = 1;
      setConsecutiveLeftSwipes(0);
    } else {
      styleScoreChange = -2;
      detailScoreChange = -1;
      setConsecutiveLeftSwipes(prev => prev + 1);
    }
    setStats(prev => ({
        ...prev,
        [style.name]: {
            score: (prev[style.name]?.score || 0) + styleScoreChange,
            likedCount: (prev[style.name]?.likedCount || 0) + likeChange,
            shownCount: (prev[style.name]?.shownCount || 0) + 1,
            shownImageUrls: new Set(prev[style.name]?.shownImageUrls).add(image.url),
        }
    }));

    const detailIds = card.image.tags.map(tag => tag.detail.id);
    setDetailStats(prev => {
      const newDetailStats = { ...prev };
      detailIds.forEach(id => {
        newDetailStats[id] = { score: (newDetailStats[id]?.score || 0) + detailScoreChange };
      });
      return newDetailStats;
    });

    setTotalSwipes(prev => prev + 1);
    if (sessionId) {
      fetch('/api/quiz/style-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          styleId: style.id,
          imageId: image.id,
          styleScoreChange,
          detailScoreChange,
          detailIds,
        }),
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
        if (!showPoolTooSmallModal) {
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
    if (currentIndexRef.current < 0 || !deck[currentIndexRef.current]) return;
    const currentCard = deck[currentIndexRef.current];
    setRejectedStyles(prev => [...prev, currentCard.style.name]);
    swipeUI('left');
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, card: DeckCard, tag: ImageTag | null) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setClickCoords({ x, y });
    setSelectedCardForComment(card);
    setSelectedTagForComment(tag);
    setIsCommentModalOpen(true);
  };

  const handleSaveComment = (comment: string, sentiment: CommentSentiment) => {
    if (!selectedCardForComment || !sessionId) return;
    const { image } = selectedCardForComment;

    const scoreChange = sentiment === 'positive' ? 3 : sentiment === 'negative' ? -3 : 0;
    const commentedDetailId = selectedTagForComment?.detail.id;

    if (commentedDetailId && scoreChange !== 0) {
      setDetailStats(prev => ({
        ...prev,
        [commentedDetailId]: { score: (prev[commentedDetailId]?.score || 0) + scoreChange }
      }));
    }

    const hotspot = selectedTagForComment ? {
        x: selectedTagForComment.x,
        y: selectedTagForComment.y,
        w: selectedTagForComment.width,
        h: selectedTagForComment.height,
    } : {
        x: clickCoords?.x,
        y: clickCoords?.y,
        w: 10,
        h: 10,
    };

    fetch('/api/quiz/comment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        styleImageId: image.id,
        text: comment,
        sentiment,
        ...hotspot,
        imageTagId: selectedTagForComment?.id,
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
            >
              <div className="absolute inset-0" onClick={(e) => handleImageClick(e, card, null)}></div>
              {card.image.tags.map(tag => (
                  <div
                      key={tag.id}
                      className="absolute border-2 border-transparent hover:border-blue-500 cursor-pointer"
                      style={{
                          left: `${tag.x}%`,
                          top: `${tag.y}%`,
                          width: `${tag.width}%`,
                          height: `${tag.height}%`
                      }}
                      onClick={(e) => {
                          e.stopPropagation();
                          handleImageClick(e, card, tag);
                      }}
                  >
                    <span className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">{tag.detail.name}</span>
                  </div>
              ))}
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
