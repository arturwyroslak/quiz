'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Share } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const UniversalInstallPrompt = () => {
  const { toast } = useToast();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if the app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsStandalone(true);
    }

    // Listen for the install prompt
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isStandalone) return;

    // If the native prompt is available, show it
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null); // Prompt can only be used once
      }
      return;
    }

    // If native prompt is not available, show manual instructions
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    toast({
      title: 'Zainstaluj aplikację',
      description: isIOS
        ? 'Naciśnij przycisk "Udostępnij", a następnie "Dodaj do ekranu głównego".'
        : 'Użyj opcji w menu przeglądarki, aby "Dodać do ekranu głównego".',
      duration: 8000,
    });
  };

  return (
    <Button
      onClick={handleInstallClick}
      disabled={isStandalone}
      className="bg-gradient-to-r from-[#D4AF37] to-[#b38a34] text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      <Download className="mr-2 h-4 w-4" />
      {isStandalone ? 'Zainstalowano' : 'Zainstaluj aplikację'}
    </Button>
  );
};

export default UniversalInstallPrompt;
