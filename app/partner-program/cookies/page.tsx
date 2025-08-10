'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft } from 'lucide-react';

export default function CookiesPolicy() {
  return (
    <div className="min-h-screen bg-background">
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
            <h1 className="text-3xl font-bold tracking-tight">Polityka Cookies</h1>
            <p className="text-muted-foreground">
              Obowiązuje od: 1 czerwca 2024 r.
            </p>
          </div>

          <Separator />

          <div className="space-y-6">
            <section className="space-y-3">
              <p className="text-lg">
                Niniejsza Polityka Cookies wyjaśnia, czym są pliki cookies i jak są wykorzystywane przez serwis ARTSCore. Prosimy o zapoznanie się z tą polityką, aby zrozumieć, jakie informacje zbieramy za pomocą plików cookies i jak je wykorzystujemy.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight">1. Czym są pliki cookies?</h2>
              <div className="space-y-2">
                <p>
                  Pliki cookies (tzw. "ciasteczka") to niewielkie pliki tekstowe, które są przechowywane na urządzeniu końcowym użytkownika (komputerze, tablecie, smartfonie) podczas przeglądania stron internetowych. Zawierają one informacje, które strona internetowa może odczytać podczas kolejnych wizyt użytkownika.
                </p>
                <p>
                  Pliki cookies nie zawierają złośliwego oprogramowania, wirusów ani innych szkodliwych kodów. Nie umożliwiają również dostępu do prywatnych danych użytkownika przechowywanych na jego urządzeniu.
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight">2. Rodzaje używanych cookies</h2>
              <div className="space-y-2">
                <p>
                  W serwisie ARTSCore wykorzystujemy następujące rodzaje plików cookies:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong>Cookies niezbędne</strong> - są absolutnie niezbędne do prawidłowego funkcjonowania strony internetowej. Umożliwiają korzystanie z podstawowych funkcji, takich jak logowanie do serwisu, zapamiętywanie sesji użytkownika, zabezpieczanie transakcji czy wypełnianie formularzy. Bez tych plików cookies strona internetowa nie może działać poprawnie.
                  </li>
                  <li>
                    <strong>Cookies funkcjonalne</strong> - służą do zapamiętywania preferencji użytkownika, takich jak wybór języka, regionu czy rozmiaru czcionki. Dzięki nim strona internetowa może dostosować się do indywidualnych potrzeb użytkownika.
                  </li>
                  <li>
                    <strong>Cookies analityczne</strong> - pozwalają na zbieranie informacji o sposobie korzystania ze strony internetowej, takich jak liczba odwiedzin, źródła ruchu, odwiedzone podstrony czy czas spędzony na stronie. Dzięki nim możemy analizować i poprawiać działanie naszej strony.
                  </li>
                  <li>
                    <strong>Cookies marketingowe</strong> - służą do śledzenia aktywności użytkowników w internecie w celu dostarczania im spersonalizowanych reklam. Tego typu pliki cookies są wykorzystywane tylko za wyraźną zgodą użytkownika.
                  </li>
                </ul>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight">3. Cele wykorzystywania cookies</h2>
              <div className="space-y-2">
                <p>
                  Pliki cookies wykorzystujemy w następujących celach:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Zapewnienie prawidłowego działania serwisu i jego funkcjonalności</li>
                  <li>Utrzymanie sesji użytkownika po zalogowaniu</li>
                  <li>Dostosowanie zawartości strony do preferencji użytkownika</li>
                  <li>Analiza ruchu na stronie w celu poprawy jej działania i funkcjonalności</li>
                  <li>Zapewnienie bezpieczeństwa korzystania z serwisu</li>
                  <li>Personalizacja treści i reklam (za zgodą użytkownika)</li>
                </ul>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight">4. Podmioty trzecie</h2>
              <div className="space-y-2">
                <p>
                  W naszym serwisie mogą być wykorzystywane pliki cookies pochodzące od następujących podmiotów trzecich:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong>Google Analytics</strong> - narzędzie do analizy ruchu na stronie. Polityka prywatności Google: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://policies.google.com/privacy</a>
                  </li>
                  <li>
                    <strong>Facebook Pixel</strong> - narzędzie do analizy skuteczności reklam na Facebooku. Polityka prywatności Facebook: <a href="https://www.facebook.com/policy.php" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://www.facebook.com/policy.php</a>
                  </li>
                </ul>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight">5. Zarządzanie cookies</h2>
              <div className="space-y-2">
                <p>
                  Użytkownik może w każdej chwili dokonać zmiany ustawień swojej przeglądarki, aby zablokować obsługę plików cookies lub każdorazowo uzyskiwać informacje o ich umieszczeniu w swoim urządzeniu. Inne dostępne opcje można sprawdzić w ustawieniach swojej przeglądarki internetowej.
                </p>
                <p>
                  Poniżej znajdują się linki do informacji o zarządzaniu plikami cookies w najpopularniejszych przeglądarkach:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Chrome</a></li>
                  <li><a href="https://support.mozilla.org/pl/kb/ciasteczka" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Mozilla Firefox</a></li>
                  <li><a href="https://support.microsoft.com/pl-pl/microsoft-edge/usuwanie-plik%C3%B3w-cookie-w-przegl%C4%85darce-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Microsoft Edge</a></li>
                  <li><a href="https://support.apple.com/pl-pl/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Safari</a></li>
                  <li><a href="https://help.opera.com/pl/latest/web-preferences/#cookies" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Opera</a></li>
                </ul>
                <p>
                  Należy pamiętać, że ograniczenie stosowania plików cookies może wpłynąć na niektóre funkcjonalności dostępne na naszej stronie internetowej.
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight">6. Okres przechowywania cookies</h2>
              <div className="space-y-2">
                <p>
                  W zależności od rodzaju, pliki cookies mogą być przechowywane na urządzeniu użytkownika przez różny czas:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong>Cookies sesyjne</strong> - są przechowywane na urządzeniu użytkownika do momentu wylogowania, opuszczenia strony internetowej lub zamknięcia przeglądarki.
                  </li>
                  <li>
                    <strong>Cookies stałe</strong> - są przechowywane na urządzeniu użytkownika przez czas określony w parametrach plików cookies lub do momentu ich ręcznego usunięcia przez użytkownika.
                  </li>
                </ul>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight">7. Dane kontaktowe administratora</h2>
              <div className="space-y-2">
                <p>
                  Administratorem danych jest Artscore Sp. z o.o. z siedzibą w Warszawie, ul. Przykładowa 123, 00-000 Warszawa.
                </p>
                <p>
                  W sprawach związanych z plikami cookies oraz ochroną danych osobowych można kontaktować się z nami za pośrednictwem:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>adresu e-mail: privacy@artscore.pl</li>
                  <li>adresu korespondencyjnego: Artscore Sp. z o.o., ul. Przykładowa 123, 00-000 Warszawa</li>
                </ul>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight">8. Zmiany w Polityce Cookies</h2>
              <div className="space-y-2">
                <p>
                  Zastrzegamy sobie prawo do wprowadzania zmian w niniejszej Polityce Cookies. O wszelkich zmianach będziemy informować za pośrednictwem naszej strony internetowej.
                </p>
                <p>
                  Data ostatniej aktualizacji: 1 czerwca 2024 r.
                </p>
              </div>
            </section>
          </div>

          <div className="flex justify-center pt-8 space-x-4">
            <Link href="/partner-program/privacy">
              <Button variant="outline">Polityka Prywatności</Button>
            </Link>
            <Link href="/partner-program/terms">
              <Button variant="outline">Regulamin</Button>
            </Link>
            <Button variant="outline" onClick={() => window.print()}>Pobierz PDF</Button>
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