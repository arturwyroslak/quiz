"use client"

import { useState, useEffect } from "react"
import { Question, QuestionComponent } from "./question"

interface FunctionalQuizProps {
    quizId: string;
}

export function FunctionalQuiz({ quizId }: FunctionalQuizProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/quiz/questions?quizId=${quizId}`)
        .then(res => res.json())
        .then(setQuestions)

    fetch('/api/quiz/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizId }),
    })
        .then(res => res.json())
        .then(data => setSessionId(data.id))
  }, [quizId])

  const handleAnswer = (answer: any) => {
    const questionId = questions[currentQuestionIndex].id
    const newAnswers = { ...answers, [questionId]: answer }
    setAnswers(newAnswers)

    if (sessionId) {
        fetch('/api/quiz/answer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId, questionId, value: answer }),
        })
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  if (questions.length === 0) {
      return <div>Ładowanie pytań...</div>
  }

  if (currentQuestionIndex >= questions.length) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Quiz zakończony!</h2>
        <p>Dziękujemy za odpowiedzi.</p>
      </div>
    )
  }

  return (
    <QuestionComponent
      question={questions[currentQuestionIndex]}
      onAnswer={handleAnswer}
    />
  )
}
