"use client"

import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, User, Heart, HeartCrack, Shuffle, Award, Star } from "lucide-react"

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

    const compromiseStyles = [...uniqueStyles1, ...uniqueStyles2].filter(style => {
        const s1Score = scores.user1[style.name] || 0;
        const s2Score = scores.user2[style.name] || 0;
        return (s1Score > 0 && s2Score >= 0) || (s2Score > 0 && s1Score >= 0);
    }).slice(0, 2);

    return { sharedStyles, uniqueStyles1, uniqueStyles2, sharedLikedDetails, compromiseStyles };

  }, [scores, detailScores, allStyles, allDetails]);

  const ResultCard = ({ icon, title, description, children }: { icon: React.ReactNode, title: string, description: string, children: React.ReactNode }) => (
    <Card className="w-full border-gray-200/80 shadow-sm bg-white/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-start gap-4 space-y-0">
            <div className="p-3 bg-gradient-to-br from-[#b38a34]/20 to-transparent rounded-full">
                {icon}
            </div>
            <div>
                <CardTitle className="font-heading-semibold text-xl">{title}</CardTitle>
                <CardDescription className="font-body-regular text-base">{description}</CardDescription>
            </div>
        </CardHeader>
        <CardContent>
            {children}
        </CardContent>
    </Card>
  )


  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold font-heading-semibold">Wasze Wspólne Wyniki</h2>
        <p className="text-gray-600 mt-2 font-body-regular max-w-2xl mx-auto">Oto analiza Waszych preferencji. Użyjcie jej jako punktu wyjścia do stworzenia idealnego wnętrza, które oboje pokochacie.</p>
      </div>

      <ResultCard
        icon={<Heart className="w-6 h-6 text-[#b38a34]" />}
        title="Wspólne Odkrycia"
        description="Elementy, które oboje polubiliście. To świetna baza do dalszych rozmów!"
      >
        {analysis.sharedStyles.length > 0 && (
            <div>
                <h3 className="font-body-semibold text-gray-800 mb-2">Wspólne style:</h3>
                <div className="flex flex-wrap gap-2">
                    {analysis.sharedStyles.map(s => <Badge key={s.id} variant="default" className="bg-[#b38a34] hover:bg-[#9a7529] text-white text-sm px-3 py-1">{s.name}</Badge>)}
                </div>
            </div>
        )}
        {analysis.sharedLikedDetails.length > 0 && (
            <div className={analysis.sharedStyles.length > 0 ? "mt-4" : ""}>
                <h3 className="font-body-semibold text-gray-800 mb-2">Wspólne detale:</h3>
                 <div className="flex flex-wrap gap-2">
                    {analysis.sharedLikedDetails.map(d => <Badge key={d.id} variant="secondary" className="text-sm px-3 py-1">{d.name}</Badge>)}
                </div>
            </div>
        )}
        {analysis.sharedStyles.length === 0 && analysis.sharedLikedDetails.length === 0 && (
            <p className="text-gray-500 font-body-regular">Nie znaleziono wspólnych preferencji w tej rundzie. Skupcie się na propozycjach kompromisu!</p>
        )}
      </ResultCard>

      <div className="grid md:grid-cols-2 gap-8">
        <ResultCard
            icon={<User className="w-6 h-6 text-blue-600" />}
            title="Preferencje Gracza 1"
            description="Unikalne style, które przypadły do gustu Graczowi 1."
        >
            {analysis.uniqueStyles1.length > 0 ? (
                 <div className="flex flex-wrap gap-2">
                    {analysis.uniqueStyles1.map(s => <Badge key={s.id} className="bg-blue-100 text-blue-800 text-sm px-3 py-1">{s.name}</Badge>)}
                </div>
            ) : <p className="text-gray-500 font-body-regular">Wszystkie Twoje topowe style są wspólne!</p>}
        </ResultCard>
        <ResultCard
            icon={<User className="w-6 h-6 text-pink-600" />}
            title="Preferencje Gracza 2"
            description="Unikalne style, które spodobały się Graczowi 2."
        >
             {analysis.uniqueStyles2.length > 0 ? (
                 <div className="flex flex-wrap gap-2">
                    {analysis.uniqueStyles2.map(s => <Badge key={s.id} className="bg-pink-100 text-pink-800 text-sm px-3 py-1">{s.name}</Badge>)}
                </div>
            ) : <p className="text-gray-500 font-body-regular">Wszystkie Twoje topowe style są wspólne!</p>}
        </ResultCard>
      </div>

      {analysis.compromiseStyles.length > 0 && (
        <ResultCard
            icon={<Shuffle className="w-6 h-6 text-purple-600" />}
            title="Propozycje Kompromisu"
            description="Style, które mogą połączyć Wasze gusta. Są wysoko oceniane przez jedną osobę i neutralne lub pozytywne dla drugiej."
        >
            <div className="flex flex-wrap gap-2">
                {analysis.compromiseStyles.map(s => <Badge key={s.id} variant="outline" className="text-purple-800 border-purple-300 text-sm px-3 py-1">{s.name}</Badge>)}
            </div>
        </ResultCard>
      )}

       <div className="text-center pt-8">
           <Button
            onClick={onDownloadPdf}
            size="lg"
            className="bg-gradient-to-r from-[#b38a34] to-[#9a7529] hover:from-[#9a7529] hover:to-[#81621e] text-white px-8 py-4 text-base rounded-xl font-body-semibold shadow-md hover:shadow-lg transition-all duration-300"
           >
                Pobierz raport PDF
            </Button>
       </div>
    </div>
  )
}
