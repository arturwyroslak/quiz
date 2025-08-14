"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"

// Interfaces
interface StyleImage { id: string; url: string; styleId: string; styleName: string; }
interface Style { id: string; name: string; images: { id: string, url: string }[]; }
export type PlayoffReason = 'all_liked' | 'all_disliked' | 'indecisive';
interface Vote {
    score: number;
    changes: number;
}
export type PlayoffScores = Record<string, Vote>;

interface PlayoffRoundProps {
  reason: PlayoffReason;
  styles: Style[];
  onFinish: (newScores: PlayoffScores) => void;
}

const messages: Record<PlayoffReason, { title: string; description: string; placeholder: string; }> = {
  all_liked: {
    title: "Wygląda na to, że wszystko Ci się podoba!",
    description: "To świetnie! Aby pomóc nam jeszcze lepiej dopasować wyniki, wskaż, które z poniższych inspiracji podobają Ci się najbardziej, lub opisz, co jest dla Ciebie kluczowe.",
    placeholder: "Np. 'Najbardziej zależy mi na dużej ilości światła i przestrzeni.'"
  },
  all_disliked: {
    title: "Nie znaleźliśmy nic dla Ciebie?",
    description: "Chcemy to naprawić. Opisz proszę, czego szukasz w aranżacji wnętrza, a my spróbujemy dobrać nową pulę inspiracji.",
    placeholder: "Np. 'Szukam czegoś w ciemnych kolorach, z elementami metalu.'"
  },
  indecisive: {
    title: "Potrzebujemy małej podpowiedzi",
    description: "Twoje wybory są bardzo różnorodne. Czy są jakieś kolory, materiały lub funkcje, które szczególnie lubisz lub chcesz wykluczyć? To pomoże nam zawęzić poszukiwania.",
    placeholder: "Np. 'Na pewno chcę uniknąć złotych dodatków. Lubię naturalne drewno.'"
  }
};

export function PlayoffRound({ reason, styles, onFinish }: PlayoffRoundProps) {
  const [userText, setUserText] = useState("");
  const [deck, setDeck] = useState<StyleImage[]>([]);
  const [votes, setVotes] = useState<PlayoffScores>({});

  useEffect(() => {
    let imagePool: StyleImage[] = [];
    styles.forEach(style => {
      style.images.forEach(img => {
        imagePool.push({ ...img, styleId: style.id, styleName: style.name });
      });
    });

    const shuffled = imagePool.sort(() => 0.5 - Math.random());
    setDeck(shuffled.slice(0, 8));
  }, [styles]);

  const handleVote = (styleId: string, vote: number) => {
    const currentVote = votes[styleId] || { score: 0, changes: 0 };
    const newChanges = currentVote.score !== 0 && currentVote.score !== vote
        ? currentVote.changes + 1
        : currentVote.changes;

    setVotes(prev => ({
        ...prev,
        [styleId]: {
            score: vote,
            changes: newChanges
        }
    }));
  };

  const handleSubmit = () => {
    onFinish(votes);
  }

  const { title, description, placeholder } = messages[reason];

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <p className="mb-6 text-gray-600 max-w-2xl mx-auto">{description}</p>
      <Textarea
        value={userText}
        onChange={(e) => setUserText(e.target.value)}
        placeholder={placeholder}
        className="max-w-xl mx-auto mb-8"
      />
      <h3 className="text-xl font-semibold mb-4">Oceń poniższe inspiracje:</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {deck.map((image) => (
          <div key={image.id} className="border rounded-lg p-2">
            <div className="relative h-48">
              <Image src={image.url} alt={image.styleName} layout="fill" objectFit="cover" className="rounded"/>
            </div>
            <div className="p-2 text-left">
                <p className="font-semibold">{image.styleName}</p>
            </div>
            <div className="flex justify-end gap-2 mt-2">
                <Button onClick={() => handleVote(image.styleId, -1)} variant="destructive" size="sm">Nie</Button>
                <Button onClick={() => handleVote(image.styleId, 1)} variant="default" size="sm">Tak</Button>
            </div>
          </div>
        ))}
      </div>
      <Button onClick={handleSubmit}>Zakończ dogrywkę</Button>
    </div>
  )
}
