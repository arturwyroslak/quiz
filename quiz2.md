**1\. Wprowadzenie**

**Cel sekcji:**  
 Krótkie wyjaśnienie, dlaczego zbieramy informacje o stylu życia i funkcjonalności oraz jak wpłyną one na rekomendacje. Quiz pomaga zrozumieć twoje codzienne potrzeby i nawyki, by dopasować funkcjonalne rozwiązania do wnętrz – bez estetyki, bo to obsługuje inny quiz stylu. Skupiamy się na przyczynach (co robisz), nie skutkach (jakie meble).

**Umiejscowienie w quizie:**  
 Ta sekcja pojawia się na początku, po wyborze pomieszczeń (z listy: Salon, Sypialnia, Kuchnia, Jadalnia, Łazienka, Przedpokój / Hol, Gabinet / Biuro domowe, Pokój dziecięcy, Pokój młodzieżowy, Garderoba, Pokój gościnny, Pokój hobby / Pracownia, Spiżarnia, Pralnia, Taras / Balkon / Loggia, Ogród zimowy, Pokój fitness / Siłownia domowa, Pokój multimedialny / Kino domowe, Pokój rekreacyjny / Sala zabaw, Pokój dla seniora, Pokój dla niemowlęcia, Kącik dla zwierząt (np. dla psa/kota), Garaż, Pomieszczenie gospodarcze, Piwnica, Stryszek / Strych). Wybór filtruje pytania, by dla jednego pomieszczenia quiz był krótszy. Pytania adaptują się do scenariuszy (np. jeśli wybrałeś wiele pomieszczeń, algorytm wnioskuje o rozprzestrzenianiu się aktywności jak zabawki w całym domu). Kolejność pytań: od ogólnych (np. liczba osób) do szczegółowych (branching).

**2\. Kategorie funkcjonalności**

**2.1. Styl życia i nawyki użytkownika**

**Opis:**  
 Ta kategoria ma na celu zebranie informacji o codziennych aktywnościach twoich i reszty ekipy w domu, sposobie korzystania z przestrzeni oraz rytmie życia. Dzięki temu lepiej zrozumiemy, jakie funkcjonalne rozwiązania będą praktyczne i komfortowe – np. ile czasu spędzacie w domu, co robicie w poszczególnych pomieszczeniach. Pytania adaptują się do scenariuszy (branching dla złożonych rodzin), wnioskując z wcześniejszych odpowiedzi (np. o dzieciach – nie powtarzamy pytań o ilość). Kolejność: najpierw ogół (liczba osób), potem detale (aktywności, konflikty).

**Przykładowe pytania (z tagami, branchingiem i punktami odniesienia):**

1. Ile osób mieszka w twoim domu? \[Salon, Kuchnia, Jadalnia, Łazienka, Przedpokój / Hol, Gabinet / Biuro domowe, Pokój dziecięcy, Pokój młodzieżowy, Pokój dla seniora, Pokój dla niemowlęcia, Pokój rekreacyjny / Sala zabaw, Pokój gościnny, Pomieszczenie gospodarcze\]  
    *Forma:* Pytanie zamknięte, jednokrotny wybór.  
    *Opcje wyboru:* 1 osoba, 2 osoby, 3-4 osoby, 5 i więcej.  
    *Branching:* Jeśli \>1, follow-up: "Kto to mniej więcej? (np. partner, dzieci, dziadkowie)" – by zrozumieć dynamikę (np. w dużej rodzinie pyta o konflikty aktywności).

2. W jakim wieku są osoby w domu? \[Pokój dziecięcy, Pokój młodzieżowy, Pokój dla seniora, Pokój dla niemowlęcia, Pokój rekreacyjny / Sala zabaw, Salon, Kuchnia, Łazienka, Przedpokój / Hol\]  
    *Forma:* Pytanie zamknięte, wielokrotny wybór.  
    *Opcje wyboru:* Niemowlęta (0-2 lata), małe dzieci (3-10 lat), nastolatki (11-17 lat), dorośli (18-64 lata), seniorzy (65+).  
    *Branching:* Dla każdej wybranej grupy: "Ile osób w tej grupie wiekowej?" (otwarte pole liczbowe).

3. Czy ktoś w domu ma ograniczenia ruchowe lub specjalne potrzeby? \[Łazienka, Pokój dla seniora, Pokój dziecięcy, Pokój dla niemowlęcia, Przedpokój / Hol, Kuchnia, Salon, Pomieszczenie gospodarcze\]  
    *Forma:* Pytanie zamknięte, jednokrotny wybór.  
    *Opcje wyboru:* Tak, nie, nie wiem/nie dotyczy.  
    *Branching:* Jeśli tak, follow-up: "Dla ilu osób i w jakich pomieszczeniach? (np. brak progów w łazience lub przedpokoju)".

