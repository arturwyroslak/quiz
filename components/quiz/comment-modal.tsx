"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (comment: string) => void;
}

export function CommentModal({ isOpen, onClose, onSave }: CommentModalProps) {
  const [comment, setComment] = useState("")

  const handleSave = () => {
    onSave(comment)
    setComment("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dodaj komentarz</DialogTitle>
        </DialogHeader>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Wpisz swój komentarz..."
        />
        <DialogFooter>
          <Button onClick={handleSave} disabled={!comment}>Zapisz</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
