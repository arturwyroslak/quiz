"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface Detail {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
}

interface DetailsRoundProps {
  onFinish: (detailScores: Record<string, number>) => void;
}

export function DetailsRound({ onFinish }: DetailsRoundProps) {
  const [details, setDetails] = useState<Detail[]>([]);
  const [scores, setScores] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch('/api/quiz/details')
      .then(res => res.json())
      .then(setDetails);
  }, []);

  const handleVote = (detailId: string, score: number) => {
    setScores(prev => ({ ...prev, [detailId]: (prev[detailId] || 0) + score }));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Runda 3: Detale i Materiały</h2>
      <p className="mb-8 text-gray-600">Wybierz elementy, które Ci się podobają, abyśmy mogli jeszcze lepiej doprecyzować Twój styl.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {details.map((detail) => (
          <div key={detail.id} className="border rounded-lg p-2">
            <div className="relative h-48">
              <Image src={detail.imageUrl} alt={detail.name} layout="fill" objectFit="cover" className="rounded"/>
            </div>
            <div className="p-2">
              <p className="font-semibold">{detail.name}</p>
              <p className="text-sm text-gray-500">{detail.category}</p>
              <div className="flex justify-end gap-2 mt-2">
                <Button onClick={() => handleVote(detail.id, -1)} variant="destructive" size="sm">Nie</Button>
                <Button onClick={() => handleVote(detail.id, 1)} variant="default" size="sm">Tak</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Button onClick={() => onFinish(scores)}>Zakończ Quiz</Button>
    </div>
  );
}