4. Czy w domu mieszkają inne osoby, których potrzeby chcesz uwzględnić w rekomendacjach? \[Salon, Kuchnia, Jadalnia, Sypialnia, Gabinet / Biuro domowe, Pokój młodzieżowy, Pokój dla seniora, Łazienka\]  
    *Forma:* Pytanie zamknięte, jednokrotny wybór.  
    *Opcje wyboru:* Tak (wszystkich), tak (wybranych), nie (tylko moje).  
    *Branching:* Jeśli tak, odwołanie do trybu pary (już wybranego na początku quizu) – algorytm agreguje odpowiedzi z trybu pary, wnioskując o wspólnych przestrzeniach i kompromisach (np. elastyczne strefy w salonie).

5. Seria konkretnych pytań o wspólne aktywności (od ogółu: częstotliwość, do szczegółu: konflikty): \[Salon, Kuchnia, Jadalnia, Gabinet / Biuro domowe, Pokój rekreacyjny / Sala zabaw, Pokój hobby / Pracownia, Łazienka\]  
    *Forma:* Kilka zamkniętych/suwakowych pytań.  
    *Opcje wyboru dla każdego:*

   * "Jak często jecie razem posiłki?" \[Kuchnia, Jadalnia\]: Codziennie (7x/tydzień), kilka razy w tygodniu (3-6x), rzadko (\<3x).  
   * "Ile godzin tygodniowo spędzacie razem w jednym pomieszczeniu na relaks?" \[Salon, Pokój multimedialny / Kino domowe\]: 0-5h (mało), 5-15h (średnio), \>15h (dużo).  
   * "Czy macie wspólne hobby w domu, jak gry czy filmy?" \[Pokój rekreacyjny / Sala zabaw, Pokój hobby / Pracownia\]: Tak często (\>3x/tydzień), czasem (1-2x), nie.  
   * "Jak często konflikty o przestrzeń?" \[Gabinet / Biuro domowe, Salon, Łazienka\]: Rzadko (\<1x/tydzień), umiarkowanie (1-3x), często (\>3x).  
      *Branching:* Jeśli odpowiedzi wskazują na różnice (np. konflikty \>3x/tydzień), follow-up: "W jakich sytuacjach i jak sobie radzicie? (np. osobne strefy w salonie)". Jeśli tryb pary – osobne odpowiedzi i porównanie.  
6. Jak bardzo chcesz, by przestrzeń była elastyczna dla różnych potrzeb? \[Salon, Kuchnia, Jadalnia, Sypialnia, Łazienka, Pokój młodzieżowy, Pokój dla seniora, Przedpokój / Hol\]  
    *Forma:* Suwak (1-5).  
    *Opcje wyboru (punkty odniesienia):* 1 (stała, skupiona na głównych aktywnościach), 3 (umiarkowanie elastyczna, np. dla 2-3 osób), 5 (bardzo elastyczna, np. dla 5+ osób z różnymi nawykami).  
    *Branching:* Jeśli \>3, follow-up: "W jakich aspektach? (np. prywatność dla nastolatków w pokoju młodzieżowym)".

7. Ile godzin dziennie średnio spędzacie w tym pomieszczeniu? \[Salon, Pokój multimedialny / Kino domowe, Pokój rekreacyjny / Sala zabaw, Jadalnia, Kuchnia\]  
    *Forma:* Suwak z punktami odniesienia, dostosowany per pomieszczenie (np. "w salonie", "w jadalni" itd.).  
    *Opcje wyboru (punkty odniesienia):* 0-2h (rzadko), 2-4h (umiarkowanie), 4-6h (często), \>6h (bardzo dużo).  
    *Branching:* Jeśli \>4h, follow-up: "Na czym głównie? (np. TV w salonie, posiłki w jadalni, zabawa w pokoju rekreacyjnym)".

8. Czy ty lub ktoś z was pracuje albo uczy się zdalnie? \[Gabinet / Biuro domowe, Salon, Pokój młodzieżowy, Kuchnia, Sypialnia\]  
    *Forma:* Pytanie zamknięte, wielokrotny wybór.  
    *Opcje wyboru:* Nikt, jeden, kilku, wszyscy.  
    *Branching:* Jeśli tak, follow-up: "Ile godzin dziennie średnio? (0-2h, 2-4h, 4-8h, \>8h) i dla ilu osób? (wnioskując z wcześniejszych o wieku)".

