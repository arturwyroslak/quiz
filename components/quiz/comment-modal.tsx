"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Mic } from "lucide-react"

export type CommentSentiment = "positive" | "negative" | "neutral"

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (comment: string, sentiment: CommentSentiment) => void;
}

export function CommentModal({ isOpen, onClose, onSave }: CommentModalProps) {
  const [comment, setComment] = useState("")
  const [sentiment, setSentiment] = useState<CommentSentiment>("neutral")

  const handleSave = () => {
    if (comment || sentiment !== 'neutral') {
        onSave(comment, sentiment)
        setComment("")
        setSentiment("neutral")
        onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dodaj komentarz</DialogTitle>
          <DialogDescription>
            Opisz co Ci się podoba lub nie podoba na tym zdjęciu. Możesz też ocenić ogólne wrażenie.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Wpisz swój komentarz... (opcjonalne)"
        />
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
                <label className="text-sm font-medium mb-2 block">Jakie jest Twoje wrażenie?</label>
                <ToggleGroup type="single" value={sentiment} onValueChange={(value: CommentSentiment) => value && setSentiment(value)}>
                    <ToggleGroupItem value="positive" aria-label="Positive sentiment">Pozytywne</ToggleGroupItem>
                    <ToggleGroupItem value="negative" aria-label="Negative sentiment">Negatywne</ToggleGroupItem>
                </ToggleGroup>
            </div>
            <Button variant="outline" disabled>
                <Mic className="mr-2 h-4 w-4" />
                Nagraj głosowo (wkrótce)
            </Button>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="ghost">Anuluj</Button>
          <Button onClick={handleSave} disabled={!comment && sentiment === 'neutral'}>Zapisz</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
