"use client"

import { useState, useEffect } from "react"
import { Question, QuestionComponent } from "./question"

interface FunctionalQuizProps {
    quizId: string;
}

export function FunctionalQuiz({ quizId }: FunctionalQuizProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/quiz/questions?quizId=${quizId}`)
        .then(res => res.json())
        .then(data => {
            setQuestions(data);
            // Find the first question that is not a follow-up
            const firstQuestion = data.find((q: any) => !q.id.includes('_followup'));
            setCurrentQuestion(firstQuestion || null);
        })

    fetch('/api/quiz/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizId }),
    })
        .then(res => res.json())
        .then(data => setSessionId(data.id))
  }, [quizId])

  const handleAnswer = (answer: any) => {
    if (!currentQuestion) return;

    const questionId = currentQuestion.id
    const newAnswers = { ...answers, [questionId]: answer }
    setAnswers(newAnswers)

    if (sessionId) {
        fetch('/api/quiz/answer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId, questionId, value: answer }),
        })
    }

    // Branching logic
    let nextQuestionId: string | null = null;
    if (currentQuestion.branchingLogic && (currentQuestion.branchingLogic as any)[answer]) {
        nextQuestionId = (currentQuestion.branchingLogic as any)[answer];
    }

    if (nextQuestionId) {
        const nextQuestion = questions.find(q => q.id === nextQuestionId);
        setCurrentQuestion(nextQuestion || null);
    } else {
        // Find next question in the main flow
        const currentIndex = questions.findIndex(q => q.id === currentQuestion.id);
        let nextQuestion = null;
        for (let i = currentIndex + 1; i < questions.length; i++) {
            if (!questions[i].id.includes('_followup')) {
                nextQuestion = questions[i];
                break;
            }
        }
        setCurrentQuestion(nextQuestion);
    }
  }

  if (questions.length === 0) {
      return <div>Ładowanie pytań...</div>
  }

  if (!currentQuestion) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Quiz zakończony!</h2>
        <p>Dziękujemy za odpowiedzi.</p>
      </div>
    )
  }

  return (
    <QuestionComponent
      question={currentQuestion}
      onAnswer={handleAnswer}
    />
  )
}