9. Seria o preferencjach prywatności (od ogółu: konflikty, do szczegółu: sytuacje): \[Sypialnia, Gabinet / Biuro domowe, Pokój młodzieżowy, Pokój dla seniora, Łazienka, Przedpokój / Hol\]  
    *Forma:* Konkretne pytania.  
    *Opcje wyboru dla każdego:*

   * "Czy konflikty o prywatność? (np. dzielenie sypialni lub kolejki do łazienki)" \[Sypialnia, Pokój młodzieżowy, Łazienka, Przedpokój / Hol\]: Tak często (\>3x/tydzień), umiarkowanie (1-3x), rzadko (\<1x), nie.  
   * "Ile godzin dziennie potrzebujecie ciszy w osobnej strefie?" \[Gabinet / Biuro domowe, Pokój dla seniora\]: 0-2h (mało), 2-4h (umiarkowanie), \>4h (dużo).  
      *Branching:* Jeśli konflikty, follow-up: "Dla ilu osób i jak pogodzić? (np. przegrody w pokoju młodzieżowym lub harmonogram w łazience)".  
10. Czy macie zwierzęta domowe? \[Kącik dla zwierząt, Salon, Sypialnia, Kuchnia, Łazienka, Przedpokój / Hol\]  
     *Forma:* Pytanie zamknięte, jednokrotny wybór.  
     *Opcje wyboru:* Tak (psy), tak (koty), tak (inne), nie.  
     *Branching:* Jeśli tak, follow-up: "Ile i jakie potrzeby w codziennym użytkowaniu? (np. kącik do spania w salonie, odporne podłogi w kuchni)".

11. Jakie są wasze potrzeby co do przechowywania? (od ogółu: typy, do szczegółu: scenariusze) \[Przedpokój / Hol, Garderoba, Spiżarnia, Garaż, Pomieszczenie gospodarcze, Piwnica, Stryszek / Strych\]  
     *Forma:* Wielokrotny wybór.  
     *Opcje wyboru:* Schowane za drzwiami/szafami, pod ręką na otwartych półkach, estetyczne z ukrytymi mechanizmami, sezonowe rotacyjne, bezpieczne zamykane, multifunkcjonalne (zintegrowane z meblami), inne.  
     *Branching:* Follow-up: "Dlaczego i w jakich scenariuszach? (np. szybki dostęp do butów w przedpokoju, rotacyjne w garażu dla sezonowych rzeczy jak rowery)".

12. Czy lubicie otwarte czy wydzielone przestrzenie? \[Salon, Kuchnia, Jadalnia, Przedpokój / Hol, Łazienka\]  
     *Forma:* Wybór obrazkowy.  
     *Opcje wyboru:* Otwarte (np. połączone strefy), wydzielone (np. osobne pokoje), mieszane.  
     *Branching:* Follow-up: "Dlaczego? (np. dla gotowania z rodziną w otwartej kuchni)".

13. Jak ważne jest miejsce do relaksu? \[Salon, Sypialnia, Taras / Balkon / Loggia, Ogród zimowy, Pokój rekreacyjny / Sala zabaw\]  
     *Forma:* Suwak (1-5).  
     *Opcje wyboru (punkty odniesienia):* 1 (sporadyczne \<1h/dzień), 3 (umiarkowane 1-2h/dzień), 5 (codzienne \>2h).  
     *Branching:* Jeśli \>3, follow-up: "Jakie aktywności i dla ilu osób? (np. czytanie na tarasie)".

14. Seria o temperaturze (od ogółu: preferencje, do szczegółu: konflikty): \[Sypialnia, Kuchnia, Gabinet / Biuro domowe, Pokój dla seniora, Salon\]  
     *Forma:* Konkretne pytania.  
     *Opcje wyboru dla każdego:*

    * "Czy macie różne preferencje co do temperatury? (np. jeden lubi chłodno \<20°C, drugi ciepło \>22°C)" \[Sypialnia, Pokój dla seniora, Salon\]: Tak, nie.  
    * "Ile godzin dziennie potrzebujecie stabilnej temperatury w kluczowych przestrzeniach?" \[Kuchnia, Gabinet / Biuro domowe\]: 0-4h, 4-8h, \>8h.  
       *Branching:* Jeśli różnice, follow-up: "Jak pogodzić? (np. osobne sterowanie w sypialni)".  
15. Seria o hałasie (od ogółu: preferencje izolacji, do szczegółu: sytuacje): \[Gabinet / Biuro domowe, Salon, Pokój młodzieżowy, Pokój rekreacyjny / Sala zabaw, Sypialnia, Kuchnia\]  
     *Forma:* Konkretne pytania.  
     *Opcje wyboru dla każdego:*

    * "Czy potrzebujecie izolacji akustycznej w pomieszczeniu? (np. drzwi/drzwi dźwiękoszczelne)" \[Gabinet / Biuro domowe, Sypialnia\]: Tak (bardzo ważna), umiarkowanie, nie.  
    * "Czy hałas od aktywności (np. zabawa dzieci) wpływa na to pomieszczenie?" \[Salon, Pokój rekreacyjny / Sala zabaw, Kuchnia\]: Tak w wielu sytuacjach, czasem, nie.  
       *Branching:* Jeśli tak, follow-up: "W jakich sytuacjach i jak sobie radzicie? (np. maty akustyczne w gabinecie)".  
