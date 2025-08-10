'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import UniversalInstallPrompt from './universal-install-prompt';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InstallModal = ({ isOpen, onClose }: InstallModalProps) => {
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      // Close the modal after 5 seconds
      timer = setTimeout(() => {
        onClose();
      }, 5000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [isOpen, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Zainstaluj Aplikację</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-center text-muted-foreground mb-4">
            Dodaj naszą aplikację do ekranu głównego, aby mieć do niej szybszy dostęp!
          </p>
          <div className="flex justify-center">
            <UniversalInstallPrompt />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InstallModal;
