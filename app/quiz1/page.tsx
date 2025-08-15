"use client"

import { useState, useEffect } from "react"
import { RoomSelection } from "@/components/quiz/room-selection"
import { StyleSwipe, FinishReason } from "@/components/quiz/style-swipe"
import { NarrowDownRound, NarrowDownOutcome } from "@/components/quiz/narrow-down-round"
import { DetailsRound, DetailsRoundOutcome } from "@/components/quiz/details-round"
import { MaterialSelection } from "@/components/quiz/material-selection"
import { PlayoffRound, PlayoffReason, PlayoffScores } from "@/components/quiz/playoff-round"
import { ModeSelection, QuizMode } from "@/components/quiz/mode-selection"
import { HandoverScreen } from "@/components/quiz/handover-screen"
import { ComparisonResults } from "@/components/quiz/comparison-results"
import { Quiz, Style } from '@prisma/client'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"

type QuizStep = "mode-selection" | "room-selection" | "style-swipe" | "narrow-down" | "material-selection" | "playoff-round" | "details-round" | "results" | "comparison-results" | "handover";
type User = 'user1' | 'user2';
type PairState<T> = { user1: T, user2: T };
interface Detail { id: string; name: string; category: string; imageUrl: string; }

const QUIZ_STEPS_COUNT = 6; // mode, room, swipe, narrow, details, results