16. Czy ktoś potrzebuje specjalnych rozwiązań? \[Pokój dla seniora, Łazienka, Pokój dziecięcy, Pokój dla niemowlęcia, Kuchnia, Salon\]  
     *Forma:* Tak/nie.  
     *Opcje wyboru:* Tak, nie.  
     *Branching:* Jeśli tak, follow-up: "Jakie i dla ilu osób? (np. antyalergiczne materiały w łazience, wnioskując z wcześniejszych o alergiach)".

17. Ile godzin tygodniowo korzystacie z przestrzeni zewnętrznych? \[Taras / Balkon / Loggia, Ogród zimowy, Salon\]  
     *Forma:* Suwak.  
     *Opcje wyboru (punkty odniesienia):* 0-5h (rzadko), 5-10h (umiarkowanie), \>10h (często).  
     *Branching:* Jeśli \>5h, follow-up: "Na co? (np. grill lub relaks)".

18. Czy wolicie aktywności w domu czy poza? \[Pokój fitness / Siłownia domowa, Pokój hobby / Pracownia, Pokój rekreacyjny / Sala zabaw, Salon\]  
     *Forma:* Pytanie zamknięte.  
     *Opcje wyboru:* Więcej w domu (\>20h/tydzień), często poza (10-20h), wolimy poza (\<10h).  
     *Branching:* Jeśli w domu, follow-up: "Jakie i dla ilu osób? (np. ćwiczenia w siłowni domowej)".

**Typy pytań:** Wielokrotnego wyboru, suwaki z odniesieniami, branching dla adaptacji.

**Zasady interakcji:** Pytania obowiązkowe, ale branching skraca dla prostych scenariuszy. Możliwość zmian. Wnioskowanie z poprzednich unika duplikatów.

**2.2. Funkcjonalność i wyposażenie wnętrz**

**Opis:**  
 Tu zbieramy info o praktycznych potrzebach – co przechowujecie, jak używacie przestrzeni, z branchingiem dla scenariuszy jak sezonowość czy rozprzestrzenianie (np. zabawki w całym domu). Kolejność: od ogólnych (ilość rzeczy) do szczegółowych (typ sprzętu).

**Pytania (z poprawkami):**

1. Ile rzeczy zazwyczaj przechowujecie? \[Garderoba, Spiżarnia, Garaż, Piwnica, Stryszek / Strych, Pomieszczenie gospodarcze, Przedpokój / Hol\]  
    *Forma:* Suwak.  
    *Opcje wyboru (punkty odniesienia):* \<50 (mało), 50-200 (średnio), \>200 (dużo, z przykładami jak narzędzia czy zapasy).  
    *Branching:* Jeśli \>średnio, follow-up: "Czy to sezonowe? (np. zimowe w strychu)".

2. Jak radzicie sobie z rozrzucanymi zabawkami w całym domu? \[Pokój dziecięcy, Pokój dla niemowlęcia, Pokój rekreacyjny / Sala zabaw, Salon, Kuchnia, Łazienka, Przedpokój / Hol\]  
    *Forma:* Otwarte z sugestiami.  
    *Opcje wyboru:* Schowki w wielu pomieszczeniach, dedykowane kosze, inne rozwiązania, nie dotyczy (jeśli brak dzieci).  
    *Branching:* Follow-up: "Jak często to problem? (codziennie, tygodniowo) i dla ilu dzieci? (wnioskując z wcześniejszych)".

3. Jak wpływa to na meble w różnych pomieszczeniach? \[Kącik dla zwierząt, Salon, Sypialnia, Kuchnia, Łazienka\]  
    *Forma:* Otwarte z sugestiami.  
    *Opcje wyboru:* Drapanie/sierść (potrzeba odpornych materiałów), kąciki do spania, inne potrzeby, nie dotyczy (jeśli brak zwierząt).  
    *Branching:* Follow-up: "Ile zwierząt i jak często? (np. codzienne użycie w salonie)".

4. Czy lubicie często zmieniać układ mebli? \[Salon, Sypialnia, Jadalnia, Kuchnia\]  
    *Forma:* Tak/nie/nie wiem.  
    *Opcje wyboru:* Tak, nie, nie wiem.  
    *Branching:* Jeśli tak, follow-up: "Jak często? (co miesiąc, co rok) i dlaczego? (np. sezonowo)".

