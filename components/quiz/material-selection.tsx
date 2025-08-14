"use client"

import { Button } from "@/components/ui/button"

interface MaterialSelectionProps {
  onFinish: () => void;
}

export function MaterialSelection({ onFinish }: MaterialSelectionProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Pomóż nam doprecyzować Twój gust</h2>
      <p className="mb-8 text-gray-600">
        Wygląda na to, że trudno było wyłonić dominujący styl. Wybierz poniżej materiały lub kolory, które Ci się podobają, abyśmy mogli kontynuować.
      </p>
      <div className="p-8 border-dashed border-2 rounded-lg text-center text-gray-500">
        <p>W tym miejscu pojawi się siatka materiałów i kolorów do wyboru.</p>
        <p>(Komponent w budowie)</p>
      </div>
      <Button onClick={onFinish} className="mt-8">
        Kontynuuj (Tymczasowo)
      </Button>
    </div>
  )
}
