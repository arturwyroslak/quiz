"use client"

import { useState, useEffect } from "react"
import { RoomSelection } from "@/components/quiz/room-selection"
import { StyleSwipe, FinishReason } from "@/components/quiz/style-swipe"
import { NarrowDownRound, NarrowDownOutcome } from "@/components/quiz/narrow-down-round"
import { DetailsRound, DetailsRoundOutcome } from "@/components/quiz/details-round"
import { MaterialSelection } from "@/components/quiz/material-selection"
import { PlayoffRound, PlayoffReason, PlayoffScores } from "@/components/quiz/playoff-round"
import { ModeSelection, QuizMode } from "@/components/quiz/mode-selection"
import { Quiz, Style } from '@prisma/client'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Button } from "@/components/ui/button"

type QuizStep = "mode-selection" | "room-selection" | "style-swipe" | "narrow-down" | "material-selection" | "playoff-round" | "details-round" | "results";
type User = 'user1' | 'user2';

// Helper type for pair-based state
type PairState<T> = { user1: T, user2: T };

interface Detail { id: string; name: string; category: string; imageUrl: string; }

export default function Quiz1Page() {
  const [step, setStep] = useState<QuizStep>("mode-selection");
  const [quizMode, setQuizMode] = useState<QuizMode>('single');
  const [currentUser, setCurrentUser] = useState<User>('user1');

  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);

  // State is now structured to handle single or pair mode
  const [scores, setScores] = useState<Record<string, number> | PairState<Record<string, number>>>({});
  const [topStyles, setTopStyles] = useState<Style[] | PairState<Style[]>>([]);
  const [detailScores, setDetailScores] = useState<Record<string, number> | PairState<Record<string, number>>>({});

  const [playoffReason, setPlayoffReason] = useState<PlayoffReason | null>(null);
  const [nextStepAfterPlayoff, setNextStepAfterPlayoff] = useState<QuizStep>("details-round");

  const [styleQuiz, setStyleQuiz] = useState<Quiz | null>(null)
  const [allStyles, setAllStyles] = useState<Style[]>([])
  const [allDetails, setAllDetails] = useState<Detail[]>([])

  useEffect(() => {
    fetch('/api/quiz').then(res => res.json()).then((quizzes: Quiz[]) => {
      const quiz = quizzes.find(q => q.type === 'STYLE');
      setStyleQuiz(quiz || null);
    });
    fetch('/api/quiz/styles').then(res => res.json()).then(setAllStyles);
    fetch('/api/quiz/details').then(res => res.json()).then(setAllDetails);
  }, []);

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
    setSelectedRooms(rooms)
    setStep("style-swipe")
  }

  // NOTE: The handlers below are NOT yet compatible with 'pair' mode.
  // This will be addressed in the next step of the plan.
  const handleStyleSwipeFinish = (round1Scores: Record<string, number>, reason: FinishReason) => {
    setScores(round1Scores);

    if (reason === 'limit_reached') {
        setStep("material-selection");
    } else {
        const sortedScores = Object.entries(round1Scores).sort((a, b) => b[1] - a[1]);
        const topStyleNames = sortedScores.slice(0, 5).map(entry => entry[0]);
        const topStylesData = allStyles.filter(style => topStyleNames.includes(style.name));
        setTopStyles(topStylesData);
        setStep("narrow-down");
    }
  }

  const handleNarrowDownFinish = (round2Scores: Record<string, number>, outcome: NarrowDownOutcome) => {
    const currentScores = quizMode === 'single' ? scores as Record<string, number> : (scores as PairState<Record<string, number>>)[currentUser];
    const combinedScores = { ...currentScores };
    for (const [styleId, score] of Object.entries(round2Scores)) {
        const style = allStyles.find(s => s.id === styleId);
        if (style) {
            combinedScores[style.name] = (combinedScores[style.name] || 0) + score;
        }
    }
    // This part is incorrect for pair mode and needs a full refactor
    setScores(combinedScores);

    if (outcome === 'clear_result') {
        setStep("details-round");
    } else {
        setPlayoffReason(outcome);
        setNextStepAfterPlayoff("details-round");
        setStep("playoff-round");
    }
  }

  const handlePlayoffFinish = (playoffScores: PlayoffScores) => {
    const currentScores = quizMode === 'single' ? scores as Record<string, number> : (scores as PairState<Record<string, number>>)[currentUser];
    const combinedScores = { ...currentScores };
    for (const [styleId, vote] of Object.entries(playoffScores)) {
        const style = allStyles.find(s => s.id === styleId);
        if (style) {
            // NOTE: The 'changes' count from vote.changes is available here.
            // It could be stored or used in the report. For now, we just use the score.
            combinedScores[style.name] = (combinedScores[style.name] || 0) + vote.score;
        }
    }
    // This part is incorrect for pair mode and needs a full refactor
    setScores(combinedScores);
    setStep(nextStepAfterPlayoff);
  }

  const handleDetailsFinish = (finishedDetailScores: Record<string, number>, outcome: DetailsRoundOutcome) => {
    // This is also not pair-mode compatible yet
    setDetailScores(finishedDetailScores);

    if (outcome === 'clear_result') {
        setStep("results");
    } else {
        const reason: PlayoffReason = outcome === 'all_liked' ? 'all_liked' : 'all_disliked';
        setPlayoffReason(reason);
        setNextStepAfterPlayoff("results");
        setStep("playoff-round");
    }
  }

  const handleMaterialSelectionFinish = () => {
    setStep("results");
  }

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    const finalScores = quizMode === 'single' ? scores as Record<string, number> : (scores as PairState<Record<string, number>>).user1;
    const finalDetailScores = quizMode === 'single' ? detailScores as Record<string, number> : (detailScores as PairState<Record<string, number>>).user1;

    doc.setFontSize(22);
    doc.text("Raport Twojego Stylu", 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text("Wygenerowano przez ARTSCore Quiz", 105, 30, { align: 'center' });

    // --- Page 1: Top Styles ---
    autoTable(doc, {
        head: [['Twoje Główne Style']],
        startY: 40,
        theme: 'plain',
        styles: { fontSize: 18 },
    });

    const sortedStyles = Object.entries(finalScores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

    const topStylesBody = sortedStyles.map(([name, score]) => {
        const styleData = allStyles.find(s => s.name === name);
        return [name, styleData?.description || 'Brak opisu.'];
    });

    autoTable(doc, {
        head: [['Styl', 'Opis']],
        body: topStylesBody,
        startY: (doc as any).lastAutoTable.finalY + 5,
    });

    // --- How to combine styles ---
    if (sortedStyles.length > 1) {
        autoTable(doc, {
            head: [['Jak łączyć style?']],
            startY: (doc as any).lastAutoTable.finalY + 15,
            theme: 'plain',
            styles: { fontSize: 14 },
        });
        const styleNames = sortedStyles.map(s => s[0]).join(' i ');
        const text = `Połączenie stylów ${styleNames} tworzy unikalne i osobiste wnętrze. Kluczem jest zasada 80/20 - wybierz jeden styl jako dominujący, a drugi użyj do akcentów. Szukaj wspólnych elementów, takich jak paleta kolorów lub materiały, aby stworzyć spójność.`;
        const splitText = doc.splitTextToSize(text, 180);
        doc.setFontSize(10);
        doc.text(splitText, 14, (doc as any).lastAutoTable.finalY + 5);
    }

    // --- Page 2: Details ---
    doc.addPage();
    autoTable(doc, {
        head: [['Twoje Wybory Detali i Materiałów']],
        startY: 20,
        theme: 'plain',
        styles: { fontSize: 18 },
    });

    const likedDetails = allDetails.filter(d => (finalDetailScores[d.id] || 0) > 0);
    const dislikedDetails = allDetails.filter(d => (finalDetailScores[d.id] || 0) < 0);

    if (likedDetails.length > 0) {
        autoTable(doc, {
            head: [['Polubione']],
            body: likedDetails.map(d => [d.name, d.category]),
            startY: (doc as any).lastAutoTable.finalY + 5,
            theme: 'striped',
            headStyles: { fillColor: [41, 128, 185] }
        });
    }

    if (dislikedDetails.length > 0) {
        autoTable(doc, {
            head: [['Odrzucone']],
            body: dislikedDetails.map(d => [d.name, d.category]),
            startY: (doc as any).lastAutoTable.finalY + 10,
            theme: 'striped',
            headStyles: { fillColor: [192, 57, 43] }
        });
    }

    doc.save("raport-stylu-artscore.pdf");
  }

  if (!styleQuiz || allStyles.length === 0) {
    return <div>Ładowanie quizu...</div>
  }

  const getWinningStyles = () => {
    const finalScores = quizMode === 'single' ? scores as Record<string, number> : (scores as PairState<Record<string, number>>)[currentUser];
    return Object.entries(finalScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name]) => allStyles.find(s => s.name === name))
      .filter((s): s is Style => s !== undefined);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4 text-center">{styleQuiz.title}</h1>

      {step === "mode-selection" && (
        <ModeSelection onSelectMode={handleModeSelection} />
      )}

      {step === "room-selection" && (
        <RoomSelection onNext={handleRoomSelectionNext} />
      )}

      {step === "style-swipe" && (
        <StyleSwipe
          onFinish={handleStyleSwipeFinish}
          quizId={styleQuiz.id}
          selectedRooms={selectedRooms}
        />
      )}

      {step === "narrow-down" && (
        <NarrowDownRound
          topStyles={quizMode === 'single' ? topStyles as Style[] : (topStyles as PairState<Style[]>)[currentUser]}
          onFinish={handleNarrowDownFinish}
          selectedRooms={selectedRooms}
        />
      )}

      {step === "playoff-round" && playoffReason && (
        <PlayoffRound
            reason={playoffReason}
            styles={allStyles}
            onFinish={handlePlayoffFinish}
        />
      )}

      {step === "material-selection" && (
        <MaterialSelection onFinish={handleMaterialSelectionFinish} />
      )}

      {step === "details-round" && (
        <DetailsRound
          winningStyles={getWinningStyles()}
          selectedRooms={selectedRooms}
          onFinish={handleDetailsFinish}
        />
      )}

      {step === "results" && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Wyniki</h2>
          <ul>
            {Object.entries(quizMode === 'single' ? scores as Record<string, number> : (scores as PairState<Record<string, number>>).user1).sort((a, b) => b[1] - a[1]).map(([style, score]) => (
              <li key={style}>{style}: {score}</li>
            ))}
          </ul>
          <Button onClick={handleDownloadPdf} className="mt-4">Pobierz PDF</Button>
        </div>
      )}
    </div>
  )
}