5. Czy wolisz meble super wygodne (nawet droższe) czy podstawowe, jeśli używasz sporadycznie? \[Sypialnia, Gabinet / Biuro domowe, Salon, Kuchnia\]  
    *Forma:* Wybór z trade-offem.  
    *Opcje wyboru:* Super wygodne (droższe), podstawowe (tańsze), zależy od pomieszczenia.  
    *Branching:* Follow-up: "Ile godzin dziennie średnio używasz? (dostosowane per pomieszczenie: dla biura \<4h \= sporadycznie, 4-8h \= normalnie, \>8h \= intensywnie; dla kuchni/salonu \<1h \= rzadko, 1-3h \= umiarkowanie, \>3h \= często)".

6. Czy wolisz łatwe sprzątanie kosztem szybszego zużycia materiałów, czy trwałe nawet jeśli trudniejsze w czyszczeniu? \[Kuchnia, Łazienka, Pralnia, Salon, Pokój dziecięcy\]  
    *Forma:* Wybór z trade-offem.  
    *Opcje wyboru:* Łatwe sprzątanie (szybsze zużycie), trwałe (trudniejsze czyszczenie), równowaga.  
    *Branching:* Follow-up: "Ile czasu tygodniowo chcesz poświęcać na sprzątanie? (\<1h \= minimum, 1-3h \= umiarkowanie, \>3h \= dużo)".

7. Czy wolisz proste meble (łatwiejsze w utrzymaniu) czy ozdobne (więcej detali, ale trudniejsze czyszczenie)? \[Salon, Jadalnia, Sypialnia, Kuchnia\]  
    *Forma:* Wybór obrazkowy z trade-offem.  
    *Opcje wyboru:* Proste (łatwiejsze utrzymanie), ozdobne (więcej detali), mieszane.  
    *Branching:* Follow-up: "Dlaczego? (np. jeśli dzieci, proste dla bezpieczeństwa)".

8. Czy macie dużo ubrań i butów? \[Garderoba, Sypialnia, Przedpokój / Hol, Piwnica\]  
    *Forma:* Suwak.  
    *Opcje wyboru (punkty odniesienia):* \<50 sztuk (mało), 50-200 (średnio), \>200 (dużo).  
    *Branching:* Jeśli dużo, follow-up: "Czy sezonowe? (np. zimowe buty w przedpokoju)".

9. Czy macie rzeczy sezonowe? \[Piwnica, Stryszek / Strych, Pokój fitness / Siłownia domowa, Garaż, Pomieszczenie gospodarcze, Taras / Balkon / Loggia\]  
    *Forma:* Tak/nie.  
    *Opcje wyboru:* Tak, nie.  
    *Branching:* Jeśli tak, follow-up: "Jakie, ile i gdzie przechowujecie poza sezonem? (np. narty w garażu, rekomendując stojaki)".

10. Czy potrzebujecie miejsca na sprzęt do sprzątania? \[Pralnia, Pomieszczenie gospodarcze, Kuchnia, Łazienka\]  
     *Forma:* Tak/nie.  
     *Opcje wyboru:* Tak, nie.  
     *Branching:* Jeśli tak, follow-up: "Jak często używany i ile elementów? (np. 5-10 środków czystości w kuchni)".

11. Czy macie dużo dokumentów lub pamiątek? \[Gabinet / Biuro domowe, Salon, Piwnica, Stryszek / Strych\]  
     *Forma:* Tak/nie.  
     *Opcje wyboru:* Tak, nie.  
     *Branching:* Jeśli tak, follow-up: "Ile i jak bezpiecznie przechować? (np. zamykane szuflady w piwnicy)".

12. Czy lubicie wbudowane oświetlenie w meblach? \[Kuchnia, Sypialnia, Garderoba, Łazienka\]  
     *Forma:* Tak/nie.  
     *Opcje wyboru:* Tak, nie.  
     *Branching:* Jeśli tak, follow-up: "Do czego? (np. nocne w sypialni lub w szafach garderoby)".

13. Czy cenicie ukryte schowki? \[Kuchnia, Garderoba, Salon, Pokój dziecięcy\]  
     *Forma:* Tak/nie.  
     *Opcje wyboru:* Tak, nie.  
     *Branching:* Jeśli tak, follow-up: "Dla jakich rzeczy? (np. przyprawy w kuchni lub drobiazgi w salonie)".

14. Jak często macie gości i ile osób? \[Pokój gościnny, Salon, Jadalnia, Kuchnia\]  
     *Forma:* Suwak z punktami odniesienia.  
     *Opcje wyboru (punkty odniesienia):* Co tydzień (często, \>4 osoby), co miesiąc (sporadycznie, 1-3 osoby), rzadko (\<1x/miesiąc, 1 osoba).  
     *Branching:* Follow-up: "Jakie potrzeby? (np. dodatkowe łóżko w pokoju gościnnym lub rozkładana sofa w salonie)".

