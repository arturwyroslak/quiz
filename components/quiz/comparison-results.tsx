"use client"

import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, User, Heart, HeartCrack, Shuffle } from "lucide-react"

// These types would ideally be in a central types file
type User = 'user1' | 'user2';
type PairState<T> = { user1: T, user2: T };
interface Style { id: string; name: string; description?: string | null; }
interface Detail { id: string; name: string; category: string; }

interface ComparisonResultsProps {
  scores: PairState<Record<string, number>>;
  detailScores: PairState<Record<string, number>>;
  allStyles: Style[];
  allDetails: Detail[];
  onDownloadPdf: () => void;
}

export function ComparisonResults({ scores, detailScores, allStyles, allDetails, onDownloadPdf }: ComparisonResultsProps) {

  const analysis = useMemo(() => {
    const getTopStyles = (user: User) => {
      const userScores = scores[user];
      return Object.entries(userScores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([name]) => allStyles.find(s => s.name === name))
        .filter((s): s is Style => !!s);
    };

    const topStyles1 = getTopStyles('user1');
    const topStyles2 = getTopStyles('user2');

    const sharedStyles = topStyles1.filter(s1 => topStyles2.some(s2 => s2.id === s1.id));
    const uniqueStyles1 = topStyles1.filter(s1 => !topStyles2.some(s2 => s2.id === s1.id));
    const uniqueStyles2 = topStyles2.filter(s1 => !topStyles1.some(s2 => s2.id === s1.id));

    const getLikedDetails = (user: User) => {
        const userDetailScores = detailScores[user];
        return Object.keys(userDetailScores).filter(id => userDetailScores[id] > 0);
    }

    const likedDetails1 = new Set(getLikedDetails('user1'));
    const likedDetails2 = new Set(getLikedDetails('user2'));

    const sharedLikedDetails = allDetails.filter(d => likedDetails1.has(d.id) && likedDetails2.has(d.id));

    // Simple compromise: suggest a style that is liked by one person but not in the top 3 of the other
    const compromiseStyles = [...uniqueStyles1, ...uniqueStyles2].filter(style => {
        const s1Score = scores.user1[style.name] || 0;
        const s2Score = scores.user2[style.name] || 0;
        return (s1Score > 0 && s2Score >= 0) || (s2Score > 0 && s1Score >= 0);
    }).slice(0, 2);

    return { sharedStyles, uniqueStyles1, uniqueStyles2, sharedLikedDetails, compromiseStyles };

  }, [scores, detailScores, allStyles, allDetails]);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Wasze Wspólne Wyniki</h2>
        <p className="text-gray-600 mt-2">Oto analiza Waszych preferencji. Użyjcie jej jako punktu wyjścia do stworzenia idealnego wnętrza.</p>
      </div>

      <Card>
        <CardHeader className="flex-row items-center gap-4">
            <Heart className="w-8 h-8 text-green-500" />
            <CardTitle>Wspólne Odkrycia</CardTitle>
        </CardHeader>
        <CardContent>
            {analysis.sharedStyles.length > 0 ? (
                <div>
                    <h3 className="font-semibold mb-2">Style, które oboje lubicie:</h3>
                    <div className="flex flex-wrap gap-2">
                        {analysis.sharedStyles.map(s => <Badge key={s.id} variant="default">{s.name}</Badge>)}
                    </div>
                </div>
            ) : <p>Nie znaleziono wspólnych stylów w Waszych top 3.</p>}
             {analysis.sharedLikedDetails.length > 0 && (
                <div className="mt-4">
                    <h3 className="font-semibold mb-2">Detale, które oboje polubiliście:</h3>
                     <div className="flex flex-wrap gap-2">
                        {analysis.sharedLikedDetails.map(d => <Badge key={d.id} variant="secondary">{d.name}</Badge>)}
                    </div>
                </div>
            )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
            <CardHeader className="flex-row items-center gap-4">
                <User className="w-8 h-8 text-blue-500" />
                <CardTitle>Preferencje Gracza 1</CardTitle>
            </CardHeader>
            <CardContent>
                {analysis.uniqueStyles1.length > 0 ? (
                     <div className="flex flex-wrap gap-2">
                        {analysis.uniqueStyles1.map(s => <Badge key={s.id}>{s.name}</Badge>)}
                    </div>
                ) : <p>Wszystkie Twoje topowe style są wspólne!</p>}
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex-row items-center gap-4">
                <User className="w-8 h-8 text-pink-500" />
                <CardTitle>Preferencje Gracza 2</CardTitle>
            </CardHeader>
            <CardContent>
                 {analysis.uniqueStyles2.length > 0 ? (
                     <div className="flex flex-wrap gap-2">
                        {analysis.uniqueStyles2.map(s => <Badge key={s.id}>{s.name}</Badge>)}
                    </div>
                ) : <p>Wszystkie Twoje topowe style są wspólne!</p>}
            </CardContent>
        </Card>
      </div>

      {analysis.compromiseStyles.length > 0 && (
        <Card>
            <CardHeader className="flex-row items-center gap-4">
                <Shuffle className="w-8 h-8 text-purple-500" />
                <CardTitle>Propozycje Kompromisu</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="mb-4">Oto style, które mogą połączyć Wasze gusta. Są wysoko oceniane przez jedną osobę i neutralne lub pozytywne dla drugiej:</p>
                <div className="flex flex-wrap gap-2">
                    {analysis.compromiseStyles.map(s => <Badge key={s.id} variant="outline">{s.name}</Badge>)}
                </div>
            </CardContent>
        </Card>
      )}

       <div className="text-center pt-8">
           <Button onClick={onDownloadPdf}>Pobierz raport PDF</Button>
       </div>
    </div>
  )
}
