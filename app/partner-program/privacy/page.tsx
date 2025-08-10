'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AnimatedElement } from '@/components/animations/animated-element';
import { fadeIn, fadeInUp } from '@/components/animations/animation-variants';

export default function PrivacyPolicy() {
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
            <h1 className="text-3xl font-bold tracking-tight">Polityka Prywatności Programu Partnerskiego Artscore</h1>
            <p className="text-muted-foreground">
              Obowiązuje od: 1 czerwca 2024 r.
            </p>
          </div>

          <Separator />

          <div className="space-y-6">
            <section className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight">1. Informacje ogólne</h2>
              <div className="space-y-2">
                <p>
                  1.1. Niniejsza Polityka Prywatności określa zasady przetwarzania i ochrony danych osobowych przekazanych przez Użytkowników w związku z korzystaniem z Programu Partnerskiego Artscore.
                </p>
                <p>
                  1.2. Administratorem danych osobowych jest Artscore Sp. z o.o. z siedzibą w Warszawie, ul. Przykładowa 123, 00-000 Warszawa, wpisana do rejestru przedsiębiorców Krajowego Rejestru Sądowego prowadzonego przez Sąd Rejonowy dla m.st. Warszawy w Warszawie, XIII Wydział Gospodarczy Krajowego Rejestru Sądowego pod numerem KRS 0000000000, NIP 0000000000, REGON 000000000, zwana dalej „Administratorem".
                </p>
                <p>
                  1.3. Dane osobowe przetwarzane są zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych i w sprawie swobodnego przepływu takich danych oraz uchylenia dyrektywy 95/46/WE (ogólne rozporządzenie o ochronie danych), zwanym dalej „RODO".
                </p>
                <p>
                  1.4. Administrator dokłada szczególnej staranności w celu ochrony interesów osób, których dane dotyczą, a w szczególności zapewnia, że zbierane przez niego dane są przetwarzane zgodnie z prawem, zbierane dla oznaczonych, zgodnych z prawem celów i niepoddawane dalszemu przetwarzaniu niezgodnemu z tymi celami.
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight">2. Zakres zbieranych danych</h2>
              <div className="space-y-2">
                <p>
                  2.1. W ramach Programu Partnerskiego Administrator może przetwarzać następujące dane osobowe Partnerów:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>imię i nazwisko,</li>
                  <li>adres e-mail,</li>
                  <li>numer telefonu,</li>
                  <li>adres zamieszkania lub siedziby,</li>
                  <li>nazwa firmy (w przypadku osób prowadzących działalność gospodarczą),</li>
                  <li>NIP (w przypadku osób prowadzących działalność gospodarczą),</li>
                  <li>numer rachunku bankowego,</li>
                  <li>dane logowania do Panelu Partnera (login, hasło w formie zaszyfrowanej),</li>
                  <li>historia aktywności w Panelu Partnera,</li>
                  <li>historia zgłoszonych Leadów,</li>
                  <li>historia wypłat wynagrodzenia.</li>
                </ul>
                <p>
                  2.2. W ramach Programu Partnerskiego Administrator może przetwarzać następujące dane osobowe Leadów zgłoszonych przez Partnerów:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>imię i nazwisko,</li>
                  <li>adres e-mail,</li>
                  <li>numer telefonu,</li>
                  <li>nazwa firmy (w przypadku firm),</li>
                  <li>adres,</li>
                  <li>informacje o potrzebach i zainteresowaniach w zakresie usług Administratora.</li>
                </ul>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight">3. Cele i podstawy przetwarzania danych</h2>
              <div className="space-y-2">
                <p>
                  3.1. Dane osobowe Partnerów przetwarzane są w następujących celach:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>rejestracja i weryfikacja w Programie Partnerskim (podstawa prawna: art. 6 ust. 1 lit. b RODO - wykonanie umowy),</li>
                  <li>zapewnienie dostępu do Panelu Partnera (podstawa prawna: art. 6 ust. 1 lit. b RODO - wykonanie umowy),</li>
                  <li>rozliczenie wynagrodzenia (podstawa prawna: art. 6 ust. 1 lit. b RODO - wykonanie umowy oraz art. 6 ust. 1 lit. c RODO - wypełnienie obowiązku prawnego),</li>
                  <li>komunikacja związana z realizacją Programu Partnerskiego (podstawa prawna: art. 6 ust. 1 lit. b RODO - wykonanie umowy),</li>
                  <li>marketing bezpośredni usług Administratora (podstawa prawna: art. 6 ust. 1 lit. f RODO - prawnie uzasadniony interes Administratora),</li>
                  <li>dochodzenie lub obrona przed roszczeniami (podstawa prawna: art. 6 ust. 1 lit. f RODO - prawnie uzasadniony interes Administratora).</li>
                </ul>
                <p>
                  3.2. Dane osobowe Leadów przetwarzane są w następujących celach:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>kontakt w sprawie oferty Administratora (podstawa prawna: art. 6 ust. 1 lit. a RODO - zgoda osoby, której dane dotyczą lub art. 6 ust. 1 lit. f RODO - prawnie uzasadniony interes Administratora),</li>
                  <li>przygotowanie i przedstawienie oferty (podstawa prawna: art. 6 ust. 1 lit. b RODO - działania zmierzające do zawarcia umowy),</li>
                  <li>zawarcie i realizacja umowy (podstawa prawna: art. 6 ust. 1 lit. b RODO - wykonanie umowy),</li>
                  <li>rozliczenie prowizji dla Partnera (podstawa prawna: art. 6 ust. 1 lit. f RODO - prawnie uzasadniony interes Administratora).</li>
                </ul>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight">4. Okres przechowywania danych</h2>
              <div className="space-y-2">
                <p>
                  4.1. Dane osobowe Partnerów będą przechowywane przez okres uczestnictwa w Programie Partnerskim, a po jego zakończeniu:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>przez okres niezbędny do rozliczenia wynagrodzenia,</li>
                  <li>przez okres przedawnienia roszczeń wynikających z uczestnictwa w Programie Partnerskim,</li>
                  <li>przez okres wymagany przepisami prawa podatkowego i rachunkowego.</li>
                </ul>
                <p>
                  4.2. Dane osobowe Leadów będą przechowywane:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>w przypadku braku zawarcia umowy - przez okres 1 roku od ostatniego kontaktu,</li>
                  <li>w przypadku zawarcia umowy - przez okres trwania umowy oraz przez okres przedawnienia roszczeń wynikających z umowy,</li>
                  <li>przez okres wymagany przepisami prawa podatkowego i rachunkowego.</li>
                </ul>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight">5. Odbiorcy danych</h2>
              <div className="space-y-2">
                <p>
                  5.1. Odbiorcami danych osobowych mogą być:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>podmioty przetwarzające dane na zlecenie Administratora, w tym dostawcy usług IT, dostawcy usług księgowych, dostawcy usług marketingowych,</li>
                  <li>podmioty uprawnione do uzyskania danych na podstawie obowiązującego prawa, np. sądy lub organy ścigania, gdy wystąpią z żądaniem w oparciu o stosowną podstawę prawną.</li>
                </ul>
                <p>
                  5.2. Administrator nie przekazuje danych osobowych do państw trzecich (poza Europejski Obszar Gospodarczy) ani do organizacji międzynarodowych.
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight">6. Prawa osób, których dane dotyczą</h2>
              <div className="space-y-2">
                <p>
                  6.1. Osobom, których dane dotyczą, przysługują następujące prawa:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>prawo dostępu do swoich danych oraz otrzymania ich kopii,</li>
                  <li>prawo do sprostowania (poprawiania) swoich danych,</li>
                  <li>prawo do usunięcia danych (jeżeli nie ma podstaw do ich dalszego przetwarzania),</li>
                  <li>prawo do ograniczenia przetwarzania danych,</li>
                  <li>prawo do przenoszenia danych,</li>
                  <li>prawo do wniesienia sprzeciwu wobec przetwarzania danych (w przypadku przetwarzania na podstawie prawnie uzasadnionego interesu),</li>
                  <li>prawo do cofnięcia zgody na przetwarzanie danych (w przypadku przetwarzania na podstawie zgody),</li>
                  <li>prawo do wniesienia skargi do organu nadzorczego (Prezesa Urzędu Ochrony Danych Osobowych).</li>
                </ul>
                <p>
                  6.2. W celu realizacji powyższych praw należy skontaktować się z Administratorem za pośrednictwem adresu e-mail: privacy@artscore.pl lub pisemnie na adres siedziby Administratora.
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight">7. Bezpieczeństwo danych</h2>
              <div className="space-y-2">
                <p>
                  7.1. Administrator stosuje odpowiednie środki techniczne i organizacyjne zapewniające bezpieczeństwo danych osobowych, w tym ochronę przed niedozwolonym lub niezgodnym z prawem przetwarzaniem oraz przypadkową utratą, zniszczeniem lub uszkodzeniem.
                </p>
                <p>
                  7.2. W celu zapewnienia bezpieczeństwa danych Administrator w szczególności:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>stosuje szyfrowanie danych,</li>
                  <li>zapewnia poufność, integralność, dostępność i odporność systemów i usług przetwarzania,</li>
                  <li>zapewnia zdolność do szybkiego przywrócenia dostępności danych osobowych w razie incydentu fizycznego lub technicznego,</li>
                  <li>regularnie testuje, mierzy i ocenia skuteczność środków technicznych i organizacyjnych mających zapewnić bezpieczeństwo przetwarzania.</li>
                </ul>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight">8. Pliki cookies</h2>
              <div className="space-y-2">
                <p>
                  8.1. Panel Partnera wykorzystuje pliki cookies (ciasteczka), czyli niewielkie informacje tekstowe, przechowywane na urządzeniu końcowym Użytkownika (np. komputerze, tablecie, smartfonie). Szczegółowe informacje znajdują się w <Link href="/partner-program/cookies" className="text-primary hover:underline">Polityce Cookies</Link>.
                </p>
                <p>
                  8.2. Panel Partnera wykorzystuje następujące rodzaje plików cookies:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>cookies sesyjne - są przechowywane na urządzeniu Użytkownika i pozostają tam do momentu zakończenia sesji danej przeglądarki, po tym czasie są trwale usuwane z pamięci urządzenia,</li>
                  <li>cookies trwałe - są przechowywane na urządzeniu Użytkownika i pozostają tam do momentu ich skasowania.</li>
                </ul>
                <p>
                  8.3. Pliki cookies wykorzystywane są w następujących celach:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>utrzymanie sesji Użytkownika (po zalogowaniu),</li>
                  <li>dostosowanie zawartości Panelu Partnera do preferencji Użytkownika,</li>
                  <li>optymalizacja korzystania z Panelu Partnera,</li>
                  <li>zapewnienie bezpieczeństwa korzystania z Panelu Partnera.</li>
                </ul>
                <p>
                  8.4. Użytkownik może w każdej chwili dokonać zmiany ustawień swojej przeglądarki, aby zablokować obsługę plików cookies lub każdorazowo uzyskiwać informacje o ich umieszczeniu w swoim urządzeniu. Inne dostępne opcje można sprawdzić w ustawieniach swojej przeglądarki internetowej.
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight">9. Zmiany Polityki Prywatności</h2>
              <div className="space-y-2">
                <p>
                  9.1. Administrator zastrzega sobie prawo do zmiany niniejszej Polityki Prywatności. O wszelkich zmianach Administrator poinformuje Użytkowników za pośrednictwem Panelu Partnera lub poczty elektronicznej.
                </p>
                <p>
                  9.2. Zmiany Polityki Prywatności wchodzą w życie po upływie 14 dni od dnia poinformowania Użytkowników o zmianach.
                </p>
                <p>
                  9.3. Aktualna wersja Polityki Prywatności jest zawsze dostępna na stronie internetowej Administratora.
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight">10. Kontakt</h2>
              <div className="space-y-2">
                <p>
                  10.1. W sprawach związanych z ochroną danych osobowych można kontaktować się z Administratorem za pośrednictwem:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>adresu e-mail: privacy@artscore.pl,</li>
                  <li>adresu korespondencyjnego: Artscore Sp. z o.o., ul. Przykładowa 123, 00-000 Warszawa.</li>
                </ul>
              </div>
            </section>
          </div>

          <div className="flex justify-center pt-8">
            <div className="flex gap-4 justify-center">
            <Link href="/partner-program/register">
              <Button size="lg">Dołącz do Programu Partnerskiego</Button>
            </Link>
              <Link href="/partner-program/cookies">
                <Button variant="outline" size="lg">Polityka Cookies</Button>
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