15. Czy zależy wam na trwałych meblach? (nawet droższych, czy tańszych na krótko, np. dla dzieci) \[Kuchnia, Pokój dziecięcy, Salon, Sypialnia\]  
     *Forma:* Wybór z trade-offem.  
     *Opcje wyboru:* Trwałe (droższe), tańsze na krótko, równowaga.  
     *Branching:* Jeśli tańsze, follow-up: "Dlaczego? (np. dzieci wyrosną i wymienisz)".

16. Czy wolisz naturalne materiały czy łatwe w utrzymaniu? \[Kuchnia, Łazienka, Salon, Jadalnia\]  
     *Forma:* Wybór obrazkowy z trade-offem.  
     *Opcje wyboru:* Naturalne (więcej pielęgnacji), łatwe (szybsze zużycie), mieszane.  
     *Branching:* Follow-up: "Dlaczego? (np. w kuchni dużo gotujecie, więc trwałe)".

17. Czy macie rośliny doniczkowe? \[Ogród zimowy, Taras / Balkon / Loggia, Salon, Sypialnia, Kuchnia, Jadalnia\]  
     *Forma:* Tak/nie.  
     *Opcje wyboru:* Tak, nie.  
     *Branching:* Jeśli tak, follow-up: "Ile (np. \<10 \= mało, \>30 \= dużo) i jakie potrzeby pielęgnacyjne? (np. automatyczne nawadnianie w salonie)".

18. Czy potrzebujecie miejsca na kosmetyki lub środki czystości? \[Łazienka, Pralnia, Kuchnia, Pomieszczenie gospodarcze\]  
     *Forma:* Tak/nie.  
     *Opcje wyboru:* Tak, nie.  
     *Branching:* Jeśli tak, follow-up: "Ile elementów? (np. \<20 butelek/sztuk \= mało, \>50 \= dużo) i czy codzienne użycie?".

19. Ile godzin tygodniowo gotujecie? \[Kuchnia, Jadalnia, Spiżarnia, Salon\]  
     *Forma:* Suwak.  
     *Opcje wyboru (punkty odniesienia):* 0-5h (rzadko), 5-15h (umiarkowanie), \>15h (często).  
     *Branching:* Jeśli \>10h, follow-up: "Dla ilu osób i czy potrzebujecie dużej spiżarni?".

**2.3. Preferencje dotyczące utrzymania i konserwacji**

**Opis:**  
 Tu zbieramy info o sprzątaniu, z trade-offami i branchingiem dla scenariuszy jak dzieci/zwięrzęta. Kolejność: od ogólnych (czas na sprzątanie) do szczegółowych (materiały).

**Pytania (z poprawkami):**

1. Ile godzin tygodniowo macie na sprzątanie? \[Pralnia, Łazienka, Kuchnia, Salon, Pokój dziecięcy\]  
    *Forma:* Suwak.  
    *Opcje wyboru (punkty odniesienia):* 0-2h (mało), 2-5h (średnio), \>5h (dużo).  
    *Branching:* Jeśli mało, follow-up: "Co by pomogło? (np. materiały odporne na plamy w kuchni)".

2. Jak często zabrudzenia od dzieci lub zwierząt? \[Pokój dziecięcy, Kącik dla zwierząt, Salon, Kuchnia, Łazienka\]  
    *Forma:* Suwak.  
    *Opcje wyboru (punkty odniesienia):* Codziennie (intensywne), tygodniowo (umiarkowane), rzadko, nie dotyczy.  
    *Branching:* Follow-up: "W jakich pomieszczeniach? (np. sierść w salonie lub plamy w kuchni)".

3. Czy wolisz łatwe czyszczenie kosztem szybszego zużycia materiałów? \[Kuchnia, Łazienka, Salon, Pokój dziecięcy\]  
    *Forma:* Wybór z trade-offem.  
    *Opcje wyboru:* Łatwe czyszczenie (szybsze zużycie), trwałe (trudniejsze czyszczenie), równowaga.  
    *Branching:* Follow-up: "Dlaczego? (np. w kuchni przy częstym gotowaniu tańsze stracą wygląd)".

4. Czy wolisz naturalne materiały czy łatwe? \[Salon, Kuchnia, Łazienka, Jadalnia\]  
    *Forma:* Wybór obrazkowy z trade-offem.  
    *Opcje wyboru:* Naturalne, łatwe, mieszane.  
    *Branching:* Follow-up: "Trade-off: Więcej pielęgnacji OK, jeśli naturalne?".

5. Czy macie alergie wpływające na materiały? \[Sypialnia, Łazienka, Kuchnia, Salon\]  
    *Forma:* Tak/nie.  
    *Opcje wyboru:* Tak, nie.  
    *Branching:* Jeśli tak, follow-up: "Jakie i dla ilu osób? (np. antypyłowe w sypialni)".

