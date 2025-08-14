"use client"

import { useState, useEffect, useCallback } from "react"
import { Question as PrismaQuestion } from "@prisma/client"
import { QuestionComponent } from "./question"
import { Button } from "@/components/ui/button"

interface FunctionalQuizProps {
    quizId: string;
    selectedRooms: string[];
}

type ClientQuestion = Omit<PrismaQuestion, 'tags' | 'relevantRooms'> & {
    tags: string[];
    relevantRooms: string[];
    options?: any;
    branchingLogic?: BranchingLogic;
};

interface BranchingRule {
    condition: {
        operator: 'equals' | 'notEquals' | 'greaterThan' | 'lessThan' | 'contains' | 'forEach';
        value?: any;
    };
    action: {
        type: 'INSERT_NEXT' | 'JUMP';
        target: string;
    };
}

interface BranchingLogic {
    rules: BranchingRule[];
}

// Helper function for state inference
// Replaces placeholders like {answers.question_code} with the actual answer
const interpolateText = (text: string, answers: Record<string, any>): string => {
    return text.replace(/\{answers\.([a-zA-Z0-9_]+)\}/g, (match, questionCode) => {
        return answers[questionCode] || match; // If answer not found, return the original placeholder
    });
};


export function FunctionalQuiz({ quizId, selectedRooms }: FunctionalQuizProps) {
  const [allQuestions, setAllQuestions] = useState<Record<string, ClientQuestion>>({})
  const [questionQueue, setQuestionQueue] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [currentQuestionCode, setCurrentQuestionCode] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    fetch('/api/quiz/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizId }),
    })
        .then(res => res.json())
        .then(data => setSessionId(data.id));

    fetch(`/api/quiz/questions?quizId=${quizId}`)
        .then(res => res.json())
        .then((data: ClientQuestion[]) => {
            const questionMap: Record<string, ClientQuestion> = {};
            data.forEach(q => {
                questionMap[q.questionCode] = q;
            });
            setAllQuestions(questionMap);

            const initialQueue = data
                .filter(q => !q.tags.includes('follow-up'))
                .filter(q => q.relevantRooms.length === 0 || q.relevantRooms.some(room => selectedRooms.includes(room)))
                .map(q => q.questionCode);

            setQuestionQueue(initialQueue);
            setCurrentQuestionCode(initialQueue[0] || null);
            setIsLoading(false);
        })
        .catch(err => {
            console.error("Failed to load questions:", err);
            setIsLoading(false);
        });

  }, [quizId, selectedRooms]);

  const evaluateCondition = (operator: BranchingRule['condition']['operator'], ruleValue: any, answer: any): boolean => {
      switch (operator) {
          case 'equals': return answer === ruleValue;
          case 'notEquals': return answer !== ruleValue;
          case 'greaterThan': return Number(answer) > Number(ruleValue);
          case 'lessThan': return Number(answer) < Number(ruleValue);
          case 'contains': return Array.isArray(answer) && answer.includes(ruleValue);
          case 'forEach': return Array.isArray(answer) && answer.length > 0;
          default: return false;
      }
  }

  const handleAnswer = useCallback((answer: any) => {
    if (!currentQuestionCode || !sessionId) return;

    const question = allQuestions[currentQuestionCode];
    const questionId = question.id;

    const newAnswers = { ...answers, [currentQuestionCode]: answer };
    setAnswers(newAnswers);

    fetch('/api/quiz/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, questionId, value: answer }),
    });

    let nextQueue = [...questionQueue];
    let jumped = false;

    if (question.branchingLogic && question.branchingLogic.rules) {
        const rules = question.branchingLogic.rules;
        let followUps: string[] = [];

        for (const rule of rules) {
            if (evaluateCondition(rule.condition.operator, rule.condition.value, answer)) {
                if (rule.action.type === 'JUMP') {
                    const jumpIndex = nextQueue.indexOf(rule.action.target);
                    if (jumpIndex > -1) {
                         nextQueue = nextQueue.slice(jumpIndex);
                         jumped = true;
                         break;
                    }
                } else if (rule.action.type === 'INSERT_NEXT') {
                    if (rule.condition.operator === 'forEach' && Array.isArray(answer)) {
                        answer.forEach(option => {
                            const target = rule.action.target.replace('{option}', option);
                            if (allQuestions[target]) {
                                followUps.push(target);
                            }
                        });
                    } else {
                        if (allQuestions[rule.action.target]) {
                           followUps.push(rule.action.target);
                        }
                    }
                }
            }
        }
        if (followUps.length > 0) {
            const uniqueFollowUps = [...new Set(followUps)];
            nextQueue.splice(1, 0, ...uniqueFollowUps);
        }
    }

    if (jumped) {
        setQuestionQueue(nextQueue);
        setCurrentQuestionCode(nextQueue[0] || null);
    } else {
        if (nextQueue.length > 1) {
            const finalQueue = nextQueue.slice(1);
            setQuestionQueue(finalQueue);
            setCurrentQuestionCode(finalQueue[0]);
        } else {
            setQuestionQueue([]);
            setCurrentQuestionCode(null);
            setIsComplete(true);
        }
    }

  }, [currentQuestionCode, allQuestions, answers, sessionId, questionQueue]);


  if (isLoading) {
      return <div>Ładowanie pytań...</div>
  }

  if (isComplete) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Quiz zakończony!</h2>
        <p className="mb-6">Dziękujemy za Twoje odpowiedzi. Pomogą nam one lepiej zrozumieć Twoje potrzeby.</p>
        <div className="max-w-md mx-auto bg-gray-100 dark:bg-gray-800 rounded-md p-4 my-4">
             <h3 className="font-bold text-lg mb-2">Podsumowanie odpowiedzi</h3>
             <pre className="text-left text-sm overflow-x-auto">
                {JSON.stringify(answers, null, 2)}
             </pre>
        </div>
        <Button onClick={() => window.location.reload()}>Zacznij od nowa</Button>
      </div>
    )
  }

  const currentQuestion = currentQuestionCode ? allQuestions[currentQuestionCode] : null;

  if (!currentQuestion) {
      return <div>Brak pytań do wyświetlenia. Możliwe, że quiz został już ukończony.</div>;
  }

  // Create a temporary question object with interpolated text
  const interpolatedQuestion = {
      ...currentQuestion,
      text: interpolateText(currentQuestion.text, answers),
      description: currentQuestion.description ? interpolateText(currentQuestion.description, answers) : null,
  };

  return (
    <QuestionComponent
      key={interpolatedQuestion.id}
      question={interpolatedQuestion}
      onAnswer={handleAnswer}
    />
  )
}
