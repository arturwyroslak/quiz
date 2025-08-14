"use client"

import { Button } from "@/components/ui/button"
import { Users } from "lucide-react"

interface HandoverScreenProps {
  nextUser: string;
  onNextTurn: () => void;
}

export function HandoverScreen({ nextUser, onNextTurn }: HandoverScreenProps) {
  return (
    <div className="text-center max-w-2xl mx-auto p-8 border-dashed border-2 rounded-lg flex flex-col items-center">
      <Users className="h-16 w-16 mb-4 text-gray-400" />
      <h2 className="text-2xl font-bold mb-2">Kolej na Ciebie, {nextUser}!</h2>
      <p className="mb-6 text-gray-600">
        Przekaż urządzenie drugiej osobie, aby mogła ocenić ten zestaw inspiracji.
      </p>
      <Button onClick={onNextTurn} size="lg">
        Rozpocznij swoją turę
      </Button>
    </div>
  )
}
