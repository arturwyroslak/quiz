'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AnimatedElement } from '@/components/animations/animated-element';
import { fadeIn, fadeInUp } from '@/components/animations/animation-variants';

export default function PartnerProgramTerms() {
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

      <main className="container py-10">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Regulamin Programu Partnerskiego Artscore</h1>
            <p className="text-muted-foreground">
              Obowiązuje od: 1 czerwca 2024 r.
            </p>
          </div>

          <Separator />

          <div className="space-y-6">
            <section className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight">§1. Postanowienia ogólne</h2>
              <div className="space-y-2">
                <p>
                  1.1. Niniejszy Regulamin określa zasady uczestnictwa w Programie Partnerskim Artscore, zwanym dalej „Programem".
                </p>
                <p>
                  1.2. Organizatorem Programu jest Artscore Sp. z o.o. z siedzibą w Warszawie, ul. Przykładowa 123, 00-000 Warszawa, wpisana do rejestru przedsiębiorców Krajowego Rejestru Sądowego prowadzonego przez Sąd Rejonowy dla m.st. Warszawy w Warszawie, XIII Wydział Gospodarczy Krajowego Rejestru Sądowego pod numerem KRS 0000000000, NIP 0000000000, REGON 000000000, zwana dalej „Organizatorem".
                </p>
                <p>
                  1.3. Program ma na celu nawiązanie współpracy z podmiotami, które będą polecać usługi Organizatora potencjalnym klientom, zwanymi dalej „Partnerami".
                </p>
                <p>
                  1.4. Przystąpienie do Programu jest dobrowolne i oznacza akceptację niniejszego Regulaminu.
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight">§2. Definicje</h2>
              <div className="space-y-2">
                <p>
                  2.1. Użyte w Regulaminie pojęcia oznaczają:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Program - Program Partnerski Artscore,</li>
                  <li>Organizator - Artscore Sp. z o.o. z siedzibą w Warszawie,</li>
                  <li>Partner - podmiot uczestniczący w Programie, który poleca usługi Organizatora potencjalnym klientom,</li>
                  <li>Lead - potencjalny klient Organizatora zgłoszony przez Partnera,</li>
                  <li>Panel Partnera - aplikacja internetowa umożliwiająca Partnerowi zarządzanie swoim kontem w Programie,</li>
                  <li>Wynagrodzenie - prowizja należna Partnerowi za skuteczne polecenie usług Organizatora.</li>
                </ul>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight">§3. Warunki uczestnictwa</h2>
              <div className="space-y-2">
                <p>
                  3.1. Partnerem może zostać:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>osoba fizyczna prowadząca działalność gospodarczą,</li>
                  <li>osoba prawna,</li>
                  <li>jednostka organizacyjna nieposiadająca osobowości prawnej, której ustawa przyznaje zdolność prawną.</li>
                </ul>
                <p>
                  3.2. Warunkiem przystąpienia do Programu jest:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>wypełnienie formularza rejestracyjnego na stronie internetowej Organizatora,</li>
                  <li>akceptacja niniejszego Regulaminu,</li>
                  <li>akceptacja Polityki Prywatności,</li>
                  <li>pozytywna weryfikacja przez Organizatora.</li>
                </ul>
                <p>
                  3.3. Organizator zastrzega sobie prawo do odmowy przyjęcia do Programu bez podania przyczyny.
                </p>
                <p>
                  3.4. Partner zobowiązuje się do podania prawdziwych danych w formularzu rejestracyjnym oraz do ich aktualizacji w przypadku zmiany.
                </p>
                <p>
                  3.5. Partner otrzymuje dostęp do Panelu Partnera po pozytywnej weryfikacji przez Organizatora.
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight">§4. Zasady współpracy</h2>
              <div className="space-y-2">
                <p>
                  4.1. Partner zobowiązuje się do:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>promowania usług Organizatora zgodnie z obowiązującymi przepisami prawa oraz dobrymi obyczajami,</li>
                  <li>niepodejmowania działań, które mogłyby naruszyć dobre imię Organizatora,</li>
                  <li>zgłaszania Leadów za pośrednictwem Panelu Partnera,</li>
                  <li>uzyskania zgody Leada na przekazanie jego danych Organizatorowi,</li>
                  <li>przekazywania prawdziwych i rzetelnych informacji o Leadach,</li>
                  <li>nieujawniania osobom trzecim informacji poufnych dotyczących współpracy z Organizatorem.</li>
                </ul>
                <p>
                  4.2. Organizator zobowiązuje się do:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>zapewnienia Partnerowi dostępu do Panelu Partnera,</li>
                  <li>weryfikacji zgłoszonych Leadów,</li>
                  <li>informowania Partnera o statusie zgłoszonych Leadów,</li>
                  <li>wypłaty Wynagrodzenia zgodnie z zasadami określonymi w §5 Regulaminu.</li>
                </ul>
                <p>
                  4.3. Organizator zastrzega sobie prawo do kontaktu z Leadem w celu weryfikacji jego zainteresowania usługami Organizatora.
                </p>
                <p>
                  4.4. Partner nie jest upoważniony do składania w imieniu Organizatora jakichkolwiek oświadczeń woli, w tym do zawierania umów.
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight">§5. Wynagrodzenie</h2>
              <div className="space-y-2">
                <p>
                  5.1. Partner otrzymuje Wynagrodzenie za skuteczne polecenie usług Organizatora, tj. za Leada, który zawarł umowę z Organizatorem.
                </p>
                <p>
                  5.2. Wysokość Wynagrodzenia jest ustalana indywidualnie z Partnerem i określana w odrębnej umowie.
                </p>
                <p>
                  5.3. Wynagrodzenie jest wypłacane na podstawie faktury wystawionej przez Partnera, w terminie 14 dni od dnia jej doręczenia Organizatorowi.
                </p>
                <p>
                  5.4. Wynagrodzenie jest wypłacane przelewem na rachunek bankowy wskazany przez Partnera.
                </p>
                <p>
                  5.5. Organizator zastrzega sobie prawo do zmiany zasad naliczania Wynagrodzenia, o czym poinformuje Partnera z 30-dniowym wyprzedzeniem.
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight">§6. Panel Partnera</h2>
              <div className="space-y-2">
                <p>
                  6.1. Partner otrzymuje dostęp do Panelu Partnera po pozytywnej weryfikacji przez Organizatora.
                </p>
                <p>
                  6.2. Panel Partnera umożliwia:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>zgłaszanie Leadów,</li>
                  <li>śledzenie statusu zgłoszonych Leadów,</li>
                  <li>przeglądanie historii zgłoszeń,</li>
                  <li>zarządzanie danymi Partnera,</li>
                  <li>komunikację z Organizatorem.</li>
                </ul>
                <p>
                  6.3. Partner zobowiązuje się do zachowania w tajemnicy danych dostępowych do Panelu Partnera.
                </p>
                <p>
                  6.4. Partner ponosi odpowiedzialność za wszelkie działania podjęte z wykorzystaniem jego danych dostępowych do Panelu Partnera.
                </p>
                <p>
                  6.5. Organizator zastrzega sobie prawo do czasowego wyłączenia Panelu Partnera w celu przeprowadzenia prac konserwacyjnych lub aktualizacji.
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight">§7. Ochrona danych osobowych</h2>
              <div className="space-y-2">
                <p>
                  7.1. Administratorem danych osobowych Partnera oraz Leadów jest Organizator.
                </p>
                <p>
                  7.2. Dane osobowe są przetwarzane zgodnie z obowiązującymi przepisami prawa, w szczególności z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych i w sprawie swobodnego przepływu takich danych oraz uchylenia dyrektywy 95/46/WE (ogólne rozporządzenie o ochronie danych).
                </p>
                <p>
                  7.3. Szczegółowe informacje dotyczące przetwarzania danych osobowych znajdują się w Polityce Prywatności dostępnej na stronie internetowej Organizatora oraz w Panelu Partnera.
                </p>
                <p>
                  7.4. Partner zobowiązuje się do uzyskania zgody Leada na przekazanie jego danych osobowych Organizatorowi.
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight">§8. Czas trwania i rozwiązanie umowy</h2>
              <div className="space-y-2">
                <p>
                  8.1. Umowa o uczestnictwo w Programie jest zawierana na czas nieokreślony.
                </p>
                <p>
                  8.2. Partner może w każdej chwili zrezygnować z uczestnictwa w Programie poprzez złożenie oświadczenia o rezygnacji za pośrednictwem Panelu Partnera lub w formie pisemnej.
                </p>
                <p>
                  8.3. Organizator może rozwiązać umowę z Partnerem ze skutkiem natychmiastowym w przypadku:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>naruszenia przez Partnera postanowień niniejszego Regulaminu,</li>
                  <li>podania przez Partnera nieprawdziwych danych,</li>
                  <li>podejmowania przez Partnera działań naruszających dobre imię Organizatora,</li>
                  <li>braku aktywności Partnera przez okres dłuższy niż 12 miesięcy.</li>
                </ul>
                <p>
                  8.4. W przypadku rozwiązania umowy, Partner zachowuje prawo do Wynagrodzenia za Leady, które zostały zgłoszone przed rozwiązaniem umowy i które zawarły umowę z Organizatorem.
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight">§9. Odpowiedzialność</h2>
              <div className="space-y-2">
                <p>
                  9.1. Partner ponosi pełną odpowiedzialność za treść i formę materiałów promocyjnych wykorzystywanych do promowania usług Organizatora.
                </p>
                <p>
                  9.2. Organizator nie ponosi odpowiedzialności za szkody powstałe w wyniku nieprawidłowego korzystania z Panelu Partnera przez Partnera.
                </p>
                <p>
                  9.3. Organizator nie ponosi odpowiedzialności za przerwy w dostępie do Panelu Partnera wynikające z przyczyn technicznych lub innych okoliczności, na które Organizator nie ma wpływu.
                </p>
                <p>
                  9.4. Partner zobowiązuje się do naprawienia szkody wyrządzonej Organizatorowi w związku z niewykonaniem lub nienależytym wykonaniem umowy.
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight">§10. Zmiany Regulaminu</h2>
              <div className="space-y-2">
                <p>
                  10.1. Organizator zastrzega sobie prawo do zmiany niniejszego Regulaminu w każdym czasie.
                </p>
                <p>
                  10.2. O zmianach Regulaminu Organizator poinformuje Partnera za pośrednictwem Panelu Partnera lub poczty elektronicznej.
                </p>
                <p>
                  10.3. Zmiany Regulaminu wchodzą w życie po upływie 14 dni od dnia poinformowania Partnera o zmianach.
                </p>
                <p>
                  10.4. Korzystanie z Panelu Partnera po wejściu w życie zmian Regulaminu oznacza ich akceptację.
                </p>
                <p>
                  10.5. W przypadku braku akceptacji zmian Regulaminu, Partner może zrezygnować z uczestnictwa w Programie.
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight">§11. Postanowienia końcowe</h2>
              <div className="space-y-2">
                <p>
                  11.1. W sprawach nieuregulowanych niniejszym Regulaminem zastosowanie mają przepisy prawa polskiego.
                </p>
                <p>
                  11.2. Wszelkie spory wynikające z uczestnictwa w Programie będą rozstrzygane przez sąd właściwy dla siedziby Organizatora.
                </p>
                <p>
                  11.3. Regulamin wchodzi w życie z dniem 1 czerwca 2024 r.
                </p>
              </div>
            </section>
          </div>

          <div className="flex justify-center pt-8">
            <div className="flex gap-4 justify-center">
            <Link href="/partner-program/register">
              <Button size="lg">Dołącz do Programu Partnerskiego</Button>
            </Link>
              <Link href="/partner-program/privacy">
                <Button variant="outline" size="lg">Polityka Prywatności</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Uproszczony footer */}
      <footer className="border-t bg-muted/40">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Artscore. Wszelkie prawa zastrzeżone.
          </div>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/" className="hover:underline">Strona główna</Link>
            <Link href="/partner-program" className="hover:underline">Program Partnerski</Link>
            <Link href="/partner-program/terms" className="hover:underline">Regulamin</Link>
            <Link href="/partner-program/privacy" className="hover:underline">Polityka Prywatności</Link>
            <Link href="/partner-program/cookies" className="hover:underline">Polityka Cookies</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}