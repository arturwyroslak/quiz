"use client"

import React, { useState, useMemo, useRef, useEffect } from 'react'
import TinderCard from 'react-tinder-card'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Heart, Palette, Wrench } from 'lucide-react'
import { motion } from 'framer-motion'

interface Detail { 
  id: string; 
  name: string; 
  category: string; 
  imageUrl: string; 
}

interface MaterialSelectionProps {
  onFinish: (selectedMaterials: Record<string, number>) => void;
  emergencyMode?: boolean; // When user rejected too many styles
}

export function MaterialSelection({ onFinish, emergencyMode = false }: MaterialSelectionProps) {
  const [allDetails, setAllDetails] = useState<Detail[]>([]);
  const [deck, setDeck] = useState<Detail[]>([]);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [categories] = useState([
    'Kolory i wykończenia ścian',
    'Podłogi i pokrycia', 
    'Tkaniny i tekstylia',
    'Kuchnia i łazienka',
    'Oświetlenie',
    'Meble'
  ]);

  const childRefs: any = useMemo(() => Array(deck.length).fill(0).map(() => React.createRef()), [deck.length]);

  useEffect(() => {
    fetch('/api/quiz/details')
      .then(res => res.json())
      .then((data: Detail[]) => {
        setAllDetails(data);
        
        // Create focused deck for material selection
        // Prioritize visual elements that help define style preferences
        const priorityCategories = [
          'Kolory i wykończenia ścian',
          'Podłogi i pokrycia',
          'Tkaniny i tekstylia',
          'Oświetlenie',
          'Meble'
        ];

        let materialDeck: Detail[] = [];
        priorityCategories.forEach(category => {
          const categoryDetails = data.filter(d => d.category === category);
          // Take up to 8 items from each category
          materialDeck.push(...categoryDetails.slice(0, 8));
        });

        // Shuffle the deck for variety
        materialDeck = materialDeck.sort(() => 0.5 - Math.random()).slice(0, 30);
        
        setDeck(materialDeck);
        setCurrentIndex(materialDeck.length - 1);
      });
  }, []);

  const swiped = (direction: 'left' | 'right', detail: Detail) => {
    const scoreChange = direction === 'right' ? 2 : -1;
    setScores(prev => ({ ...prev, [detail.id]: scoreChange }));
    setCurrentIndex(prev => prev - 1);
  };

  const swipeUI = async (dir: 'left' | 'right') => {
    if (currentIndex >= 0 && currentIndex < deck.length) {
      await childRefs[currentIndex].current?.swipe(dir);
    }
  };

  const handleFinish = () => {
    onFinish(scores);
  };

  const isFinished = deck.length > 0 && currentIndex < 0;
  const likedCount = Object.values(scores).filter(score => score > 0).length;
  const progress = deck.length > 0 ? ((deck.length - currentIndex - 1) / deck.length) * 100 : 0;

  if (isFinished) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="font-heading-semibold text-2xl flex items-center justify-center gap-2">
            <Palette className="w-6 h-6 text-[#b38a34]" />
            Materiały wybrane!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-6 font-body-regular text-gray-600">
            Świetnie! Wybrałeś {likedCount} materiałów i elementów. 
            Teraz możemy lepiej dopasować style do Twoich preferencji.
          </p>
          <Button 
            onClick={handleFinish} 
            size="lg" 
            className="bg-gradient-to-r from-[#b38a34] to-[#9a7529] text-white"
          >
            Przejdź do wyników
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      <Card className="w-full mb-6">
        <CardHeader className="text-center pb-4">
          <CardTitle className="font-heading-semibold text-2xl flex items-center justify-center gap-2">
            <Wrench className="w-6 h-6 text-[#b38a34]" />
            {emergencyMode ? 'Pomóż nam doprecyzować Twój gust' : 'Wybór materiałów i detali'}
          </CardTitle>
          <p className="font-body-regular text-gray-600 mt-2">
            {emergencyMode 
              ? 'Trudno było wyłonić dominujący styl. Wybierz materiały, które Ci się podobają.'
              : 'Wybierz materiały i detale, które najbardziej Ci odpowiadają.'
            }
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <Badge key={cat} variant="outline" className="text-xs">
                  {cat}
                </Badge>
              ))}
            </div>
            <div className="text-sm text-gray-500">
              {deck.length - currentIndex - 1} / {deck.length}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-[#b38a34] to-[#9a7529] h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <div className='relative h-[50vh] w-full max-w-md mx-auto my-8 flex justify-center items-center'>
        {deck.length > 0 ? deck.map((detail, index) => (
          <TinderCard
            ref={childRefs[index]}
            className='absolute'
            key={detail.id}
            onSwipe={(dir) => swiped(dir as 'left' | 'right', detail)}
            preventSwipe={['up', 'down']}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ backgroundImage: `url(${detail.imageUrl || '/images/placeholder.jpg'})` }}
              className='relative w-[90vw] max-w-sm h-[50vh] bg-white rounded-2xl bg-cover bg-center shadow-2xl'
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-2xl"></div>
              <div className="absolute top-4 right-4">
                <Badge className="bg-[#b38a34] text-white">
                  {detail.category}
                </Badge>
              </div>
              <div className="absolute bottom-4 left-4 right-4 p-2 text-white">
                <p className="font-heading-bold text-lg drop-shadow-lg">{detail.name}</p>
                <p className="text-sm opacity-90 font-body-regular drop-shadow-md">
                  Przesuń w prawo, jeśli Ci się podoba
                </p>
              </div>
            </motion.div>
          </TinderCard>
        )) : (
          <div className="text-center text-gray-500">
            <p>Ładowanie materiałów...</p>
          </div>
        )}
      </div>

      <div className="flex justify-center items-center gap-4 mt-4">
        <Button 
          onClick={() => swipeUI('left')} 
          variant="outline" 
          size="lg" 
          className="rounded-full p-4 w-20 h-20 border-2 border-red-500 text-red-500 hover:bg-red-500/10"
        >
          <X size={32} />
        </Button>
        <Button 
          onClick={() => swipeUI('right')} 
          variant="outline" 
          size="lg" 
          className="rounded-full p-4 w-20 h-20 border-2 border-green-500 text-green-500 hover:bg-green-500/10"
        >
          <Heart size={32} />
        </Button>
      </div>

      {likedCount > 0 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Wybrano: {likedCount} materiałów
          </p>
        </div>
      )}
    </div>
  )
}
