"use client"

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import TinderCard from 'react-tinder-card'
import { Button } from "@/components/ui/button"

// --- Data Structures ---
interface Style { id: string; name: string; }
interface Detail { id: string; name: string; category: string; imageUrl: string; }
export type DetailsRoundOutcome = 'clear_result' | 'all_liked' | 'all_disliked';

interface DetailsRoundProps {
  winningStyles: Style[];
  selectedRooms: string[];
  onFinish: (detailScores: Record<string, number>, outcome: DetailsRoundOutcome) => void;
}

// --- Mappings (Assumed data, since not in DB schema) ---
const styleToCategoryMapping: Record<string, string[]> = {
  "Industrialny": ["Oświetlenie", "Meble", "Kolory i wykończenia ścian"],
  "Loft": ["Oświetlenie", "Meble", "Kolory i wykończenia ścian", "Podłogi i pokrycia"],
  "Skandynawski": ["Tkaniny i tekstylia", "Podłogi i pokrycia", "Meble", "Rośliny i ogrody"],
  "Japandi": ["Tkaniny i tekstylia", "Podłogi i pokrycia", "Meble", "Dekoracje i dodatki"],
  "Boho": ["Tkaniny i tekstylia", "Dekoracje i dodatki", "Rośliny i ogrody"],
  "Minimalistyczny": ["Meble", "Kolory i wykończenia ścian"],
  "Nowoczesny": ["Meble", "Oświetlenie", "Technologie i funkcje (widoczne elementy)"],
  // Add more mappings as needed...
};

const roomToCategoryMapping: Record<string, string[]> = {
  "Salon": ["Oświetlenie", "Podłogi i pokrycia", "Tkaniny i tekstylia", "Meble", "Dekoracje i dodatki"],
  "Sypialnia": ["Oświetlenie", "Podłogi i pokrycia", "Tkaniny i tekstylia", "Meble"],
  "Kuchnia": ["Kuchnia i łazienka", "Oświetlenie", "Podłogi i pokrycia", "Meble"],
  "Łazienka": ["Kuchnia i łazienka", "Oświetlenie", "Podłogi i pokrycia"],
  // Add more mappings as needed...
};

// --- Component ---
export function DetailsRound({ winningStyles, selectedRooms, onFinish }: DetailsRoundProps) {
  const [deck, setDeck] = useState<Detail[]>([]);
  const [scores, setScores] = useState<Record<string, number>>({});

  const currentIndexRef = useRef(0);
  const childRefs: any = useMemo(() => Array(deck.length).fill(0).map(() => React.createRef()), [deck.length]);

  useEffect(() => {
    const buildDeck = async () => {
      const response = await fetch('/api/quiz/details');
      const allDetails: Detail[] = await response.json();

      const relevantCategories = new Set<string>();
      winningStyles.forEach(style => {
        const styleCats = styleToCategoryMapping[style.name] || [];
        styleCats.forEach(cat => relevantCategories.add(cat));
      });
      selectedRooms.forEach(room => {
        const roomCats = roomToCategoryMapping[room] || Object.values(roomToCategoryMapping).flat();
        roomCats.forEach(cat => relevantCategories.add(cat));
      });

      let relevantDetails = allDetails.filter(detail => relevantCategories.has(detail.category));

      // Adaptability: Ensure category diversity
      const categoryCounts = relevantDetails.reduce((acc, detail) => {
        acc[detail.category] = (acc[detail.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const majorCategories = Object.keys(categoryCounts).filter(cat => categoryCounts[cat] > relevantDetails.length * 0.4);
      if (majorCategories.length === 1) {
          const otherDetails = allDetails.filter(d => !relevantCategories.has(d.category)).slice(0, 5);
          relevantDetails.push(...otherDetails);
      }

      // Shuffle and limit the deck size (e.g., to 24 as per docs)
      const finalDeck = relevantDetails.sort(() => 0.5 - Math.random()).slice(0, 24);
      setDeck(finalDeck);
      currentIndexRef.current = finalDeck.length > 0 ? finalDeck.length - 1 : -1;
    };

    buildDeck();
  }, [winningStyles, selectedRooms]);

  const swiped = (direction: 'left' | 'right', detailId: string) => {
    const scoreChange = direction === 'right' ? 1 : -1;
    setScores(prev => ({ ...prev, [detailId]: scoreChange })); // Only store last vote
    currentIndexRef.current -= 1;
  };

  const swipeUI = async (dir: 'left' | 'right') => {
    if (currentIndexRef.current >= 0 && currentIndexRef.current < deck.length) {
      await childRefs[currentIndexRef.current].current.swipe(dir);
    }
  };

  const handleFinish = () => {
    const votes = Object.values(scores);
    let outcome: DetailsRoundOutcome = 'clear_result';
    if (votes.length === deck.length) {
        if (votes.every(v => v === 1)) outcome = 'all_liked';
        else if (votes.every(v => v === -1)) outcome = 'all_disliked';
    }
    onFinish(scores, outcome);
  };

  const isFinished = deck.length > 0 && currentIndexRef.current < 0;

  if (isFinished) {
    return (
        <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Runda 3 zakończona!</h2>
            <p className="mb-8">To już prawie koniec! Kliknij, aby zobaczyć swoje spersonalizowane wyniki.</p>
            <Button onClick={handleFinish}>Zobacz wyniki</Button>
        </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-center">Runda 3: Detale i Materiały</h2>
      <p className="mb-8 text-gray-600 text-center">Wybierz elementy, które Ci się podobają, abyśmy mogli doprecyzować Twój styl.</p>

      <div className='relative h-[400px] w-full max-w-sm mx-auto my-8'>
        {deck.length > 0 ? deck.map((detail, index) => (
          <TinderCard
            ref={childRefs[index]}
            className='absolute'
            key={detail.id}
            onSwipe={(dir) => swiped(dir as 'left' | 'right', detail.id)}
            preventSwipe={['up', 'down']}
          >
            <div
              style={{ backgroundImage: `url(${detail.imageUrl || ''})` }}
              className='relative w-[300px] h-[400px] bg-white rounded-xl bg-cover bg-center shadow-lg group'
            >
                <div className="absolute bottom-2 left-2 right-2 p-2 bg-black bg-opacity-50 rounded-lg text-white">
                    <p className="font-bold">{detail.name}</p>
                    <p className="text-sm opacity-80">{detail.category}</p>
                </div>
            </div>
          </TinderCard>
        )) : <p className="text-center">Ładowanie detali...</p>}
        {deck.length === 0 && <p className="text-center">Brak pasujących detali do wyświetlenia dla wybranych stylów i pomieszczeń.</p>}
      </div>

       <div className="flex justify-center gap-4 mt-4">
        <Button onClick={() => swipeUI('left')} variant="destructive">Nie podoba mi się</Button>
        <Button onClick={() => swipeUI('right')}>Podoba mi się</Button>
      </div>
    </div>
  );
}
