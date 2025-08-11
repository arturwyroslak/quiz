"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const rooms = [
  "Salon", "Kuchnia", "Jadalnia", "Sypialnia główna", "Sypialnia dziecięca",
  "Sypialnia gościnna", "Pokój nastolatka", "Garderoba", "Gabinet/biuro domowe",
  "Pokój do nauki/pracownia", "Biblioteka/pokój do czytania", "Pokój multimedialny/home cinema",
  "Pokój hobby", "Pokój fitness/siłownia domowa", "Łazienka główna", "Toaleta osobna",
  "Łazienka dziecięca", "Pokój kąpielowy/spa domowe", "Pralnia/suszarnia", "Przedpokój/hol",
  "Korytarz", "Wiatrołap", "Spiżarnia", "Schowek/gospodarczy", "Kotłownia/ pom. techniczne",
  "Balkon", "Taras", "Ogród zimowy", "Patio", "Garaż", "Garaż gym", "Carport"
]

interface RoomSelectionProps {
  onNext: (selectedRooms: string[]) => void
}

export function RoomSelection({ onNext }: RoomSelectionProps) {
  const [selectedRooms, setSelectedRooms] = useState<string[]>([])

  const handleRoomToggle = (room: string) => {
    setSelectedRooms((prev) =>
      prev.includes(room) ? prev.filter((r) => r !== room) : [...prev, room]
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Wybierz pomieszczenia</h2>
      <p className="mb-8 text-gray-600">Zaznacz wszystkie pomieszczenia, które chcesz zaprojektować. Na tej podstawie dobierzemy odpowiednie inspiracje.</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {rooms.map((room) => (
          <div key={room} className="flex items-center space-x-2">
            <Checkbox
              id={room}
              checked={selectedRooms.includes(room)}
              onCheckedChange={() => handleRoomToggle(room)}
            />
            <Label htmlFor={room} className="cursor-pointer">{room}</Label>
          </div>
        ))}
      </div>
      <Button onClick={() => onNext(selectedRooms)} disabled={selectedRooms.length === 0}>
        Dalej
      </Button>
    </div>
  )
}
