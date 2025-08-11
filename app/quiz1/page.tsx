"use client"

import { useState, useEffect } from "react"
import { RoomSelection } from "@/components/quiz/room-selection"
import { StyleSwipe } from "@/components/quiz/style-swipe"
import { Quiz } from '@prisma/client'
import jsPDF from 'jspdf'
import { Button } from "@/components/ui/button"

export default function Quiz1Page() {
  const [step, setStep] = useState("room-selection")
  const [selectedRooms, setSelectedRooms] = useState<string[]>([])
  const [scores, setScores] = useState<Record<string, number>>({})
  const [styleQuiz, setStyleQuiz] = useState<Quiz | null>(null)

  useEffect(() => {
    fetch('/api/quiz')
      .then(res => res.json())
      .then((quizzes: Quiz[]) => {
        const quiz = quizzes.find(q => q.type === 'STYLE')
        setStyleQuiz(quiz || null)
      })
  }, [])

  const handleRoomSelectionNext = (rooms: string[]) => {
    setSelectedRooms(rooms)
    setStep("style-swipe")
  }

  const handleStyleSwipeFinish = (finalScores: Record<string, number>) => {
    setScores(finalScores)
    setStep("results")
  }

  const handleDownloadPdf = () => {
    const doc = new jsPDF()

    doc.text("Wyniki Twojego Quizu Stylu", 20, 20);
    let y = 30;
    Object.entries(scores).forEach(([style, score]) => {
        doc.text(`${style}: ${score}`, 20, y);
        y += 10;
    });

    doc.save("wyniki-quizu-stylu.pdf");
  }

  if (!styleQuiz) {
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

      {step === "results" && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Wyniki</h2>
          <ul>
            {Object.entries(scores).map(([style, score]) => (
              <li key={style}>{style}: {score}</li>
            ))}
          </ul>
          <Button onClick={handleDownloadPdf} className="mt-4">Pobierz PDF</Button>
        </div>
      )}
    </div>
  )
}
