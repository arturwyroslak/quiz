Oto zredagowany dokument bez pustych linii:

---

**Program partnerski**

**7.1. Logowanie / 7.2. Rejestracja (Zintegrowana strona logowania i rejestracji)**
Opis ekranu: Centralna strona umożliwiająca użytkownikom bezpieczne uwierzytelnienie się w systemie lub założenie nowego konta.
**Elementy ekranu:**
**Główny kontener (Card):**
**Card Header:**
Card Title: "Zaloguj się lub zarejestruj".
Card Description: "Uzyskaj dostęp do portalu ARTSCORE".
**Card Content:**
**Tabs (Zakładki):**
Tabs List (Lista zakładek):
Tabs Trigger: "Logowanie".
Tabs Trigger: "Rejestracja".
**Tabs Content (Zawartość zakładki "Logowanie"):**
Formularz logowania:
Label: "E-mail".
Input: Pole tekstowe na e-mail (type="email", placeholder="[twoj@email.com](mailto:twoj@email.com)").
Label: "Hasło".
Input: Pole tekstowe na hasło (type="password", z ikoną "Pokaż hasło").
Button: "Zaloguj się" (główny przycisk akcji).
Button: "Zapomniałem hasła" (link, variant="link").
Komunikat o błędzie: Wyświetlany pod polem hasła (np. "Nieprawidłowy login lub hasło.").
**Tabs Content (Zawartość zakładki "Rejestracja"):**
Formularz rejestracji (PartnerRegistrationForm):
Nagłówek: "Rejestracja w Programie Partnerskim ARTSCORE".
Pola podstawowe:
Label: "Adres e-mail".
Input: Pole tekstowe na e-mail (type="email").
Label: "Hasło".
Input: Pole tekstowe na hasło (type="password", z ikoną "Pokaż hasło" i opcją "Wygeneruj silne hasło").
Label: "Potwierdź hasło".
Input: Pole tekstowe na potwierdzenie hasła (type="password").
Pola specyficzne dla partnera (rola: 'partner'):
RadioGroup: "Typ partnera". Opcje: "Osoba fizyczna", "Firma".
Label: "Imię i nazwisko osoby kontaktowej".
Input: Pole tekstowe.
Label: "Numer telefonu (opcjonalnie)".
Input: Pole tekstowe (type="tel").
Label: "Adres korespondencyjny (opcjonalnie)".
Input: Pole tekstowe.
Pola dla firm (widoczne przy opcji "Firma"):
Label: "Nazwa firmy".
Input: Pole tekstowe.
Label: "NIP (opcjonalnie)".
Input: Pole tekstowe.
Label: "REGON (opcjonalnie)".
Input: Pole tekstowe.
Label: "Kod polecający (jeśli posiadasz)".
Input: Pole tekstowe (placeholder="Wprowadź kod polecający").
Checkbox: "Akceptuję Regulamin Programu Partnerskiego i Politykę Prywatności."
Button: "Zarejestruj się" (główny przycisk akcji).
Komunikaty o błędach: Wyświetlane pod odpowiednimi polami formularza.

**7.3. Resetowanie hasła**
Opis ekranu: Umożliwia użytkownikom zainicjowanie resetu hasła.
**Elementy ekranu:**
**Główny kontener (Card):**
**Card Header:**
Card Title: "Resetowanie hasła".
Card Description: "Podaj adres e-mail powiązany z Twoim kontem. Wyślemy Ci link do zresetowania hasła."
**Card Content:**
Komunikat systemowy: (np. "Jeśli podany adres e-mail istnieje...").
**Formularz żądania linku resetującego:**
Label: "E-mail".
Input: type="email", placeholder="[twoj@email.com](mailto:twoj@email.com)".
Button: "Wyślij link resetujący".
Button: "Powrót do logowania" (variant="link").
**Formularz ustawiania nowego hasła:**
Label: "Nowe hasło".
Input: type="password", z ikoną i opcją "Wygeneruj silne hasło".
Label: "Potwierdź nowe hasło".
Input: type="password".
Button: "Ustaw nowe hasło".
Komunikaty o błędach.

