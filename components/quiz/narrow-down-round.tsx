"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface Style {
  id: string;
  name: string;
  images: { url: string }[];
}

interface NarrowDownRoundProps {
  topStyles: Style[];
  onFinish: (finalScores: Record<string, number>) => void;
}

export function NarrowDownRound({ topStyles, onFinish }: NarrowDownRoundProps) {
  const [scores, setScores] = useState<Record<string, number>>({})

  const handleLike = (styleId: string) => {
    setScores(prev => ({ ...prev, [styleId]: (prev[styleId] || 0) + 1 }))
  }

  // Create a flat list of all images from the top styles
  const allImages = topStyles.flatMap(style =>
    style.images.slice(0, 4).map(image => ({ ...image, styleId: style.id, styleName: style.name }))
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Runda 2: Zawężenie wyboru</h2>
      <p className="mb-8 text-gray-600">Oceń poniższe inspiracje, abyśmy mogli lepiej dopasować rekomendacje.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {allImages.map((image, index) => (
          <div key={index} className="border rounded-lg p-2">
            <div className="relative h-64">
              <Image src={image.url} alt={image.styleName} layout="fill" objectFit="cover" className="rounded"/>
            </div>
            <div className="p-2 flex justify-between items-center">
              <span className="font-semibold">{image.styleName}</span>
              <Button onClick={() => handleLike(image.styleId)} size="sm">Podoba mi się</Button>
            </div>
          </div>
        ))}
      </div>
      <Button onClick={() => onFinish(scores)}>Zakończ i zobacz wyniki</Button>
    </div>
  )
}
