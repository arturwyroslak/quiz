"use client"

import { Button } from "@/components/ui/button"
import { Users, User } from "lucide-react"

export type QuizMode = 'single' | 'pair';

interface ModeSelectionProps {
  onSelectMode: (mode: QuizMode) => void;
}

export function ModeSelection({ onSelectMode }: ModeSelectionProps) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Jak będziesz przechodzić quiz?</h2>
      <p className="mb-8 text-gray-600">
        Wybierz, czy chcesz odkryć swój indywidualny styl, czy szukasz inspiracji wspólnie z partnerem lub partnerką. Quiz dla dwojga pomoże Wam znaleźć wspólny język projektowy.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button
          onClick={() => onSelectMode('single')}
          className="h-auto p-6"
          variant="outline"
        >
          <div className="flex flex-col items-center gap-2">
            <User className="h-8 w-8" />
            <span className="text-lg font-semibold">Dla jednej osoby</span>
            <span className="text-sm font-normal text-gray-500">Odkryj swój unikalny styl</span>
          </div>
        </Button>
        <Button
          onClick={() => onSelectMode('pair')}
          className="h-auto p-6"
          variant="outline"
        >
          <div className="flex flex-col items-center gap-2">
            <Users className="h-8 w-8" />
            <span className="text-lg font-semibold">Dla pary</span>
            <span className="text-sm font-normal text-gray-500">Znajdźcie wspólne inspiracje</span>
          </div>
        </Button>
      </div>
    </div>
  )
}
