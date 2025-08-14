"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Room } from '@prisma/client'

interface RoomSelectionProps {
  onComplete: (selectedRooms: string[]) => void
}

export function RoomSelection({ onComplete }: RoomSelectionProps) {
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
      onComplete(selectedRooms)
    }
  }

  if (loading) {
    return <div>Ładowanie pomieszczeń...</div>
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Wybierz pomieszczenia</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {rooms.map(room => (
          <div key={room.id} className="flex items-center space-x-2">
            <Checkbox
              id={room.id}
              checked={selectedRooms.includes(room.name)}
              onCheckedChange={() => handleSelectRoom(room.name)}
            />
            <label
              htmlFor={room.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {room.name}
            </label>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={selectedRooms.length === 0}>
          Rozpocznij Quiz
        </Button>
      </CardFooter>
    </Card>
  )
}