6. Czy wolisz minimalistyczne czy z dekoracjami? \[Salon, Jadalnia, Sypialnia\]  
    *Forma:* Wybór obrazkowy z trade-offem.  
    *Opcje wyboru:* Minimalistyczne (mniej czyszczenia), dekoracyjne (więcej detali), mieszane.  
    *Branching:* Jeśli dekoracyjne, follow-up: "Ile czasu na czyszczenie? (\<1h/tydzień \= OK, 1-2h \= umiarkowanie, \>2h \= dużo)".

7. Jak ważna jest trwałość? (droższa vs. tańsza na krótko) \[Pokój dziecięcy, Kuchnia, Salon, Sypialnia\]  
    *Forma:* Suwak (1-5).  
    *Opcje wyboru (punkty odniesienia):* 1 (OK na 2-3 lata), 3 (5-7 lat), 5 (\>10 lat).  
    *Branching:* Follow-up: "Dla jakich scenariuszy? (np. dzieci wyrosną i wymienisz)".

8. Czy korzystacie z profesjonalnego sprzątania? \[Kuchnia, Łazienka, Salon, Pralnia\]  
    *Forma:* Tak/nie.  
    *Opcje wyboru:* Tak, nie.  
    *Branching:* Jeśli tak, follow-up: "Jak często? (co tydzień, co miesiąc, rzadziej) i w jakich pomieszczeniach?".

9. Czy chcecie łatwe w konserwacji rozwiązania? \[Pralnia, Kuchnia, Łazienka\]  
    *Forma:* Tak/nie.  
    *Opcje wyboru:* Tak, nie.  
    *Branching:* Jeśli tak, follow-up: "Jakie? (np. wymienne elementy w pralni, odporne na wilgoć w łazience)".

10. Czy macie preferencje co do czyszczenia? \[Kuchnia, Łazienka, Salon\]  
     *Forma:* Tak/nie \+ tekst.  
     *Opcje wyboru:* Tak (np. na mokro), tak (odporność na plamy), tak (inne), nie.  
     *Branching:* Jeśli tak, follow-up: "Przykłady i trade-off? (np. plamoodporne, ale droższe)".

11. Czy wolisz materiały nabierające charakteru czy zawsze nowe? \[Salon, Sypialnia, Kuchnia\]  
     *Forma:* Wybór obrazkowy z trade-offem.  
     *Opcje wyboru:* Nabierające charakteru (np. patyna), zawsze nowe, mieszane.  
     *Branching:* Follow-up: "Dlaczego? (np. patyna OK w starym domu, ale nie jeśli dzieci rysują)".

**2.4. Preferencje oświetleniowe i klimatyczne**

**Opis:**  
 Tu info o oświetleniu/klimacie, z branchingiem per scenariusz, fokus na adaptacji (bez niezmiennych jak okna). Kolejność: od ogólnych (ilość światła) do szczegółowych (regulacja).

**Pytania (z poprawkami):**

1. Ile godzin dziennie macie naturalnego światła? \[Ogród zimowy, Taras / Balkon / Loggia, Salon, Kuchnia, Sypialnia\]  
    *Forma:* Suwak.  
    *Opcje wyboru (punkty odniesienia):* 0-4h (mało), 4-8h (średnio), \>8h (dużo).  
    *Branching:* Jeśli mało, follow-up: "Jak adaptujecie? (np. rolety w salonie)".

2. Jakiego sztucznego oświetlenia potrzebujecie? \[Gabinet / Biuro domowe, Kuchnia, Sypialnia, Łazienka\]  
    *Forma:* Wielokrotny wybór.  
    *Opcje wyboru:* Ogólne, punktowe, dekoracyjne, ściemniacze, automatyczne (np. sensory), inne.  
    *Branching:* Follow-up: "Do czego i ile godzin użycia? (np. punktowe do gotowania \>2h/dzień)".

3. Czy wolisz ciepłe, neutralne czy zimne światło? \[Sypialnia, Gabinet / Biuro domowe, Salon, Kuchnia\]  
    *Forma:* Wybór obrazkowy.  
    *Opcje wyboru:* Ciepłe, neutralne, zimne, mieszane.  
    *Branching:* Follow-up: "Dla jakich aktywności? (np. relaks w salonie vs. praca)".

4. Czy macie miejsca wymagające specjalnego oświetlenia? \[Gabinet / Biuro domowe, Kuchnia, Pokój hobby / Pracownia, Łazienka\]  
    *Forma:* Tak/nie \+ opis.  
    *Opcje wyboru:* Tak, nie.  
    *Branching:* Jeśli tak, follow-up: "Ile godzin użycia dziennie? (\<2h \= sporadycznie, 2-4h \= umiarkowanie, \>4h \= często)".

