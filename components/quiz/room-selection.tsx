"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Room } from '@prisma/client'
import { motion } from "framer-motion"

interface RoomSelectionProps {
  onComplete: (selectedRooms: string[]) => void
  // The 'onNext' prop is for quiz1, which uses a different name for the same function.
  // This is a temporary solution to support both quizzes with one component.
  onNext?: (selectedRooms: string[]) => void
}

export function RoomSelection({ onComplete, onNext }: RoomSelectionProps) {
  const [rooms, setRooms] = useState<Room[]>([])
  const [selectedRooms, setSelectedRooms] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/rooms')
      .then(res => res.json())
      .then((data: Room[]) => {
        setRooms(data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Failed to fetch rooms:", err)
        setLoading(false)
      })
  }, [])

  const handleSelectRoom = (roomName: string) => {
    setSelectedRooms(prev =>
      prev.includes(roomName)
        ? prev.filter(name => name !== roomName)
        : [...prev, roomName]
    )
  }

  const handleSubmit = () => {
    if (selectedRooms.length > 0) {
      if(onComplete) onComplete(selectedRooms)
      if(onNext) onNext(selectedRooms)
    }
  }

  if (loading) {
    return (
        <div className="text-center text-gray-500">
            <p>Ładowanie pomieszczeń...</p>
        </div>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto border-gray-200/80 shadow-sm bg-white/80 backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="font-heading-semibold text-2xl">Wybierz pomieszczenia</CardTitle>
        <CardDescription className="font-body-regular text-base text-gray-600">
          Zaznacz wszystkie przestrzenie, które chcesz z nami zaprojektować.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4 p-6">
        {rooms.map(room => (
          <motion.div
            key={room.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: Math.random() * 0.5 }}
            className="flex items-center"
          >
            <label
              htmlFor={room.id}
              className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 w-full ${
                selectedRooms.includes(room.name)
                  ? 'border-[#b38a34] bg-[#b38a34]/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Checkbox
                id={room.id}
                checked={selectedRooms.includes(room.name)}
                onCheckedChange={() => handleSelectRoom(room.name)}
                className="h-5 w-5 rounded data-[state=checked]:bg-[#b38a34] data-[state=checked]:border-[#b38a34]"
              />
              <span className="text-sm font-body-medium text-gray-800 select-none">
                {room.name}
              </span>
            </label>
          </motion.div>
        ))}
      </CardContent>
      <CardFooter className="flex justify-center p-6">
        <Button
          onClick={handleSubmit}
          disabled={selectedRooms.length === 0}
          size="lg"
          className="bg-gradient-to-r from-[#b38a34] to-[#9a7529] hover:from-[#9a7529] hover:to-[#81621e] text-white px-8 py-4 text-base rounded-xl font-body-semibold shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Rozpocznij Quiz
        </Button>
      </CardFooter>
    </Card>
  )
}
