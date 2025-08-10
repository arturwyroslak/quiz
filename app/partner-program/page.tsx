'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowDown, Check, Users, BarChart, Smartphone, Shield, FileText, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedElement } from '@/components/animations/animated-element';
import { fadeIn, fadeInUp, fadeInLeft, fadeInRight, zoomIn } from '@/components/animations/animation-variants';

export default function PartnerProgramPage() {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const features = [
    {
      icon: FileText,
      title: 'Szybkie zgłoszenia',
      description: 'Intuicyjny formularz zoptymalizowany pod urządzenia mobilne. Dodaj klienta w mniej niż 2 minuty.',
      points: ['Walidacja danych w czasie rzeczywistym', 'Możliwość dodawania notatek o kliencie', 'Automatyczne wysyłanie materiałów promocyjnych'],
    },
    {
      icon: BarChart,
      title: 'Śledzenie statusów',
      description: 'Pełna historia zmian statusów z datami i szczegółowymi informacjami o każdym etapie.',
      points: ['Powiadomienia o zmianach statusu', 'Historia wszystkich interakcji', 'Przewidywane terminy realizacji'],
    },
    {
      icon: Users,
      title: 'Zarządzanie zespołem',
      description: 'Twórz subkonta dla pracowników z kontrolą dostępu i monitorowaniem aktywności.',
      points: ['Indywidualne konta dla każdego pracownika', 'Kontrola uprawnień i dostępu', 'Statystyki wydajności zespołu'],
    },
    {
      icon: Smartphone,
      title: 'Dostęp mobilny',
      description: 'Responsywny interfejs dostosowany do wszystkich urządzeń mobilnych i tabletów.',
      points: ['Pełna funkcjonalność na telefonie', 'Szybkie dodawanie kontaktów w terenie', 'Synchronizacja między urządzeniami'],
    },
    {
      icon: Shield,
      title: 'Bezpieczeństwo',
      description: 'Pełna zgodność z RODO, szyfrowane połączenia i bezpieczne przechowywanie danych.',
      points: ['Szyfrowanie SSL/TLS', 'Zgodność z przepisami RODO', 'Regularne kopie zapasowe'],
    },
    {
      icon: Zap,
      title: 'Raporty i prowizje',
      description: 'Szczegółowe raporty prowizji z możliwością eksportu do CSV i XLSX.',
      points: ['Eksport do Excel i CSV', 'Automatyczne naliczanie prowizji', 'Analizy wydajności i trendów'],
    },
  ];

  const howItWorksSteps = [
    { icon: Zap, title: '1. Zarejestruj się', description: 'Utwórz darmowe konto partnerskie i uzyskaj dostęp do platformy' },
    { icon: Users, title: '2. Dodaj kontakty', description: 'Zgłaszaj potencjalnych klientów przez prosty formularz mobilny' },
    { icon: BarChart, title: '3. Śledź postępy', description: 'Monitoruj statusy zgłoszeń i otrzymuj aktualizacje w czasie rzeczywistym' },
    { icon: FileText, title: '4. Otrzymuj prowizje', description: 'Zarabiaj na każdym zrealizowanym zleceniu i pobieraj szczegółowe raporty' },
  ];

  return (
    <div className="min-h-screen bg-white font-body-regular">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-[#F0F0F0] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <div className="w-6 sm:w-8 lg:w-10 h-6 sm:h-8 lg:h-10 flex items-center justify-center">
                  <Image
                    src="/images/arts-logo.png"
                    alt="ARTSCore Logo"
                    width={40}
                    height={40}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="ml-1 sm:ml-2">
                  <h1 className="text-lg sm:text-xl lg:text-2xl uppercase text-[#2A2A2A] font-body-semibold">
                    ARTSCORE
                  </h1>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              <Link
                href="/"
                className="text-base font-body-medium text-[#2A2A2A] hover:text-[#b38a34] transition-colors duration-300"
              >
                Wróć do strony głównej
              </Link>
              
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  className="border-[#b38a34] text-[#b38a34] hover:bg-[#b38a34] hover:text-white px-4 py-2 text-sm rounded-xl font-body-semibold transition-all duration-300"
                >
                  <Link href="/partner-program/register">Zarejestruj się</Link>
                </Button>
                
                <Button className="bg-gradient-to-r from-[#b38a34] to-[#9a7529] hover:from-[#9a7529] hover:to-[#81621e] text-white px-4 py-2 text-sm rounded-xl font-body-semibold shadow-md hover:shadow-lg transition-all duration-300">
                  <Link href="/partner-program/login">Zaloguj się</Link>
                </Button>
              </div>
            </nav>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-[#2A2A2A] hover:text-[#b38a34] text-xs">
                <Link href="/">Strona główna</Link>
              </Button>
              <Button variant="outline" size="sm" className="border-[#b38a34] text-[#b38a34] hover:bg-[#b38a34] hover:text-white text-xs">
                <Link href="/partner-program/register">Rejestracja</Link>
              </Button>
              <Button size="sm" className="bg-[#b38a34] hover:bg-[#9a7529] text-white text-xs">
                <Link href="/partner-program/login">Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-12 py-16 sm:py-20 lg:py-24 overflow-hidden bg-gradient-to-br from-[#FEFCF8] via-white to-[#F8F4EF]">
        <div className="absolute inset-0">
          <Image
            src="/images/architectural-sketch-bg.jpg"
            alt="Architectural sketch background pattern"
            fill
            quality={75}
            className="object-cover opacity-[0.12]"
          />
          <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-20 sm:w-32 h-20 sm:h-32 bg-gradient-to-br from-[#b38a34]/10 to-transparent rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-32 sm:w-48 h-32 sm:h-48 bg-gradient-to-br from-[#9a7529]/10 to-transparent rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <AnimatedElement variants={fadeInUp}>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-body-semibold text-[#2A2A2A] mb-4">
              Zarządzaj swoimi poleceniami
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-[#666666] max-w-3xl mx-auto mb-8">
              Profesjonalna platforma dla partnerów ARTSCore. Zgłaszaj klientów, śledź statusy, zarządzaj zespołem i generuj raporty prowizji.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="w-full sm:w-auto bg-gradient-to-r from-[#b38a34] to-[#9a7529] hover:from-[#9a7529] hover:to-[#81621e] text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base rounded-xl font-body-semibold transition-all duration-300 hover:shadow-xl">
                <Link href="/partner-program/register">
                  <span>Rozpocznij teraz</span>
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button onClick={() => scrollTo('how-it-works')} variant="outline" className="w-full sm:w-auto border-[#b38a34] text-[#b38a34] hover:bg-[#b38a34]/10 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base rounded-xl font-body-semibold transition-all duration-300 hover:shadow-lg">
                <span>Dowiedz się więcej</span>
                <ArrowDown className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </AnimatedElement>
        </div>
      </section>

      {/* How it works Section */}
      <section id="how-it-works" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <AnimatedElement variants={fadeInUp}>
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-body-semibold text-[#2A2A2A] mb-4">
                Jak działa ARTSCore Portal?
              </h2>
              <p className="text-lg text-[#666666] max-w-3xl mx-auto">
                Prosty proces w 4 krokach, który pomoże Ci efektywnie zarządzać poleceniami i zwiększyć swoje prowizje.
              </p>
            </div>
          </AnimatedElement>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {howItWorksSteps.map((step, index) => (
              <AnimatedElement key={step.title} variants={fadeIn} className={`delay-${(index + 1) * 100}`}>
                <div className="p-6 border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 h-full">
                  <div className="flex justify-center items-center mb-4">
                    <div className="bg-gradient-to-br from-[#b38a34]/10 to-transparent p-4 rounded-full">
                      <step.icon className="w-8 h-8 text-[#b38a34]" />
                    </div>
                  </div>
                  <h3 className="text-lg font-body-semibold mb-2">{step.title}</h3>
                  <p className="text-[#666666]">{step.description}</p>
                </div>
              </AnimatedElement>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#F8F4EF] to-white">
        <div className="max-w-6xl mx-auto">
          <AnimatedElement variants={fadeInUp}>
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-body-semibold text-[#2A2A2A] mb-4">
                Kluczowe Funkcjonalności Portalu
              </h2>
            </div>
          </AnimatedElement>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <AnimatedElement key={feature.title} variants={zoomIn} className={`delay-${(index + 1) * 100}`}>
                <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                  <div className="flex items-center mb-4">
                    <div className="bg-gradient-to-br from-[#b38a34]/10 to-transparent p-3 rounded-full">
                      <feature.icon className="w-6 h-6 text-[#b38a34]" />
                    </div>
                    <h3 className="text-lg font-body-semibold ml-4">{feature.title}</h3>
                  </div>
                  <p className="text-[#666666] mb-4 flex-grow">{feature.description}</p>
                  <ul className="space-y-2 text-sm text-[#666666]">
                    {feature.points.map(point => (
                      <li key={point} className="flex items-start">
                        <Check className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedElement>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <AnimatedElement variants={fadeInUp}>
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-body-semibold mb-4">
                Dlaczego warto wybrać ARTSCore Portal?
              </h2>
            </div>
          </AnimatedElement>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedElement variants={fadeInLeft} className="delay-100">
              <div className="text-center">
                <div className="text-[#b38a34] text-4xl sm:text-5xl font-heading-thin mb-4">500+</div>
                <p className="text-lg font-body-medium">Zadowolonych partnerów</p>
              </div>
            </AnimatedElement>

            <AnimatedElement variants={fadeIn} className="delay-200">
              <div className="text-center">
                <div className="text-[#b38a34] text-4xl sm:text-5xl font-heading-thin mb-4">95%</div>
                <p className="text-lg font-body-medium">Skuteczność konwersji</p>
              </div>
            </AnimatedElement>

            <AnimatedElement variants={fadeInRight} className="delay-300">
              <div className="text-center">
                <div className="text-[#b38a34] text-4xl sm:text-5xl font-heading-thin mb-4">24/7</div>
                <p className="text-lg font-body-medium">Wsparcie techniczne</p>
              </div>
            </AnimatedElement>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#FEFCF8] via-white to-[#F8F4EF]">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedElement variants={fadeInUp}>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-body-semibold text-[#2A2A2A] mb-6">
              Gotowy, aby zacząć zarabiać?
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="w-full sm:w-auto bg-gradient-to-r from-[#b38a34] to-[#9a7529] hover:from-[#9a7529] hover:to-[#81621e] text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base rounded-xl font-body-semibold transition-all duration-300 hover:shadow-xl">
                <Link href="/partner-program/register">
                  <span>Zarejestruj się teraz</span>
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button asChild className="w-full sm:w-auto bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base rounded-xl font-body-semibold transition-all duration-300 hover:shadow-xl">
                <Link href="/partner-program/login">
                  <span>Zaloguj się do panelu</span>
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </AnimatedElement>
        </div>
      </section>

      {/* Footer - simplified version */}
      <footer className="bg-[#1A1A1A] text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-8 h-8 mr-2">
                <Image
                  src="/images/arts-logo.png"
                  alt="ARTSCore Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-lg uppercase font-body-semibold">ARTSCORE</span>
            </div>
            <div className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} ARTSCore. Wszelkie prawa zastrzeżone.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}