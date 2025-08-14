"use client"

import { useState, useEffect } from "react"
import { FunctionalQuiz } from "@/components/quiz/functional-quiz"
import { RoomSelection } from "@/components/quiz/room-selection"
import { Quiz } from '@prisma/client'

export default function Quiz2Page() {
    const [functionalQuiz, setFunctionalQuiz] = useState<Quiz | null>(null)
    const [selectedRooms, setSelectedRooms] = useState<string[] | null>(null)

    useEffect(() => {
        fetch('/api/quiz')
        .then(res => res.json())
        .then((quizzes: Quiz[]) => {
            const quiz = quizzes.find(q => q.type === 'FUNCTIONAL')
            setFunctionalQuiz(quiz || null)
        })
    }, [])

    const handleRoomsSelected = (rooms: string[]) => {
        setSelectedRooms(rooms)
    }

    if (!functionalQuiz) {
        return <div>Ładowanie quizu...</div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 text-center">{functionalQuiz.title}</h1>
            <div className="max-w-2xl mx-auto">
                {!selectedRooms ? (
                    <RoomSelection onComplete={handleRoomsSelected} />
                ) : (
                    <FunctionalQuiz quizId={functionalQuiz.id} selectedRooms={selectedRooms} />
                )}
            </div>
        </div>
    )
}
