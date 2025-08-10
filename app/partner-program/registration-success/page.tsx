"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedElement } from '@/components/animations/animated-element';
import { fadeIn, fadeInUp } from '@/components/animations/animation-variants';
import UniversalInstallPrompt from '@/components/pwa/universal-install-prompt';

export default function RegistrationSuccessPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] font-body-regular text-[#2A2A2A]">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-[#F0F0F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center">
              <div className="w-8 lg:w-10 h-8 lg:h-10 flex items-center justify-center">
                <Image
                  src="/images/arts-logo.png"
                  alt="ARTSCore Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="ml-2">
                <h1 className="text-xl lg:text-2xl uppercase text-[#2A2A2A] font-body-semibold">
                  ARTSCORE
                </h1>
              </div>
            </Link>
            <Link href="/partner-program" className="flex items-center text-sm text-[#666666] hover:text-[#b38a34] transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Powrót do strony programu
            </Link>
          </div>
        </div>
      </header>

      <main className="py-16 sm:py-24">
        <div className="max-w-md mx-auto px-4">
          <AnimatedElement variants={fadeInUp} className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <h1 className="font-display-bold text-4xl sm:text-5xl text-[#2A2A2A] mb-4">
              Rejestracja zakończona!
            </h1>
            <p className="text-lg text-[#666666]">
              Dziękujemy za dołączenie do Programu Partnerskiego ARTSCORE
            </p>
          </AnimatedElement>

          <AnimatedElement variants={fadeIn} className="bg-white p-8 sm:p-12 rounded-2xl shadow-lg border border-[#F0F0F0]">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-[#b38a34]/10 rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8 text-[#b38a34]" />
                </div>
              </div>
              
              <div className="space-y-4">
                <h2 className="font-display-semibold text-2xl text-[#2A2A2A]">
                  Sprawdź swoją skrzynkę e-mail
                </h2>
                <p className="text-[#666666] leading-relaxed">
                  Twoje zgłoszenie zostało przyjęte i oczekuje na weryfikację. 
                  Otrzymasz wiadomość e-mail z potwierdzeniem i dalszymi instrukcjami.
                </p>
              </div>
              
              <div className="space-y-3 pt-4">
                <Button 
                  asChild 
                  className="w-full bg-[#b38a34] hover:bg-[#9a7429] text-white font-body-semibold py-3 rounded-xl transition-all duration-200"
                >
                  <Link href="/partner-program/login">
                    Przejdź do logowania
                  </Link>
                </Button>
                
                <Button 
                  variant="outline" 
                  asChild
                  className="w-full border-[#E0E0E0] text-[#666666] hover:bg-[#F8F8F8] font-body-medium py-3 rounded-xl transition-all duration-200"
                >
                  <Link href="/partner-program">
                    Wróć do strony programu partnerskiego
                  </Link>
                </Button>
              </div>
            </div>
          </AnimatedElement>

          <div className="mt-8 flex justify-center">
            <UniversalInstallPrompt />
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-[#F0F0F0] mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-[#999999]">
            &copy; {new Date().getFullYear()} ARTSCORE. Wszelkie prawa zastrzeżone.
          </div>
        </div>
      </footer>
    </div>
  );
}