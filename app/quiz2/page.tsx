"use client"

import { useState, useEffect } from "react"
import { FunctionalQuiz } from "@/components/quiz/functional-quiz"
import { RoomSelection } from "@/components/quiz/room-selection"
import { Quiz } from '@prisma/client'
import { Progress } from "@/components/ui/progress"

export default function Quiz2Page() {
    const [functionalQuiz, setFunctionalQuiz] = useState<Quiz | null>(null)
    const [selectedRooms, setSelectedRooms] = useState<string[] | null>(null)
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        fetch('/api/quiz')
        .then(res => res.json())
        .then((quizzes: Quiz[]) => {
            const quiz = quizzes.find(q => q.type === 'FUNCTIONAL')
            setFunctionalQuiz(quiz || null)
        })
    }, [])

    useEffect(() => {
        if (!selectedRooms) {
            setProgress(33); // Room selection is step 1 of 3
        } else {
            setProgress(66); // Functional quiz is step 2 of 3
        }
    }, [selectedRooms]);

    const handleRoomsSelected = (rooms: string[]) => {
        setSelectedRooms(rooms)
    }

    const handleQuizComplete = () => {
        setProgress(100);
    }

    if (!functionalQuiz) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <p className="text-lg text-gray-600">Ładowanie quizu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FEFCF8] via-white to-[#F8F4EF] font-body-regular text-[#2A2A2A]">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <header className="text-center mb-8">
                        <h1 className="text-3xl sm:text-4xl font-heading-semibold text-[#2A2A2A] mb-2">
                            {functionalQuiz.title}
                        </h1>
                        <p className="text-base sm:text-lg text-[#666666]">
                            {functionalQuiz.description}
                        </p>
                    </header>

                    <div className="mb-8">
                        <Progress value={progress} className="w-full" />
                        <p className="text-center text-sm text-[#666666] mt-2">Krok {selectedRooms ? 2: 1} z 2</p>
                    </div>

                    <main className="max-w-2xl mx-auto">
                        {!selectedRooms ? (
                            <RoomSelection onComplete={handleRoomsSelected} />
                        ) : (
                            <FunctionalQuiz
                                quizId={functionalQuiz.id}
                                selectedRooms={selectedRooms}
                                onComplete={handleQuizComplete}
                            />
                        )}
                    </main>
                </div>
            </div>
        </div>
    )
}
