"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Plus,
  Minus,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Sparkles,
  TrendingUp,
  DollarSign,
  Home,
  Zap,
  Target,
  CheckCircle,
  Palette,
  Users,
  Building,
  Handshake,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Menu,
  X,
  Send,
  Play,
} from "lucide-react"
import { useState, useEffect } from "react"
import ContactSection from "@/components/contact-section"
import { AnimatedElement } from "@/components/animations/animated-element"
import Script from "next/script"
import {
  fadeIn,
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  fadeInScale,
  zoomIn,
  rotateIn,
  flipIn,
  staggerContainer,
  fastStaggerContainer,
  slowStaggerContainer,
  staggerItemFade,
  staggerItemUp,
  staggerItemScale,
  staggerItemLeft,
  staggerItemRight,
  staggerItemRotate,
  staggerItemFlip,
  listItemAnimation,
  cardAnimation,
  heroTextAnimation,
  heroImageAnimation
} from "@/components/animations/animation-variants"

export default function Component() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [privacyPolicyOpen, setPrivacyPolicyOpen] = useState(false)
  
  useEffect(() => {
    // Initialize Pannellum when component mounts
    if (typeof window !== 'undefined') {
      // Use setTimeout to ensure the script is loaded
      const timer = setTimeout(() => {
        if (window && (window as any).pannellum) {
          (window as any).pannellum.viewer('panorama-viewer', {
            type: 'equirectangular',
            panorama: '/images/panorama.jpg',
            autoLoad: true,
            autoRotate: 3,
            compass: false,
            showControls: false,
            showFullscreenCtrl: false,
            showZoomCtrl: false,
            mouseZoom: false,
            draggable: false,
            disableKeyboardCtrl: true,
            hfov: 90, // Narrower field of view for less distortion
            pitch: -5, // Adjusted vertical position
            yaw: 0,
            horizonPitch: 0, // Straighten horizon
            horizonRoll: 0, // Straighten horizon
            minHfov: 90, // Keep consistent view
            maxHfov: 90 // Keep consistent view
          });
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    // Add event listener for openPrivacyPolicy event from contact form
    const handleOpenPrivacyPolicy = () => {
      setPrivacyPolicyOpen(true);
    };

    document.addEventListener('openPrivacyPolicy', handleOpenPrivacyPolicy);

    // Clean up the event listener
    return () => {
      document.removeEventListener('openPrivacyPolicy', handleOpenPrivacyPolicy);
    };
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const togglePrivacyPolicy = () => {
    setPrivacyPolicyOpen(!privacyPolicyOpen)
  }

  return (
    <div className="min-h-screen bg-white font-body-regular">
      {/* Pannellum script */}
      <Script 
        src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js"
        strategy="beforeInteractive"
      />
      <link 
        rel="stylesheet" 
        href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css"
      />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-[#F0F0F0] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center">
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
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {[
                { name: "O firmie", href: "#what-we-create" },
                { name: "Oferta", href: "#services" },
                { name: "Program partnerski", href: "#partnership" },
                { name: "Kontakt", href: "#contact" },
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-[#2A2A2A] text-base font-body-medium hover:text-[#b38a34] transition-colors duration-300"
                >
                  {item.name}
                </a>
              ))}
              <Button className="bg-gradient-to-r from-[#b38a34] to-[#9a7529] hover:from-[#9a7529] hover:to-[#81621e] text-white px-4 py-2 text-sm rounded-xl font-body-semibold shadow-md hover:shadow-lg transition-all duration-300">
                <a href="#contact">Umów konsultację</a>
              </Button>
            </nav>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 text-[#2A2A2A] hover:text-[#b38a34] transition-colors duration-300"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden bg-white border-t border-[#F0F0F0] px-4 sm:px-6 py-4">
              <nav className="flex flex-col space-y-4">
                {[
                  { name: "O firmie", href: "#what-we-create" },
                  { name: "Oferta", href: "#services" },
                  { name: "Program partnerski", href: "#partnership" },
                  { name: "Kontakt", href: "#contact" },
                ].map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[#2A2A2A] text-base font-body-medium hover:text-[#b38a34] transition-colors duration-300 py-2"
                  >
                    {item.name}
                  </a>
                ))}
                <Button 
                  className="bg-gradient-to-r from-[#b38a34] to-[#9a7529] hover:from-[#9a7529] hover:to-[#81621e] text-white px-4 py-3 text-sm rounded-xl font-body-semibold shadow-md hover:shadow-lg transition-all duration-300 mt-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <a href="#contact">Umów konsultację</a>
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section - Light gradient background */}
      <section className="relative px-4 sm:px-6 lg:px-12 py-12 sm:py-16 lg:py-20 xl:py-32 overflow-hidden bg-gradient-to-br from-[#FEFCF8] via-white to-[#F8F4EF]">
        <div className="absolute inset-0">
          <Image
            src="/images/architectural-sketch-bg.jpg"
            alt="Architectural sketch background pattern"
            fill
            quality={75}
            className="object-cover opacity-[0.12]" // Adjusted opacity
          />
          {/* Floating Elements */}
          <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-20 sm:w-32 h-20 sm:h-32 bg-gradient-to-br from-[#b38a34]/10 to-transparent rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-32 sm:w-48 h-32 sm:h-48 bg-gradient-to-br from-[#9a7529]/10 to-transparent rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-6xl mx-auto text-center z-10">
          {" "}
          {/* Ensure content is above background */}
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-heading-thin text-[#2A2A2A] mb-6 sm:mb-8 lg:mb-10 leading-tight text-balance animate-fade-in px-2">
            Wnętrza, które{" "}
            <span className="text-transparent bg-gradient-to-r from-[#b38a34] to-[#9a7529] bg-clip-text italic font-heading-medium">
              sprzedają
            </span>{" "}
            Twoje inwestycje
          </h1>
          <p className="text-[#666666] text-sm sm:text-base lg:text-lg xl:text-xl mb-8 sm:mb-10 lg:mb-12 xl:mb-14 max-w-4xl mx-auto leading-relaxed lg:leading-luxury-relaxed font-body-regular px-4">
            Zwiększ atrakcyjność swoich mieszkań i domów dzięki profesjonalnym wizualizacjom
            <br className="hidden sm:block" />i kompleksowej usłudze projektowania wnętrz.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 justify-center items-center px-4">
            <Button className="w-full sm:w-auto bg-gradient-to-r from-[#b38a34] to-[#9a7529] hover:from-[#9a7529] hover:to-[#81621e] text-white px-6 sm:px-8 lg:px-12 py-3 sm:py-4 lg:py-5 text-sm sm:text-base lg:text-lg rounded-2xl font-body-semibold transition-all duration-500 hover:shadow-2xl hover:scale-105 group">
              <a href="#contact" className="flex items-center">
                <span className="hidden sm:inline">Odkryj, jak możemy zwiększyć Twoją sprzedaż</span>
                <span className="sm:hidden">Odkryj nasze możliwości</span>
                <ArrowRight className="ml-2 sm:ml-3 w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto border-2 border-[#E8E8E8] hover:border-[#b38a34] text-[#2A2A2A] hover:text-[#b38a34] px-6 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 text-sm sm:text-base lg:text-lg rounded-2xl font-body-medium transition-all duration-300 hover:shadow-lg bg-white/80 backdrop-blur-sm"
            >
              <a href="#contact">Skontaktuj się z nami</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Statistics Section - Dark background like in the image */}
      <section className="bg-[#1A1A1A] py-12 sm:py-16 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/texture-overlay.png" alt="Texture overlay" fill className="object-cover opacity-5" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <AnimatedElement variants={staggerContainer}>
            <div className="flex flex-col sm:flex-row justify-center items-center py-4 space-y-6 sm:space-y-0">
              <AnimatedElement variants={staggerItemRotate} className="w-full sm:w-1/3 flex flex-col sm:flex-row justify-center items-center px-2 sm:px-4">
                <div className="text-[#b38a34] text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-heading-thin leading-none mb-2 sm:mb-0 sm:mr-4">
                  +10%
                </div>
                <div className="text-white text-sm sm:text-xs md:text-sm uppercase tracking-wide text-center sm:text-left">
                  <span className="sm:hidden">WYŻSZA CENA SPRZEDAŻY</span>
                  <span className="hidden sm:block">WYŻSZA CENA<br />SPRZEDAŻY</span>
                </div>
              </AnimatedElement>
              
              <AnimatedElement variants={staggerItemScale} className="w-full sm:w-1/3 flex flex-col sm:flex-row justify-center items-center px-2 sm:px-4">
                <div className="text-[#b38a34] text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-heading-thin leading-none mb-2 sm:mb-0 sm:mr-4">
                  -30%
                </div>
                <div className="text-white text-sm sm:text-xs md:text-sm uppercase tracking-wide text-center sm:text-left">
                  <span className="sm:hidden">SZYBSZA SPRZEDAŻ</span>
                  <span className="hidden sm:block">SZYBSZA<br />SPRZEDAŻ</span>
                </div>
              </AnimatedElement>
              
              <AnimatedElement variants={staggerItemFlip} className="w-full sm:w-1/3 flex flex-col sm:flex-row justify-center items-center px-2 sm:px-4">
                <div className="text-[#b38a34] text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-heading-thin leading-none mb-2 sm:mb-0 sm:mr-4">
                  +40%
                </div>
                <div className="text-white text-sm sm:text-xs md:text-sm uppercase tracking-wide text-center sm:text-left">
                  <span className="sm:hidden">WIĘCEJ ZAPYTAŃ OFERTOWYCH</span>
                  <span className="hidden sm:block">WIĘCEJ ZAPYTAŃ<br />OFERTOWYCH</span>
                </div>
              </AnimatedElement>
            </div>
          </AnimatedElement>
        </div>
      </section>

      {/* Enhanced Features Section - Warm light background */}
      <section
        id="what-we-create"
        className="py-12 sm:py-16 lg:py-20 xl:py-32 px-4 sm:px-6 lg:px-12 bg-gradient-to-br from-[#FDF9F3] via-[#F8F4EF] to-[#F5F0E8]"
      >
        <div className="max-w-6xl mx-auto">
          <AnimatedElement variants={fadeInUp}>
            <div className="text-center mb-12 sm:mb-16 lg:mb-24">
              <div className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full mb-6 sm:mb-8 border border-[#E8E8E8]/30">
                <span className="text-[#b38a34] text-xs sm:text-sm font-body-bold tracking-wide sm:tracking-luxury-wide uppercase">
                  CZY TWOJE INWESTYCJE
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading-thin text-[#2A2A2A] mb-4 sm:mb-6 lg:mb-8 leading-snug lg:leading-normal text-balance">
                W pełni wykorzystują swój potencjał sprzedażowy?
              </h2>
              <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-[#b38a34] to-[#9a7529] mx-auto rounded-full"></div>
            </div>
          </AnimatedElement>

          <AnimatedElement variants={staggerContainer}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 items-stretch">
              {[
                {
                  title: "Długi cykl sprzedaży?",
                  description:
                    "Puste mieszkania i domy bez atrakcyjnej wizualizacji trudno wzbudzają emocje u kupujących, przez co decyzje o zakupie się odwlekają, a sprzedaż trwa dłużej.",
                  icon: <TrendingUp className="w-6 sm:w-7 lg:w-8 h-6 sm:h-7 lg:h-8" />,
                },
                {
                  title: "Presja cenowa ze strony konkurencji?",
                  description:
                    "Bez wyraźnego wyróżnienia, Twoje nieruchomości konkurują wyłącznie ceną, zmniejszając marże i ogólną rentowność.",
                  icon: <DollarSign className="w-6 sm:w-7 lg:w-8 h-6 sm:h-7 lg:h-8" />,
                },
                {
                  title: "Trudność w pokazaniu potencjału 'surowych' lokali?",
                  description:
                    "Kupujący mają problem z wyobrażeniem sobie potencjału pustych przestrzeni, co utrudnia przekazanie wartości i uzasadnienie wyższej ceny.",
                  icon: <Home className="w-6 sm:w-7 lg:w-8 h-6 sm:h-7 lg:h-8" />,
                },
              ].map((feature, index) => (
                <AnimatedElement key={index} variants={staggerItemUp} className="group">
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-[#F0F0F0] hover:border-[#b38a34]/20 h-full flex flex-col">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#b38a34]/5 to-transparent rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className="relative flex-1 flex flex-col">
                      <div className="w-14 sm:w-16 lg:w-20 h-14 sm:h-16 lg:h-20 bg-gradient-to-br from-[#F8F4EF] to-[#F0EBE0] rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 lg:mb-8 group-hover:scale-110 transition-transform duration-300">
                        <div className="text-xl sm:text-2xl lg:text-3xl">{feature.icon}</div>
                      </div>

                      <h3 className="text-base sm:text-lg lg:text-xl font-heading-medium text-[#2A2A2A] mb-3 sm:mb-4 lg:mb-6 text-center leading-tight px-2">
                        {feature.title}
                      </h3>

                      <p className="text-[#666666] text-sm sm:text-base leading-relaxed lg:leading-luxury-loose font-body-regular text-center px-2">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </AnimatedElement>
              ))}
            </div>
          </AnimatedElement>
        </div>
      </section>

      {/* Enhanced What We Create Section - Clean white */}
      <section id="what-we-create" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <AnimatedElement variants={fadeInLeft}>
                <div className="inline-flex items-center px-4 py-2 bg-[#b38a34]/10 rounded-full mb-6">
                  <span className="text-[#b38a34] text-xs sm:text-sm font-body-bold tracking-wide uppercase">
                    CO ZYSKUJESZ
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading-thin text-[#2A2A2A] mb-6 leading-snug">
                  Wybierając ARTSCore jako partnera?
                </h2>

                <p className="text-[#666666] text-base sm:text-lg mb-8 leading-relaxed font-body-regular">
                  Nasze rozwiązania są zaprojektowane, aby przekształcić Twoje projekty deweloperskie w poszukiwane
                  nieruchomości, które osiągają premium cenowe.
                </p>
              </AnimatedElement>

              <AnimatedElement variants={fastStaggerContainer}>
                <div className="space-y-4">
                  {[
                    {
                      title: "SZYBSZA SPRZEDAŻ",
                      description:
                        "Atrakcyjne wizualizacje i przemyślane aranżacje przyciągają więcej klientów i skracają czas sprzedaży Twoich nieruchomości.",
                      icon: <Zap className="w-5 h-5" />,
                    },
                    {
                      title: "WYŻSZA CENA ZA METR KWADRATOWY",
                      description:
                        "Profesjonalny design i atrakcyjne materiały marketingowe zwiększają wartość postrzeganą Twoich nieruchomości, pozwalając uzyskać wyższą cenę sprzedaży.",
                      icon: <TrendingUp className="w-5 h-5" />,
                    },
                    {
                      title: "WYRÓŻNIENIE NA TLE KONKURENCJI",
                      description:
                        "Zaoferuj klientom unikalne, dopasowane do ich potrzeb wnętrza i pakiety wykończeniowe, które staną się Twoim silnym atutem konkurencyjnym.",
                      icon: <Target className="w-5 h-5" />,
                    },
                    {
                      title: "TERMINOWOŚĆ I SPOKÓJ DUCHA",
                      description:
                        "Dzięki precyzyjnemu zarządzaniu projektem i terminowej realizacji, możesz spokojnie planować kolejne etapy sprzedaży i inwestycji.",
                      icon: <CheckCircle className="w-5 h-5" />,
                    },
                  ].map((benefit, index) => (
                    <AnimatedElement key={index} variants={listItemAnimation}>
                      <div className="flex items-start space-x-4 p-4 bg-white rounded-xl border border-[#F0F0F0]">
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#b38a34] to-[#9a7529] rounded-lg flex items-center justify-center text-white">
                          {benefit.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm sm:text-base font-body-bold text-[#2A2A2A] mb-2">
                            {benefit.title}
                          </h3>
                          <p className="text-[#666666] text-sm leading-relaxed font-body-regular">
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                    </AnimatedElement>
                  ))}
                </div>
              </AnimatedElement>
            </div>
            
            <div className="order-1 lg:order-2">
              <AnimatedElement variants={zoomIn}>
                <div className="relative h-[400px] sm:h-[500px] md:h-[550px] lg:h-[600px] flex items-center justify-center">
                  <div className="relative w-full h-full">
                    {/* Pierwsze zdjęcie - główne */}
                    <AnimatedElement variants={fadeInRight} className="absolute top-0 right-0 w-[80%] sm:w-[65%] md:w-[60%] lg:w-[50%] h-[60%] sm:h-[65%] md:h-[70%] z-20 transform hover:scale-105 transition-transform duration-500">
                      <div className="bg-white p-1 sm:p-2 shadow-xl h-full">
                        <Image
                          src="/images/831465.jpg"
                          alt="Nowoczesne wnętrze salonu z kuchnią"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </AnimatedElement>
                    
                    {/* Drugie zdjęcie - najmniejsze */}
                    <AnimatedElement variants={fadeInUp} className="absolute bottom-0 sm:-bottom-[10%] md:-bottom-[15%] lg:-bottom-[20%] left-0 sm:left-[5%] md:left-[10%] lg:left-[15%] w-[70%] sm:w-[60%] md:w-[55%] lg:w-[50%] h-[50%] sm:h-[55%] md:h-[60%] lg:h-[70%] z-30 transform hover:scale-105 transition-transform duration-500">
                      <div className="bg-white p-1 sm:p-2 shadow-xl h-full border-2 sm:border-4 border-white">
                        <Image
                          src="/images/474881.jpg"
                          alt="Sypialnia w stylu minimalistycznym"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </AnimatedElement>
                  </div>
                </div>
              </AnimatedElement>
            </div>
          </div>
        </div>
      </section>

      {/* NASZA OFERTA */}
      <section id="services" className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative">
        {/* Background architectural sketch */}
        <div className="absolute inset-0 bg-gray-50">
          <Image 
            src="/images/architectural-sketch-bg.jpg" 
            alt="Architectural sketch background" 
            fill 
            sizes="100vw"
            className="object-cover opacity-50"
            style={{ objectPosition: "center bottom" }}
            quality={100}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-white/60"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <AnimatedElement variants={flipIn}>
            <div className="text-center mb-12 sm:mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-[#b38a34]/10 backdrop-blur-sm rounded-full mb-4 border border-[#b38a34]/20">
                <span className="text-[#b38a34] text-xs sm:text-sm font-body-bold tracking-wide uppercase">
                  NASZA OFERTA
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading-thin text-[#2A2A2A] mb-6 leading-snug">
                Oferujemy kompleksowe rozwiązania, które zwiększają<br className="hidden md:block" /> atrakcyjność i wartość Twoich nieruchomości.
              </h2>
              <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-[#b38a34] to-[#9a7529] mx-auto rounded-full"></div>
            </div>
          </AnimatedElement>

          <AnimatedElement variants={staggerContainer}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {[
                {
                  id: "wizualizacje",
                  title: "Wizualizacje 3D",
                  icon: <Palette className="w-6 h-6" />,
                  description:
                    "Tworzymy fotorealistyczne wizualizacje wnętrz i budynków, które budzą emocje i prezentują potencjał Twoich mieszkań.",
                  animation: staggerItemScale
                },
                {
                  id: "wirtualne",
                  title: "Wirtualne spacery",
                  icon: <Users className="w-6 h-6" />,
                  description:
                    "Oferujemy interaktywne wirtualne spacery, pozwalające klientom 'odwiedzić' nieruchomość online 24/7.",
                  animation: staggerItemRotate
                },
                {
                  id: "projektowanie",
                  title: "Projektowanie wnętrz",
                  icon: <Building className="w-6 h-6" />,
                  description:
                    "Przygotowujemy kompleksowe projekty wnętrz, dopasowane do Twojej grupy docelowej i budżetu.",
                  animation: staggerItemFlip
                },
                {
                  id: "staging",
                  title: "Home Staging",
                  icon: <Sparkles className="w-6 h-6" />,
                  description:
                    "Projektujemy i realizujemy mieszkania pokazowe, które maksymalizują atrakcyjność inwestycji.",
                  animation: cardAnimation
                },
              ].map((service) => (
                <AnimatedElement
                  key={service.id}
                  variants={service.animation}
                  className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#E8E8E8] p-6 shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-[#b38a34] to-[#9a7529] rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300 mx-auto">
                    {service.icon}
                  </div>
                  <h3 className="text-lg font-body-bold text-[#2A2A2A] mb-3 text-center">
                    {service.title}
                  </h3>
                  <p className="text-[#666666] text-sm leading-relaxed text-center">
                    {service.description}
                  </p>
                </AnimatedElement>
              ))}
            </div>
          </AnimatedElement>
          
          <AnimatedElement variants={fadeInUp} className="mt-12 sm:mt-16 flex justify-center">
            <Button className="bg-gradient-to-r from-[#b38a34] to-[#9a7529] hover:from-[#9a7529] hover:to-[#81621e] text-white px-4 sm:px-6 md:px-8 py-3 sm:py-4 text-sm sm:text-base rounded-xl font-body-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              <a href="#contact" className="flex items-center justify-center">
                <span className="text-center">
                  <span className="hidden sm:inline">Poznaj szczegóły naszej oferty</span>
                  <span className="sm:hidden">Poznaj szczegóły</span>
                </span>
                <ArrowRight className="ml-2 w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0" />
              </a>
            </Button>
          </AnimatedElement>
        </div>
      </section>

      {/* Enhanced Partnership Program - Background image */}
      <section id="partnership" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 relative bg-[#F8F4EF]">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/images/351204.jpg"
            alt="Elegant dining room background"
            fill
            sizes="100vw"
            priority
            className="object-cover opacity-25"
          />
          {/* White to gold gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-[#b38a34]/40"></div>
        </div>
        
        {/* Content */}
        <div className="max-w-3xl mx-auto relative z-10">
          <AnimatedElement variants={fadeInScale}>
            <div className="text-center">
              <AnimatedElement variants={rotateIn}>
                <div className="inline-flex items-center px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full mb-6 shadow-sm">
                  <span className="text-[#b38a34] text-xs sm:text-sm font-body-bold tracking-wide uppercase flex items-center">
                    <Handshake className="w-4 h-4 mr-2" /> PROGRAM PARTNERSKI
                  </span>
                </div>
              </AnimatedElement>

              <AnimatedElement variants={fadeInUp}>
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-body-semibold text-[#2A2A2A] mb-6 leading-tight">
                  Dołącz do naszego Programu Partnerskiego i zarabiaj więcej!
                </h2>

                <p className="text-[#333333] text-base sm:text-lg mb-8 leading-relaxed font-body-regular">
                  Zostań partnerem ARTSCore i zyskaj prowizję za każdego klienta z Twojego polecenia, który podpisze z
                  nami umowę na kompleksowy projekt wnętrza. Proste zasady, realne korzyści.
                </p>
              </AnimatedElement>

              <AnimatedElement variants={zoomIn}>
                <div className="flex justify-center">
                  <Button className="bg-gradient-to-r from-[#1A1A1A] to-[#2A2A2A] hover:from-[#b38a34] hover:to-[#9a7529] text-white px-4 sm:px-6 md:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg rounded-xl font-body-semibold shadow-md max-w-full">
                  <a href="/partner-program" className="flex items-center justify-center" scroll={true}>
                      <span className="text-center">
                        <span className="hidden sm:inline">Dowiedz się więcej o Programie Partnerskim</span>
                        <span className="sm:hidden">Program Partnerski</span>
                      </span>
                      <ArrowRight className="ml-2 w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0" />
                    </a>
                  </Button>
                </div>
              </AnimatedElement>
            </div>
          </AnimatedElement>
        </div>
      </section>

      {/* Case Study Section - Luxury light background */}
      <section
        id="case-study"
        className="py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-[#F8F4EF] relative overflow-hidden"
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-repeat" style={{ backgroundImage: "url('/images/texture-overlay.png')", backgroundSize: "200px" }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <AnimatedElement variants={fadeInLeft}>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-16 lg:mb-20">
              <div className="lg:max-w-2xl">
                <AnimatedElement variants={rotateIn}>
                  <div className="inline-flex items-center px-4 py-2 bg-[#b38a34]/10 rounded-full mb-6">
                    <span className="text-[#b38a34] text-xs sm:text-sm font-body-bold tracking-wide uppercase">
                      CASE STUDY
                    </span>
                  </div>
                </AnimatedElement>
                
                <AnimatedElement variants={fadeInUp}>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading-thin text-[#2A2A2A] mb-6 leading-tight">
                    Riverside <span className="text-[#b38a34] italic">Residences</span>
                  </h2>
                </AnimatedElement>
                
                <AnimatedElement variants={fadeIn}>
                  <p className="text-[#666666] text-lg leading-relaxed mb-8">
                    Nasz klient miał problem ze sprzedażą apartamentów premium w nowej inwestycji. 
                    Po wdrożeniu naszych rozwiązań wizualizacji i projektowania wnętrz, osiągnęliśmy 
                    spektakularne rezultaty.
                  </p>
                </AnimatedElement>
              </div>
              
              <div className="lg:w-1/3 mt-8 lg:mt-0">
                <AnimatedElement variants={zoomIn}>
                  <Button className="w-full bg-gradient-to-r from-[#b38a34] to-[#9a7529] hover:from-[#9a7529] hover:to-[#81621e] text-white px-4 sm:px-6 md:px-8 py-4 sm:py-5 text-sm sm:text-base md:text-lg rounded-xl font-body-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                    <a href="#services" className="flex items-center justify-center">
                      <span>Sprawdź, jak możemy pomóc</span>
                      <ArrowRight className="ml-2 sm:ml-3 w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0" />
                    </a>
                  </Button>
                </AnimatedElement>
              </div>
            </div>
          </AnimatedElement>
          
          {/* Stats and Images in a unique layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0">
            {/* Stats section - horizontal layout with large numbers */}
            <div className="lg:col-span-12 mb-12 lg:mb-20">
              <AnimatedElement variants={staggerContainer}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                  {[
                    { value: "+37%", label: "SZYBSZA SPRZEDAŻ", desc: "Prędkość sprzedaży wzrosła w pierwszym kwartale" },
                    { value: "+8,5%", label: "WYŻSZA CENA", desc: "Średnia cena za metr kwadratowy wzrosła" },
                    { value: "+42%", label: "ZADOWOLENIE", desc: "Wskaźniki zadowolenia klientów poprawiły się" },
                  ].map((stat, index) => (
                    <AnimatedElement key={index} variants={staggerItemScale}>
                      <div className="bg-white rounded-none border-l-4 border-[#b38a34] p-8 shadow-[0_5px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] transition-all duration-500">
                        <div className="text-5xl sm:text-6xl font-heading-bold text-[#b38a34] mb-3">
                          {stat.value}
                        </div>
                        <h4 className="text-sm font-body-bold tracking-wider text-[#2A2A2A] mb-2">
                          {stat.label}
                        </h4>
                        <p className="text-[#666666] text-sm">
                          {stat.desc}
                        </p>
                      </div>
                    </AnimatedElement>
                  ))}
                </div>
              </AnimatedElement>
            </div>
            
            {/* Images section - asymmetrical grid layout */}
            <AnimatedElement variants={fadeIn} className="lg:col-span-8 h-[500px] sm:h-[600px] md:h-[650px] lg:h-[700px] relative mb-12 lg:mb-0">
              {/* For mobile: Stack the images vertically with appropriate spacing */}
              <div className="block lg:hidden space-y-4">
                <div className="w-full h-[250px] sm:h-[300px] overflow-hidden">
                  <div className="w-full h-full p-2 bg-white shadow-xl">
                    <div className="relative w-full h-full overflow-hidden">
                      <Image
                        src="/images/75430.jpg"
                        alt="Salon w stylu farmhouse"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                        <p className="text-white text-sm">Salon główny - wizualizacja</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="w-full h-[250px] sm:h-[300px] overflow-hidden">
                  <div className="w-full h-full p-2 bg-white shadow-xl">
                    <div className="relative w-full h-full overflow-hidden">
                      <Image
                        src="/images/474881.jpg"
                        alt="Elegancka sypialnia w stylu minimalistycznym"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                        <p className="text-white text-sm">Sypialnia master</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* For desktop: Keep the asymmetrical layout */}
              <div className="hidden lg:block">
                <div className="absolute left-0 top-0 w-[70%] h-[55%] overflow-hidden">
                  <div className="w-full h-full p-3 bg-white shadow-xl">
                    <div className="relative w-full h-full overflow-hidden">
                      <Image
                        src="/images/75430.jpg"
                        alt="Salon w stylu farmhouse"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                        <p className="text-white text-sm">Salon główny - wizualizacja</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute right-0 bottom-0 w-[60%] h-[65%] overflow-hidden">
                  <div className="w-full h-full p-3 bg-white shadow-xl">
                    <div className="relative w-full h-full overflow-hidden">
                      <Image
                        src="/images/474881.jpg"
                        alt="Elegancka sypialnia w stylu minimalistycznym"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                        <p className="text-white text-sm">Sypialnia master</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedElement>
            
            {/* Right side content */}
            <AnimatedElement variants={fadeInUp} className="lg:col-span-4 lg:pl-12 flex flex-col justify-center">
              <div className="bg-[#b38a34]/5 p-8 border-t border-[#b38a34]/20">
                <h3 className="text-2xl font-heading-medium text-[#2A2A2A] mb-4">
                  Wyzwanie projektu
                </h3>
                <p className="text-[#666666] mb-6 leading-relaxed">
                  Deweloper premium borykał się z wolną sprzedażą apartamentów, 
                  mimo ich doskonałej lokalizacji. Klienci mieli trudność z wyobrażeniem 
                  sobie potencjału pustych przestrzeni.
                </p>
                <h3 className="text-2xl font-heading-medium text-[#2A2A2A] mb-4">
                  Nasze rozwiązanie
                </h3>
                <p className="text-[#666666] leading-relaxed">
                  Stworzyliśmy kompleksową strategię wizualizacji, projektując wnętrza 
                  dopasowane do grupy docelowej oraz realizując mieszkanie pokazowe, 
                  które stało się wizytówką inwestycji.
                </p>
              </div>
            </AnimatedElement>
          </div>
        </div>
      </section>
      
      {/* Panorama 360 Section */}
      <section id="panorama" className="bg-[#F8F8F8] relative overflow-hidden">
        {/* Top gold border */}
        <div className="w-full h-[1px] sm:h-[2px] bg-gradient-to-r from-[#b38a34] to-[#9a7529]"></div>
        
        <AnimatedElement variants={zoomIn}>
          <div className="relative w-full h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden">
            <div className="w-full h-full" id="panorama-viewer"></div>
          </div>
        </AnimatedElement>
        
        {/* Bottom gold border */}
        <div className="w-full h-[1px] sm:h-[2px] bg-gradient-to-r from-[#b38a34] to-[#9a7529]"></div>
      </section>

      {/* Contact Section */}
      <ContactSection />

      {/* Enhanced Footer - Dark gradient background */}
      <footer className="bg-gradient-to-br from-[#0F0F0F] via-[#1A1A1A] to-[#2A2A2A] relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/texture-overlay.png" alt="Texture overlay" fill className="object-cover opacity-5" />
        </div>

        <div className="relative">
          {/* Main Footer Content */}
          <div className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-12">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 lg:gap-16">
                {/* Company Info */}
                <div className="sm:col-span-2 lg:col-span-2">
                  <div className="flex items-center space-x-2 mb-6 sm:mb-8">
                    <div className="w-6 sm:w-8 lg:w-9 h-6 sm:h-8 lg:h-9 flex items-center justify-center">
                      <Image
                        src="/images/arts-logo.png"
                        alt="ARTSCore Logo"
                        width={36}
                        height={36}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl lg:text-3xl uppercase text-white font-body-semibold">
                        ARTSCORE
                      </h3>
                    </div>
                  </div>
                  <p className="text-[#B8B8B8] text-xs sm:text-sm leading-relaxed font-body-regular mb-6 sm:mb-8 max-w-md">
                    Tworzymy wnętrza, które sprzedają Twoje inwestycje. Profesjonalne wizualizacje i kompleksowe
                    projekty dla deweloperów.
                  </p>
                </div>

                {/* Quick Links */}
                <div className="sm:col-span-1 lg:col-span-1">
                  <h4 className="text-white text-base sm:text-lg font-heading-semibold mb-4 sm:mb-6">Menu</h4>
                  <ul className="space-y-3 sm:space-y-4">
                    {[
                      { name: "O firmie", href: "#what-we-create" },
                      { name: "Oferta", href: "#services" },
                      { name: "Program partnerski", href: "#partnership" },
                      { name: "Kontakt", href: "#contact" },
                    ].map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.href}
                          className="text-[#B8B8B8] hover:text-[#b38a34] transition-colors duration-300 font-body-regular text-sm sm:text-base"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Contact Info */}
                <div className="sm:col-span-1 lg:col-span-1">
                  <h4 className="text-white text-base sm:text-lg font-heading-semibold mb-4 sm:mb-6">Kontakt</h4>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <Phone className="w-4 sm:w-5 h-4 sm:h-5 text-[#b38a34] mt-1 flex-shrink-0" />
                      <div>
                        <a
                          href="tel:+48530002009"
                          className="text-[#B8B8B8] hover:text-[#b38a34] transition-colors duration-300 font-body-regular text-sm sm:text-base"
                        >
                          +48 530 002 009
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <Mail className="w-4 sm:w-5 h-4 sm:h-5 text-[#b38a34] mt-1 flex-shrink-0" />
                      <a
                        href="mailto:kontakt@artscore.pro"
                        className="text-[#B8B8B8] hover:text-[#b38a34] transition-colors duration-300 font-body-regular text-sm sm:text-base"
                      >
                        kontakt@artscore.pro
                      </a>
                    </div>
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <Facebook className="w-4 sm:w-5 h-4 sm:h-5 text-[#b38a34] mt-1 flex-shrink-0" />
                      <a
                        href="https://www.facebook.com/share/168VzVcygm/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#B8B8B8] hover:text-[#b38a34] transition-colors duration-300 font-body-regular text-sm sm:text-base"
                      >
                        Profil FB
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-white/10 py-6 sm:py-8 px-4 sm:px-6 lg:px-12">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
              <p className="text-[#B8B8B8] text-xs sm:text-sm font-body-regular text-center sm:text-left">
                &copy; 2025 <span className="text-[#B8B8B8] font-body-semibold uppercase">ARTSCORE</span>. Wszystkie prawa zastrzeżone.
              </p>
              <div className="flex flex-wrap justify-center sm:justify-end space-x-4 sm:space-x-6">
                <a
                  href="#"
                  onClick={(e) => {e.preventDefault(); togglePrivacyPolicy();}}
                  className="text-[#B8B8B8] hover:text-[#b38a34] transition-colors duration-300 text-xs sm:text-sm font-body-regular"
                >
                  Polityka Prywatności
                </a>

              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Privacy Policy Modal */}
      {privacyPolicyOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 overflow-y-auto" onClick={togglePrivacyPolicy}>
          <div className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto p-6 sm:p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-heading-bold text-[#2A2A2A]">Polityka Prywatności</h2>
              <button 
                onClick={togglePrivacyPolicy} 
                className="text-[#666666] hover:text-[#b38a34] transition-colors"
                aria-label="Zamknij politykę prywatności"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="prose max-w-none text-[#333333]">
              <p className="text-sm text-[#666666]">Data ostatniej aktualizacji: 16.06.2025</p>
              
              <h3 className="text-xl font-heading-medium mt-6 mb-3">1. Informacje ogólne</h3>
              <p>Niniejsza Polityka Prywatności określa zasady przetwarzania i ochrony danych osobowych użytkowników strony internetowej ARTSCore oraz klientów korzystających z naszych usług projektowania wnętrz, wizualizacji 3D i wirtualnych spacerów dla deweloperów.</p>
              
              <div className="bg-[#F8F4EF] p-4 rounded-lg my-4">
                <p className="font-body-medium">Administrator danych:</p>
                <p>ARTSCore<br />
                Email: kontakt@artscore.com<br />
                Telefon: +48 530 002 009</p>
              </div>
              
              <h3 className="text-xl font-heading-medium mt-6 mb-3">2. Rodzaje zbieranych danych osobowych</h3>
              <p>Zbieramy następujące kategorie danych osobowych:</p>
              
              <h4 className="text-lg font-heading-medium mt-4 mb-2">2.1 Dane podawane dobrowolnie</h4>
              <ul className="list-disc pl-6 mb-4">
                <li>Imię i nazwisko osoby kontaktowej</li>
                <li>Nazwa firmy/organizacji</li>
                <li>Adres email</li>
                <li>Numer telefonu</li>
                <li>Nazwa projektu/inwestycji</li>
                <li>Obszary zainteresowania (wizualizacje, wirtualne spacery, projektowanie wnętrz, home staging, program partnerski)</li>
                <li>Treść wiadomości i zapytań</li>
              </ul>
              
              <h4 className="text-lg font-heading-medium mt-4 mb-2">2.2 Dane zbierane automatycznie</h4>
              <ul className="list-disc pl-6 mb-4">
                <li>Adres IP</li>
                <li>Typ przeglądarki i system operacyjny</li>
                <li>Czas i data wizyty na stronie</li>
                <li>Odwiedzone podstrony</li>
                <li>Źródło ruchu (skąd użytkownik przyszedł na stronę)</li>
                <li>Preferencje językowe</li>
              </ul>
              
              <h3 className="text-xl font-heading-medium mt-6 mb-3">3. Cele i podstawy prawne przetwarzania danych</h3>
              
              <h4 className="text-lg font-heading-medium mt-4 mb-2">3.1 Obsługa zapytań i komunikacja</h4>
              <ul className="list-disc pl-6 mb-4">
                <li>Cel: Odpowiadanie na zapytania, umawianie konsultacji, przygotowywanie ofert</li>
                <li>Podstawa prawna: Prawnie uzasadniony interes administratora (art. 6 ust. 1 lit. f RODO)</li>
                <li>Okres przechowywania: 3 lata od ostatniego kontaktu</li>
              </ul>
              
              <h4 className="text-lg font-heading-medium mt-4 mb-2">3.2 Realizacja umów</h4>
              <ul className="list-disc pl-6 mb-4">
                <li>Cel: Wykonanie umowy na usługi projektowe, wizualizacje, wirtualne spacery</li>
                <li>Podstawa prawna: Wykonanie umowy (art. 6 ust. 1 lit. b RODO)</li>
                <li>Okres przechowywania: 10 lat od zakończenia umowy (wymogi księgowe)</li>
              </ul>
              
              <h4 className="text-lg font-heading-medium mt-4 mb-2">3.3 Marketing i rozwój biznesu</h4>
              <ul className="list-disc pl-6 mb-4">
                <li>Cel: Przesyłanie informacji o nowych usługach, case studies, programie partnerskim</li>
                <li>Podstawa prawna: Zgoda (art. 6 ust. 1 lit. a RODO)</li>
                <li>Okres przechowywania: Do momentu wycofania zgody</li>
              </ul>
              
              <h4 className="text-lg font-heading-medium mt-4 mb-2">3.4 Analityka strony internetowej</h4>
              <ul className="list-disc pl-6 mb-4">
                <li>Cel: Analiza ruchu na stronie, optymalizacja treści i funkcjonalności</li>
                <li>Podstawa prawna: Prawnie uzasadniony interes administratora (art. 6 ust. 1 lit. f RODO)</li>
                <li>Okres przechowywania: 26 miesięcy</li>
              </ul>
              
              <h3 className="text-xl font-heading-medium mt-6 mb-3">4. Udostępnianie danych osobowych</h3>
              <p>Dane osobowe mogą być udostępniane następującym kategoriom odbiorców:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Podwykonawcy: Firmy świadczące usługi IT, hostingu, wsparcia technicznego</li>
                <li>Partnerzy biznesowi: W ramach programu partnerskiego (za zgodą)</li>
                <li>Dostawcy usług marketingowych: Agencje reklamowe, platformy email marketingu</li>
                <li>Organy publiczne: W przypadkach przewidzianych prawem</li>
                <li>Doradcy prawni i księgowi: W zakresie niezbędnym do świadczenia usług</li>
              </ul>
              <p>Przekazywanie danych poza EOG: Niektóre z naszych dostawców usług (np. platformy chmurowe) mogą przetwarzać dane poza Europejskim Obszarem Gospodarczym. W takich przypadkach zapewniamy odpowiednie zabezpieczenia zgodnie z RODO.</p>
              
              <h3 className="text-xl font-heading-medium mt-6 mb-3">5. Bezpieczeństwo danych</h3>
              <p>Stosujemy następujące środki bezpieczeństwa:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Szyfrowanie danych w transmisji (SSL/TLS)</li>
                <li>Szyfrowanie danych w spoczynku</li>
                <li>Regularne kopie zapasowe</li>
                <li>Kontrola dostępu oparta na rolach</li>
                <li>Regularne audyty bezpieczeństwa</li>
                <li>Szkolenia pracowników w zakresie ochrony danych</li>
                <li>Procedury reagowania na incydenty bezpieczeństwa</li>
              </ul>
              
              <h3 className="text-xl font-heading-medium mt-6 mb-3">6. Prawa osób, których dane dotyczą</h3>
              <p>Zgodnie z RODO przysługują Państwu następujące prawa:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Prawo dostępu: Możliwość uzyskania informacji o przetwarzanych danych</li>
                <li>Prawo do sprostowania: Możliwość poprawienia nieprawidłowych danych</li>
                <li>Prawo do usunięcia: Możliwość żądania usunięcia danych ('prawo do bycia zapomnianym')</li>
                <li>Prawo do ograniczenia przetwarzania: Możliwość ograniczenia sposobu przetwarzania danych</li>
                <li>Prawo do przenoszenia danych: Możliwość otrzymania danych w ustrukturyzowanym formacie</li>
                <li>Prawo sprzeciwu: Możliwość sprzeciwu wobec przetwarzania danych</li>
                <li>Prawo do wycofania zgody: W przypadku przetwarzania opartego na zgodzie</li>
              </ul>
              <p>Aby skorzystać z powyższych praw, prosimy o kontakt na adres: privacy@artscore.com</p>
              
              <h3 className="text-xl font-heading-medium mt-6 mb-3">7. Pliki cookies i technologie śledzące</h3>
              
              <h4 className="text-lg font-heading-medium mt-4 mb-2">7.1 Rodzaje cookies</h4>
              <ul className="list-disc pl-6 mb-4">
                <li>Cookies niezbędne: Umożliwiają podstawowe funkcjonowanie strony</li>
                <li>Cookies funkcjonalne: Zapamiętują preferencje użytkownika (np. język)</li>
                <li>Cookies analityczne: Pomagają zrozumieć sposób korzystania ze strony</li>
                <li>Cookies marketingowe: Służą do personalizacji reklam (za zgodą)</li>
              </ul>
              
              <h4 className="text-lg font-heading-medium mt-4 mb-2">7.2 Zarządzanie cookies</h4>
              <p>Użytkownicy mogą zarządzać ustawieniami cookies poprzez ustawienia przeglądarki internetowej. Wyłączenie niektórych cookies może wpłynąć na funkcjonalność strony.</p>
              
              <h3 className="text-xl font-heading-medium mt-6 mb-3">8. Zmiany w Polityce Prywatności</h3>
              <p>Zastrzegamy sobie prawo do wprowadzania zmian w niniejszej Polityce Prywatności. O istotnych zmianach będziemy informować poprzez:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Publikację zaktualizowanej wersji na stronie internetowej</li>
                <li>Wysłanie powiadomienia email do zarejestrowanych użytkowników</li>
                <li>Wyświetlenie informacji na stronie głównej</li>
              </ul>
              
              <h3 className="text-xl font-heading-medium mt-6 mb-3">9. Kontakt w sprawach prywatności</h3>
              <p>W przypadku pytań dotyczących przetwarzania danych osobowych lub chęci skorzystania z przysługujących praw, prosimy o kontakt:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                <div className="bg-[#F8F4EF] p-4 rounded-lg">
                  <p className="font-body-medium">Email</p>
                  <p>kontakt@artscore.pro</p>
                </div>
                <div className="bg-[#F8F4EF] p-4 rounded-lg">
                  <p className="font-body-medium">Telefon</p>
                  <p>+48 123 456 789</p>
                </div>
              </div>
              
              <div className="bg-[#F8F4EF] p-4 rounded-lg my-4">
                <p className="font-body-medium">Adres korespondencyjny:</p>
                <p>ARTSCore<br /></p>
              </div>
              
              <h3 className="text-xl font-heading-medium mt-6 mb-3">10. Prawo do wniesienia skargi</h3>
              <p>W przypadku naruszenia przepisów o ochronie danych osobowych, przysługuje Państwu prawo wniesienia skargi do organu nadzorczego:</p>
              
              <div className="bg-[#F8F4EF] p-4 rounded-lg my-4">
                <p className="font-body-medium">Urząd Ochrony Danych Osobowych</p>
                <p>ul. Stawki 2<br />
                00-193 Warszawa<br />
                Tel.: +48 22 531 03 00<br />
                Email: kancelaria@uodo.gov.pl<br />
                Strona: uodo.gov.pl</p>
              </div>
              
              <h3 className="text-xl font-heading-medium mt-6 mb-3">11. Zgodność z przepisami międzynarodowymi</h3>
              <p>Niniejsza Polityka Prywatności została opracowana z uwzględnieniem:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>RODO - Rozporządzenie Parlamentu Europejskiego i Rady (UE) 2016/679</li>
                <li>CCPA - California Consumer Privacy Act (dla użytkowników z Kalifornii)</li>
                <li>Ustawa o ochronie danych osobowych - przepisy krajowe</li>
                <li>Ustawa o świadczeniu usług drogą elektroniczną</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