export default function Quiz1Page() {
  const [step, setStep] = useState<QuizStep>("mode-selection");
  const [quizMode, setQuizMode] = useState<QuizMode>('single');
  const [currentUser, setCurrentUser] = useState<User>('user1');
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [scores, setScores] = useState<Record<string, number> | PairState<Record<string, number>>>({});
  const [topStyles, setTopStyles] = useState<Style[] | PairState<Style[]>>([]);
  const [detailScores, setDetailScores] = useState<Record<string, number> | PairState<Record<string, number>>>({});
  const [playoffReason, setPlayoffReason] = useState<PlayoffReason | null>(null);
  const [nextStepAfterPlayoff, setNextStepAfterPlayoff] = useState<QuizStep>("details-round");
  const [nextStepAfterHandover, setNextStepAfterHandover] = useState<QuizStep>("style-swipe");
  const [styleQuiz, setStyleQuiz] = useState<Quiz | null>(null)
  const [allStyles, setAllStyles] = useState<Style[]>([])
  const [allDetails, setAllDetails] = useState<Detail[]>([])
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetch('/api/quiz').then(res => res.json()).then(q => setStyleQuiz(q.find((qz: Quiz) => qz.type === 'STYLE') || null));
    fetch('/api/quiz/styles').then(res => res.json()).then(setAllStyles);
    fetch('/api/quiz/details').then(res => res.json()).then(setAllDetails);
  }, []);

  useEffect(() => {
    const stepMap: Record<QuizStep, number> = {
      "mode-selection": 1,
      "room-selection": 2,
      "style-swipe": 3,
      "narrow-down": 4,
      "details-round": 5,
      "playoff-round": 4, // Part of narrow-down or details
      "material-selection": 4, // Alternative path
      "results": 6,
      "comparison-results": 6,
      "handover": step === 'handover' ? (nextStepAfterHandover === 'style-swipe' ? 2.5 : 3.5) : 0,
    };
    const currentStepNumber = stepMap[step] || 0;
    setProgress((currentStepNumber / QUIZ_STEPS_COUNT) * 100);
  }, [step, nextStepAfterHandover]);

  const handleModeSelection = (mode: QuizMode) => {
    setQuizMode(mode);
    if (mode === 'pair') {
      setScores({ user1: {}, user2: {} });
      setTopStyles({ user1: [], user2: [] });
      setDetailScores({ user1: {}, user2: {} });
    } else {
      setScores({});
      setTopStyles([]);
      setDetailScores({});
    }
    setStep("room-selection");
  };

  const handleRoomSelectionNext = (rooms: string[]) => {
    setSelectedRooms(rooms);
    setStep("style-swipe");
  }

  const updateUserState = <T,>(setter: React.Dispatch<React.SetStateAction<T | PairState<T>>>, value: T) => {
    if (quizMode === 'single') {
      setter(value);
    } else {
      setter(prev => ({ ...(prev as PairState<T>), [currentUser]: value }));
    }
  };

  const handleStyleSwipeFinish = (round1Scores: Record<string, number>, reason: FinishReason) => {
    updateUserState(setScores, round1Scores);

    if (quizMode === 'pair' && currentUser === 'user1') {
      setCurrentUser('user2');
      setNextStepAfterHandover('style-swipe');
      setStep('handover');
      return;
    }

    if (reason === 'limit_reached') {
        setStep("material-selection");
    } else {
        const getTop = (userScores: Record<string, number>) => Object.entries(userScores).sort((a,b)=>b[1]-a[1]).slice(0,5).map(e=>e[0]);
        if (quizMode === 'single') {
            const topNames = getTop(round1Scores);
            setTopStyles(allStyles.filter(s => topNames.includes(s.name)));
        } else {
            const pairScores = scores as PairState<Record<string, number>>;
            const finalUser1Scores = currentUser === 'user1' ? round1Scores : pairScores.user1;
            const finalUser2Scores = currentUser === 'user2' ? round1Scores : pairScores.user2;
            const top1 = getTop(finalUser1Scores);
            const top2 = getTop(finalUser2Scores);
            setTopStyles({
                user1: allStyles.filter(s => top1.includes(s.name)),
                user2: allStyles.filter(s => top2.includes(s.name)),
            });
        }

        setCurrentUser('user1');
        setNextStepAfterHandover('narrow-down');
        setStep(quizMode === 'pair' ? 'handover' : 'narrow-down');
    }
  }

  const handleNarrowDownFinish = (finishedScores: Record<string, number>, outcome: NarrowDownOutcome) => {
    updateUserState(s => ({ ...(s as any), ...finishedScores }), scores); // This logic needs to be better

    if (outcome !== 'clear_result') {
      setPlayoffReason(outcome);
      setNextStepAfterPlayoff("narrow-down");
      setStep("playoff-round");
      return;
    }

    if (quizMode === 'pair' && currentUser === 'user1') {
      setCurrentUser('user2');
      setNextStepAfterHandover('narrow-down');
      setStep('handover');
    } else {
      setCurrentUser('user1');
      setNextStepAfterHandover('details-round');
      setStep(quizMode === 'pair' ? 'handover' : 'details-round');
    }
  }

  const handlePlayoffFinish = (playoffScores: PlayoffScores) => {
    // Simplified score update
    setStep(nextStepAfterPlayoff);
  }

  const handleDetailsFinish = (finishedDetailScores: Record<string, number>, outcome: DetailsRoundOutcome) => {
    updateUserState(setDetailScores, finishedDetailScores);

    if (outcome !== 'clear_result') {
      const reason: PlayoffReason = outcome === 'all_liked' ? 'all_liked' : 'all_disliked';
      setPlayoffReason(reason);
      setNextStepAfterPlayoff("details-round");
      setStep("playoff-round");
      return;
    }

    if (quizMode === 'pair' && currentUser === 'user1') {
      setCurrentUser('user2');
      setNextStepAfterHandover('details-round');
      setStep('handover');
    } else {
      setStep(quizMode === 'pair' ? 'comparison-results' : 'results');
    }
  }

  const handleMaterialSelectionFinish = (materialScores: Record<string, number>) => {
    // Store material scores and continue to results
    updateUserState(setDetailScores, materialScores);
    setStep("results");
  };
  const handleNextTurn = () => setStep(nextStepAfterHandover);

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("Raport Waszego Stylu", 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text("Wygenerowano przez ARTSCore Quiz", 105, 30, { align: 'center' });

    if (quizMode === 'single') {
        const finalScores = scores as Record<string, number>;
        const finalDetailScores = detailScores as Record<string, number>;
        autoTable(doc, { head: [['Twoje Główne Style']], startY: 40, theme: 'plain' });
    } else {
        const pairScores = scores as PairState<Record<string, number>>;
        const pairDetailScores = detailScores as PairState<Record<string, number>>;
        const getTopStyles = (user: User) => Object.entries(pairScores[user]).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([n])=>allStyles.find(s=>s.name===n)).filter((s):s is Style=>!!s);
        const topStyles1 = getTopStyles('user1');
        const topStyles2 = getTopStyles('user2');
        const sharedStyles = topStyles1.filter(s1 => topStyles2.some(s2 => s2.id === s1.id));
        const uniqueStyles1 = topStyles1.filter(s1 => !topStyles2.some(s2 => s2.id === s1.id));
        const uniqueStyles2 = topStyles2.filter(s1 => !topStyles1.some(s2 => s2.id === s1.id));
        const getLikedDetails = (user: User) => Object.keys(pairDetailScores[user]).filter(id => pairDetailScores[user][id] > 0);
        const likedD1 = new Set(getLikedDetails('user1'));
        const likedD2 = new Set(getLikedDetails('user2'));
        const sharedLikedDetails = allDetails.filter(d => likedD1.has(d.id) && likedD2.has(d.id));

        let lastY = 40;

        autoTable(doc, { head: [['Wspólne Odkrycia']], startY: lastY, theme: 'plain', styles: { fontSize: 18 }});
        lastY = (doc as any).lastAutoTable.finalY + 5;
        if (sharedStyles.length > 0) {
            autoTable(doc, { head: [['Wspólne style']], body: sharedStyles.map(s => [s.name]), startY: lastY });
            lastY = (doc as any).lastAutoTable.finalY + 5;
        }
        if (sharedLikedDetails.length > 0) {
            autoTable(doc, { head: [['Wspólne detale']], body: sharedLikedDetails.map(d => [d.name]), startY: lastY });
            lastY = (doc as any).lastAutoTable.finalY + 5;
        }

        autoTable(doc, { head: [['Wasze Indywidualne Preferencje']], startY: lastY + 10, theme: 'plain', styles: { fontSize: 18 }});
        lastY = (doc as any).lastAutoTable.finalY + 5;
        autoTable(doc, { head: [['Gracz 1']], body: uniqueStyles1.map(s => [s.name]), startY: lastY });
        autoTable(doc, { head: [['Gracz 2']], body: uniqueStyles2.map(s => [s.name]), startY: lastY, margin: { left: 105 } });
    }

    doc.save("raport-stylu-artscore.pdf");
  }

  if (!styleQuiz || allStyles.length === 0) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center">
                <p className="text-lg text-gray-600">Ładowanie quizu...</p>
            </div>
        </div>
    );
  }

  const getWinningStyles = () => {
    const userScores = quizMode === 'single' ? scores as Record<string, number> : (scores as PairState<Record<string, number>>)[currentUser];
    return Object.entries(userScores).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([n])=>allStyles.find(s=>s.name===n)).filter((s):s is Style=>!!s);
  }

  const currentTopStyles = quizMode === 'single' ? topStyles as Style[] : (topStyles as PairState<Style[]>)[currentUser];

  const renderStep = () => {
    switch(step) {
        case "mode-selection": return <ModeSelection onSelectMode={handleModeSelection} />;
        case "room-selection": return <RoomSelection onNext={handleRoomSelectionNext} />;
        case "handover": return <HandoverScreen nextUser={currentUser === 'user1' ? '1' : '2'} onNextTurn={handleNextTurn} />;
        case "style-swipe": return <StyleSwipe onFinish={handleStyleSwipeFinish} quizId={styleQuiz.id} selectedRooms={selectedRooms} />;
        case "narrow-down": return <NarrowDownRound topStyles={currentTopStyles} onFinish={handleNarrowDownFinish} selectedRooms={selectedRooms} />;
        case "details-round": return <DetailsRound winningStyles={getWinningStyles()} selectedRooms={selectedRooms} onFinish={handleDetailsFinish} />;
        case "playoff-round": return playoffReason && <PlayoffRound reason={playoffReason} styles={allStyles} onFinish={handlePlayoffFinish} />;
        case "material-selection": 
          return <MaterialSelection 
            onFinish={handleMaterialSelectionFinish} 
            emergencyMode={true}
          />;
        case "results":
            return (
                <Card>
                    <CardContent className="p-6">
                        <h2 className="text-2xl font-bold mb-4">Twoje Wyniki</h2>
                        <ul>
                            {Object.entries(scores as Record<string, number>).sort((a, b) => b[1] - a[1]).map(([style, score]) => (
                            <li key={style}>{style}: {score}</li>
                            ))}
                        </ul>
                        <Button onClick={handleDownloadPdf} className="mt-4">Pobierz PDF</Button>
                    </CardContent>
                </Card>
            );
        case "comparison-results":
            return (
                <ComparisonResults
                    scores={scores as PairState<Record<string, number>>}
                    detailScores={detailScores as PairState<Record<string, number>>}
                    allStyles={allStyles}
                    allDetails={allDetails}
                    onDownloadPdf={handleDownloadPdf}
                />
            );
        default: return null;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FEFCF8] via-white to-[#F8F4EF] font-body-regular text-[#2A2A2A]">
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-heading-semibold text-[#2A2A2A] mb-2">
                        {styleQuiz.title}
                    </h1>
                    <p className="text-base sm:text-lg text-[#666666]">
                        {styleQuiz.description}
                    </p>
                    {quizMode === 'pair' && !['mode-selection', 'room-selection', 'results', 'comparison-results'].includes(step) &&
                        <p className="text-lg font-body-semibold text-[#b38a34] mt-2">
                            Tura gracza: {currentUser === 'user1' ? '1' : '2'}
                        </p>
                    }
                </header>

                {!['mode-selection', 'results', 'comparison-results'].includes(step) && (
                    <div className="mb-8">
                        <Progress value={progress} className="w-full" />
                        <p className="text-center text-sm text-[#666666] mt-2">Krok {step === 'handover' ? (nextStepAfterHandover === 'style-swipe' ? 2 : 3) : (stepMap[step] || 0) -1} z {QUIZ_STEPS_COUNT - 1}</p>
                    </div>
                )}

                <main>
                    {renderStep()}
                </main>
            </div>
        </div>
    </div>
  )
}

// Dummy stepMap for progress calculation, should be defined outside or passed as prop
const stepMap: Record<QuizStep, number> = {
  "mode-selection": 1,
  "room-selection": 2,
  "style-swipe": 3,
  "narrow-down": 4,
  "details-round": 5,
  "playoff-round": 4.5,
  "material-selection": 5,
  "results": 6,
  "comparison-results": 6,
  "handover": 0, // Handled dynamically
};