5. Jak ważne jest regulowanie światła? \[Salon, Sypialnia, Gabinet / Biuro domowe, Kuchnia\]  
    *Forma:* Suwak (1-5).  
    *Opcje wyboru (punkty odniesienia):* 1 (stałe OK), 3 (regulacja sporadyczna), 5 (codzienna \>4h).  
    *Branching:* Jeśli \>3, follow-up: "W ilu pomieszczeniach i dlaczego?".

6. Czy macie problemy z wentylacją lub wilgotnością? \[Łazienka, Pralnia, Kuchnia, Ogród zimowy, Sypialnia\]  
    *Forma:* Tak/nie.  
    *Opcje wyboru:* Tak, nie.  
    *Branching:* Jeśli tak, follow-up: "Jak często? (codziennie, sezonowo) i w jakich pomieszczeniach? (np. wilgoć w łazience)".

7. Czy planujecie klimatyzację? \[Sypialnia, Pokój fitness / Siłownia domowa, Gabinet / Biuro domowe, Salon\]  
    *Forma:* Tak/nie.  
    *Opcje wyboru:* Tak, nie.  
    *Branching:* Jeśli tak, follow-up: "Dla ilu pomieszczeń i w jakich scenariuszach? (np. upały w siłowni)".

8. Jak ważna jest stała temperatura? \[Sypialnia, Kuchnia, Gabinet / Biuro domowe, Pokój dla seniora\]  
    *Forma:* Suwak (1-5).  
    *Opcje wyboru (punkty odniesienia):* 1 (zmienne OK), 3 (stabilna 4-8h/dzień), 5 (stabilna \>12h/dzień).  
    *Branching:* Jeśli \>3, follow-up: "W jakich pomieszczeniach?".

9. Seria o preferencjach temperatury (od ogółu: różnice, do szczegółu: pogodzenie): \[Sypialnia, Kuchnia, Pokój dla seniora, Salon\]  
    *Forma:* Konkretne pytania.  
    *Opcje wyboru dla każdego:*

   * "Czy macie różne preferencje co do temperatury? (np. \<20°C vs. \>22°C)" \[Sypialnia, Salon\]: Tak, nie.  
   * "Ile godzin dziennie stabilna temperatura jest kluczowa?" \[Kuchnia, Pokój dla seniora\]: 0-4h, 4-8h, \>8h.  
      *Branching:* Jeśli różnice, follow-up: "Jak pogodzić? (np. osobne sterowanie)".  
10. Czy potrzebujecie indywidualnego sterowania temperaturą? \[Gabinet / Biuro domowe, Sypialnia, Pokój dla seniora\]  
     *Forma:* Tak/nie.  
     *Opcje wyboru:* Tak, nie.  
     *Branching:* Jeśli tak, follow-up: "W jakich scenariuszach? (np. praca zdalna vs. sen)".

11. Czy macie alergie wpływające na wentylację? \[Sypialnia, Łazienka, Kuchnia\]  
     *Forma:* Tak/nie.  
     *Opcje wyboru:* Tak, nie.  
     *Branching:* Jeśli tak, follow-up: "Jakie i dla ilu osób?".

**3\. Logika i wpływ na algorytm rekomendacji**

**Opis:**  
 Odpowiedzi wpływają na rekomendacje poprzez branching i wnioskowanie (np. z liczby osób – elastyczne strefy w wspólnych przestrzeniach). Algorytm waży trade-offy (np. łatwe czyszczenie vs. trwałość) i obsługuje scenariusze (np. sezonowość – rotacyjne przechowywanie).

**Reguły:**

* Filtr per pomieszczenie \+ branching adaptuje (np. dla dużej rodziny – priorytet kompromisów).  
* Wpływ: Wysokie godziny gotowania \-\> trwałe materiały z trade-offem.

**4\. Interakcje użytkownika i UX**

* Branching czyni quiz dynamicznym (krótszy dla solo). Wnioskowanie unika duplikatów; trade-offy dla logiki; kolejność od ogółu do szczegółu.

**6\. Zbieranie i analiza danych**

* Dane z branching agregowane (np. trade-offy \-\> weighted rekomendacje). Analiza scenariuszy (np. rozprzestrzenianie zabawek – globalne schowki).

**7\. Tryb dla pary i analiza kompromisów**

* Osobne ścieżki z trade-offami (np. różnice w temperaturze – kompromisowe rozwiązania); integracja z trybem pary bez dodatkowych linków.

**8\. Obsługa wyjątków**

* Jeśli pytanie traci sens (np. brak dzieci) – pomiń. Tendencyjność unikana trade-offami.  
- 