**Dashboard (Panel Partnera / Pracownika)**
Opis ekranu: Centralny panel użytkownika.
**Elementy ekranu:**
**Header (Sticky):**
Logo ARTSCore.
Dynamiczny tytuł sekcji.
Button: "Nowy kontakt" (ikona Plus).
Sheet Trigger: Awatar użytkownika.
**Sheet (Menu boczne):**
Awatar, imię i nazwisko, rola.
Menu: "Nowe zgłoszenie", "Historia zgłoszeń", "Zarządzanie zespołem", "Raporty".
Button: "Wyloguj się".
**Main Content:**
**Sekcja "Nowe zgłoszenie":**
Ikona Plus.
Nagłówek i opis.
Card z formularzem:
Label: "Imię \*".
Label: "Nazwisko \*".
Label: "E-mail \*".
Label: "Telefon \*".
Label: "Preferencje klienta".
Checkbox: "Zgoda na kontakt \*".
Checkbox: "Zgoda na materiały promocyjne".
Button: "Wyślij zgłoszenie".
Alerty i komunikat sukcesu.
**Sekcja "Historia zgłoszeń":**
Nagłówek i opis.
Card z listą zgłoszeń:
Imię i nazwisko klienta.
Badge: status.
Button: "Szczegóły".
Dane: e-mail, telefon, data, zgłoszone przez, prowizja.
Modal "Szczegóły zgłoszenia".
Komunikat pustej listy.
**Sekcja "Zarządzanie zespołem":**
Nagłówek i opis.
Button: "Dodaj pracownika".
Card z listą:
Imię i nazwisko.
Badge: status.
Dane: e-mail, liczba zgłoszeń, telefon, stanowisko.
Przyciski: "Edytuj", "Zablokuj"/"Aktywuj".
Modal: formularz dodawania pracownika.
**Sekcja "Raporty":**
Nagłówek i opis.
**Karty podsumowujące:**
Łączna prowizja, Ten miesiąc, Zrealizowane zgłoszenia.
**Karta "Generowanie raportu":**
Label: Data od, Data do, Pracownik.
Przyciski: "Pobierz CSV", "Pobierz XLSX".
**Karta "Statystyki zespołu":**
Lista pracowników: imię, nazwisko, liczba zgłoszeń, prowizja, status.

**pages/registration-success.tsx (Strona sukcesu rejestracji)**
Tytuł: "Rejestracja zakończona sukcesem!"
Komunikat: "Dziękujemy za dołączenie...".
Dodatkowy komunikat: "Otrzymasz wiadomość e-mail...".
Przyciski: "Zaloguj się", "Wróć do strony programu partnerskiego".

**7.5. Polityka cookies**
Nagłówek: "Polityka Cookies".
Opis: Czym są cookies i po co są używane.
Sekcje:
Czym są pliki cookies?
Rodzaje używanych cookies.
Cele wykorzystywania cookies.
Podmioty trzecie.
Zarządzanie i usuwanie cookies.
Okres przechowywania.
Dane kontaktowe.
Data ostatniej aktualizacji.
Przyciski/Linki:
Zarządzanie zgodami.
Link do Polityki prywatności.
Link do Regulaminu.
Pobierz PDF.

**7.5. Polityka prywatności**
Nagłówek: "Polityka prywatności".
Sekcje:
Administrator danych.
Zakres i cele.
Podstawa prawna.
Odbiorcy danych.
Prawa użytkownika.
Okres przechowywania.
Cookies (odniesienie do Polityki Cookies).
Zasady bezpieczeństwa.
Przekazywanie danych poza EOG.
Dane kontaktowe IOD.
Skargi do organu nadzorczego.
Przyciski/Linki: "Powrót", Regulamin, PDF.

**7.6. Regulamin**
Nagłówek: "Regulamin".
Sekcje:
Postanowienia ogólne.
Definicje.
Warunki korzystania.
Rejestracja i logowanie.
Prawa i obowiązki użytkownika.
Prawa i obowiązki administratora.
Zasady płatności.
Odpowiedzialność.
Reklamacje.
Zmiany regulaminu.
Warunki szczegółowe.
Postanowienia końcowe.
Data wejścia w życie i wersja.
Przyciski/Linki: "Powrót", Polityka prywatności, PDF.
