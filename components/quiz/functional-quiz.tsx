"use client"

import { useState, useEffect, useCallback } from "react"
import { Question as QuestionType } from "@prisma/client"
import { QuestionComponent } from "./question"

interface FunctionalQuizProps {
    quizId: string;
    selectedRooms: string[];
}

// A more detailed Question type for the frontend
type ClientQuestion = QuestionType & {
    options?: any;
    branchingLogic?: {
        rules: {
            condition: {
                value: any;
                operator: 'eq' | 'neq' | 'gt' | 'lt' | 'contains';
            };
            action: 'JUMP';
            target: string; // questionCode of the target
        }[];
    };
};

export function FunctionalQuiz({ quizId, selectedRooms }: FunctionalQuizProps) {
  const [allQuestions, setAllQuestions] = useState<Record<string, ClientQuestion>>({})
  const [questionOrder, setQuestionOrder] = useState<string[]>([]);
  const [currentQuestionCode, setCurrentQuestionCode] = useState<string | null>(null)

  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [history, setHistory] = useState<string[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/quiz/questions?quizId=${quizId}`)
        .then(res => res.json())
        .then((data: ClientQuestion[]) => {
            const questionMap: Record<string, ClientQuestion> = {};
            data.forEach(q => {
                questionMap[q.questionCode] = q;
            });
            setAllQuestions(questionMap);

            const filteredOrder = data
                .filter(q => !q.tags.includes('follow-up'))
                .filter(q => q.relevantRooms.length === 0 || q.relevantRooms.some(room => selectedRooms.includes(room)))
                .map(q => q.questionCode)
                .sort(); // Simple sort for now, can be replaced with explicit order field

            setQuestionOrder(filteredOrder);
            setCurrentQuestionCode(filteredOrder[0] || null);
            setIsLoading(false);
        })

    fetch('/api/quiz/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizId }),
    })
        .then(res => res.json())
        .then(data => setSessionId(data.id))
  }, [quizId, selectedRooms])

  const getNextQuestionCode = useCallback((currentCode: string): string | null => {
    const currentIndex = questionOrder.indexOf(currentCode);
    if (currentIndex !== -1 && currentIndex < questionOrder.length - 1) {
        return questionOrder[currentIndex + 1];
    }
    return null;
  }, [questionOrder]);

  const evaluateCondition = (condition: any, answer: any): boolean => {
    const { value, operator } = condition;
    switch (operator) {
        case 'eq': return answer === value;
        case 'neq': return answer !== value;
        case 'gt': return Number(answer) > Number(value);
        case 'lt': return Number(answer) < Number(value);
        case 'contains': return Array.isArray(answer) && answer.includes(value);
        default: return false;
    }
  }

  const handleAnswer = useCallback((answer: any) => {
    if (!currentQuestionCode) return;

    const questionId = allQuestions[currentQuestionCode].id;
    const newAnswers = { ...answers, [currentQuestionCode]: answer }
    setAnswers(newAnswers)
    setHistory(prev => [...prev, currentQuestionCode]);

    if (sessionId) {
        fetch('/api/quiz/answer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId, questionId, value: answer }),
        })
    }

    const currentQuestion = allQuestions[currentQuestionCode];
    let nextQuestionCode: string | null = null;

    // Check branching logic
    if (currentQuestion.branchingLogic?.rules) {
        for (const rule of currentQuestion.branchingLogic.rules) {
            if (evaluateCondition(rule.condition, answer)) {
                nextQuestionCode = rule.target;
                break;
            }
        }
    }

    // If no branch taken, get next in sequence
    if (!nextQuestionCode) {
        nextQuestionCode = getNextQuestionCode(currentQuestionCode);
    }

    setCurrentQuestionCode(nextQuestionCode);

  }, [currentQuestionCode, allQuestions, answers, sessionId, getNextQuestionCode]);

  if (isLoading) {
      return <div>Ładowanie pytań...</div>
  }

  if (!currentQuestionCode) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Quiz zakończony!</h2>
        <p>Dziękujemy za odpowiedzi.</p>
        <pre className="mt-4 p-4 bg-gray-100 rounded-md text-sm">
          {JSON.stringify(answers, null, 2)}
        </pre>
      </div>
    )
  }

  const currentQuestion = allQuestions[currentQuestionCode];

  return (
    <QuestionComponent
      key={currentQuestion.id}
      question={currentQuestion}
      onAnswer={handleAnswer}
    />
  )
}
