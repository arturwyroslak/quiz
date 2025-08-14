"use client"

import { useState, useEffect } from "react"
import { RoomSelection } from "@/components/quiz/room-selection"
import { StyleSwipe } from "@/components/quiz/style-swipe"
import { NarrowDownRound } from "@/components/quiz/narrow-down-round"
import { DetailsRound } from "@/components/quiz/details-round"
import { Quiz, Style } from '@prisma/client'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Button } from "@/components/ui/button"

export default function Quiz1Page() {
  const [step, setStep] = useState("room-selection")
  const [selectedRooms, setSelectedRooms] = useState<string[]>([])
  const [scores, setScores] = useState<Record<string, number>>({})
  const [styleQuiz, setStyleQuiz] = useState<Quiz | null>(null)
  const [allStyles, setAllStyles] = useState<Style[]>([])
  const [topStyles, setTopStyles] = useState<Style[]>([])

  useEffect(() => {
    fetch('/api/quiz')
      .then(res => res.json())
      .then((quizzes: Quiz[]) => {
        const quiz = quizzes.find(q => q.type === 'STYLE')
        setStyleQuiz(quiz || null)
      })

    fetch('/api/quiz/styles')
      .then(res => res.json())
      .then(setAllStyles)
  }, [])

  const handleRoomSelectionNext = (rooms: string[]) => {
    setSelectedRooms(rooms)
    setStep("style-swipe")
  }

  const handleStyleSwipeFinish = (round1Scores: Record<string, number>) => {
    const sortedScores = Object.entries(round1Scores).sort((a, b) => b[1] - a[1]);
    const topStyleNames = sortedScores.slice(0, 5).map(entry => entry[0]);
    const topStylesData = allStyles.filter(style => topStyleNames.includes(style.name));

    setTopStyles(topStylesData);
    setScores(round1Scores);
    setStep("narrow-down");
  }

  const handleNarrowDownFinish = (round2Scores: Record<string, number>) => {
    const combinedScores = { ...scores };
    for (const [styleId, score] of Object.entries(round2Scores)) {
        const style = allStyles.find(s => s.id === styleId);
        if (style) {
            combinedScores[style.name] = (combinedScores[style.name] || 0) + score;
        }
    }
    setScores(combinedScores);
    setStep("details-round");
  }

  const handleDetailsFinish = (detailScores: Record<string, number>) => {
    console.log("Detail scores:", detailScores);
    setStep("results");
  }

  const handleDownloadPdf = () => {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text("Raport Twojego Stylu", 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text("Wygenerowano przez ARTSCore Quiz", 105, 30, { align: 'center' });

    doc.addPage();

    doc.setFontSize(18);
    doc.text("Twoje Główne Style", 14, 22);

    const sortedStyles = Object.entries(scores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

    const body = sortedStyles.map(([name, score]) => {
        const styleData = allStyles.find(s => s.name === name);
        return [name, score.toString(), styleData?.description || 'Brak opisu.'];
    });

    autoTable(doc, {
        head: [['Styl', 'Wynik', 'Opis']],
        body: body,
        startY: 30,
    });

    doc.addPage();
    doc.setFontSize(18);
    doc.text("Polubione Detale i Materiały", 14, 22);
    doc.setFontSize(12);
    doc.text("Ta sekcja zostanie wypełniona po zaimplementowaniu śledzenia polubionych detali.", 14, 30);

    doc.save("raport-stylu-artscore.pdf");
  }

  if (!styleQuiz || allStyles.length === 0) {
    return <div>Ładowanie quizu...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4 text-center">{styleQuiz.title}</h1>

      {step === "room-selection" && (
        <RoomSelection onNext={handleRoomSelectionNext} />
      )}

      {step === "style-swipe" && (
        <StyleSwipe onFinish={handleStyleSwipeFinish} quizId={styleQuiz.id} />
      )}

      {step === "narrow-down" && (
        <NarrowDownRound topStyles={topStyles} onFinish={handleNarrowDownFinish} />
      )}

      {step === "details-round" && (
        <DetailsRound onFinish={handleDetailsFinish} />
      )}

      {step === "results" && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Wyniki</h2>
          <ul>
            {Object.entries(scores).sort((a, b) => b[1] - a[1]).map(([style, score]) => (
              <li key={style}>{style}: {score}</li>
            ))}
          </ul>
          <Button onClick={handleDownloadPdf} className="mt-4">Pobierz PDF</Button>
        </div>
      )}
    </div>
  )
}
