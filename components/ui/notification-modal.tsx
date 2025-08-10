"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle } from "lucide-react"

interface NotificationModalProps {
  show: boolean
  message: string
  onClose: () => void
}

export function NotificationModal({ show, message, onClose }: NotificationModalProps) {
  useEffect(() => {
    let timer: NodeJS.Timeout
    
    if (show) {
      // Auto-close after 3 seconds
      timer = setTimeout(() => {
        onClose()
      }, 3000)
    }
    
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [show, onClose])
  
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="fixed inset-0 bg-black/50" onClick={onClose} />
          <motion.div
            className="bg-card border border-border rounded-lg shadow-lg p-6 max-w-sm w-full mx-4 relative z-10"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-[#b38a34]/10 p-3 rounded-full mb-4">
                <CheckCircle className="h-8 w-8 text-[#b38a34]" />
              </div>
              <h3 className="text-xl font-heading-medium mb-2">Sukces!</h3>
              <p className="text-muted-foreground">{message}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 