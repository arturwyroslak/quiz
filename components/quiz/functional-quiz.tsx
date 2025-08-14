"use client"

import { useState, useEffect, useCallback } from "react"
import { Question as PrismaQuestion } from "@prisma/client"
import { QuestionComponent } from "./question"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

interface FunctionalQuizProps {
    quizId: string;
    selectedRooms: string[];
    onComplete: () => void;
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


export function FunctionalQuiz({ quizId, selectedRooms, onComplete }: FunctionalQuizProps) {
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
            onComplete();
        }
    }

  }, [currentQuestionCode, allQuestions, answers, sessionId, questionQueue]);


  if (isLoading) {
      return <div>Ładowanie pytań...</div>
  }

  if (isComplete) {
    return (
      <Card className="w-full max-w-2xl mx-auto text-center p-8 border-gray-200/80 shadow-sm bg-white/80 backdrop-blur-sm">
        <CardHeader>
            <div className="mx-auto bg-gradient-to-br from-green-50 to-green-100 w-16 h-16 rounded-full flex items-center justify-center">
                <Check className="w-10 h-10 text-green-600" />
            </div>
            <CardTitle className="font-heading-semibold text-2xl mt-4">Quiz zakończony!</CardTitle>
            <CardDescription className="font-body-regular text-base text-gray-600">
                Dziękujemy za Twoje odpowiedzi. Pomogą nam one lepiej zrozumieć Twoje potrzeby funkcjonalne i przygotować idealne rozwiązania.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="max-w-md mx-auto bg-gray-50 dark:bg-gray-800 rounded-md p-4 my-4 border border-gray-200">
                 <h3 className="font-bold text-lg mb-2 font-heading-medium">Podsumowanie odpowiedzi</h3>
                 <pre className="text-left text-sm overflow-x-auto font-mono bg-white p-2 rounded">
                    {JSON.stringify(answers, null, 2)}
                 </pre>
            </div>
        </CardContent>
        <CardFooter className="flex justify-center">
            <Button onClick={() => window.location.reload()} size="lg" className="bg-gradient-to-r from-[#b38a34] to-[#9a7529] text-white">
                Wypełnij ponownie
            </Button>
        </CardFooter>
      </Card>
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
