1. # Cel quizu

   Celem quizu jest pomoc użytkownikowi w zidentyfikowaniu stylów wnętrzarskich, które najbardziej mu odpowiadają, oraz wyłonienie konkretnych detali i materiałów, które są dla niego atrakcyjne. Quiz ma być intuicyjny, wizualny i angażujący, a wynik – praktyczny i inspirujący.  
   Dzięki interaktywnej selekcji zdjęć, komentowaniu wybranych fragmentów oraz analizie preferencji, użytkownik otrzymuje spersonalizowane rekomendacje stylów, materiałów i inspiracji do dalszego projektowania wnętrz.

2. # Główne etapy i flow użytkownika

   * ## Wybór pomieszczeń

     Na początku quizu użytkownik wybiera, które pomieszczenia są dla niego istotne. Quiz prezentuje pełną listę przestrzeni mieszkalnych, aby umożliwić personalizację dalszych etapów.  
     **Przykładowa lista do wyboru:**  
* Salon  
* Kuchnia  
* Jadalnia  
* Sypialnia główna  
* Sypialnia dziecięca  
* Sypialnia gościnna  
* Pokój nastolatka  
* Garderoba  
* Gabinet/biuro domowe  
* Pokój do nauki/pracownia  
* Biblioteka/pokój do czytania  
* Pokój multimedialny/home cinema  
* Pokój hobby  
* Pokój fitness/siłownia domowa  
* Łazienka główna  
* Toaleta osobna  
* Łazienka dziecięca  
* Pokój kąpielowy/spa domowe  
* Pralnia/suszarnia  
* Przedpokój/hol  
* Korytarz  
* Wiatrołap  
* Spiżarnia  
* Schowek/gospodarczy  
* Kotłownia/ pom. techniczne  
* Balkon  
* Taras  
* Ogród zimowy  
* Patio  
* Garaż  
* Garaż gym  
* Carport

  Użytkownik może zaznaczyć dowolną liczbę pomieszczeń. Quiz w kolejnych etapach prezentuje tylko zdjęcia i inspiracje związane z wybranymi przestrzeniami.


  * ## Runda 1: Szeroka selekcja stylów

    #### **2.2.1 Interfejs „Tinder-swipe”**

| Gest / przycisk | Znaczenie | Efekt algorytmiczny |
| :---- | :---- | ----- |
| Swipe ► (PRAWO) | „Podoba mi się” | `+2 pkt` dla stylu, `+1 pkt` dla wszystkich tagów materiałów/detali |
| Swipe ◄ (LEWO) | „Nie podoba mi się” | `-2 pkt` dla stylu, `-1 pkt` dla tagów materiałów/detali |
| Tap na obszar | Dodaj komentarz (tekst lub głos – wybór po tapnięciu) | `±3 pkt` dla wskazanego detalu (w zależności od tonu: pozytyw / negatyw) |
| Ikona „🚫 styl” | „Odrzuć styl” | Styl dopisywany do listy *rejectedStyles*; wszystkie kolejne karty tego stylu są z puli usuwane |

Hotspot miejsca kliknięcia zapisywany jest jako `[x, y, w, h, tagDetalu]` – potrzebny przy analizie detali.

---

#### **2.2.2 Konstrukcja początkowej talii zdjęć**

1. **Grupowanie stylów**  
    50+ dostępnych styli łączymy w 18 „klastrów wizualnych”:  
* **Japandi / Scandinavian / Zen / Biophilic**  
* **Minimalist / Simple / Contemporary**  
* **Modern / Luxury / Neoclassic**  
* **Industrial / Loft / Retro futuristic**  
* **Glamour / Hollywood glam / Art deco**  
* **Boho / Boho-chic / Modern boho / Eclectic**  
* **Farmhouse / Cottagecore / French country / Rustic**  
* **Midcentury modern / Vintage / Retro**  
* **Parisian / French / Mediterranean**  
* **Traditional / Baroque / Art nouveau**  
* **Shabby chic / Coastal / Nautical**  
* **Futuristic / Cyberpunk / Vaporwave**  
* **Tropical / Tribal**  
* **Japanese design / Wabi-sabi**  
* **Maximalist / Pop-art**  
* **Eco-friendly / Urban jungle**  
* **Gaming room / Medieval / Gothic**  
* **Seasonal & Special: Hot pink / Easter / Christmas / Halloween / Chinese New Year / Ski chalet / Airbnb / Sketch**  
    
   Cel: każda karta otwiera maksymalną rozpiętość estetyczną.

2. **Losowanie kart startowych**  
    • z każdego klastra jedna karta (18 kart)  
    • dla wybranego przez użytkownika pomieszczenia (jeśli brak – najbliższe funkcjonalnie)  
    • brak opisów na obrazku → unikamy podprogowego sugerowania stylu

3. **Zasada „żadnych powtórek, dopóki każdy klaster nie pokaże co najmniej 1 karty”** – gwarantuje pełne pokrycie styli, zanim algorytm zacznie „wiercić” ulubione.

   ---

   #### **2.2.3 Algorytm selekcji i adaptacyjny dobór kolejnych kart**

   

   

| init:       activeStyles \= {wszystkie style}       rejectedStyles \= {}       score\[style\] \= 0       likedCount\[style\] \= 0       shownCount\[style\] \= 0       deck \= startDeck(18 kart)      loop przez każdą kartę:       pokaz\_kartę(deck.pop())       czekaj\_na\_swipe()          if swipe \== PRAWO:           score\[styl\] \+= 2           likedCount\[styl\] \+= 1       elif swipe \== LEWO:           score\[styl\] \-= 2       if komentarz:           score\[detal\] \+=/+- 3 według tonu          shownCount\[styl\] \+= 1          if user\_tapped\_reject\_style:           activeStyles.remove(styl)           rejectedStyles.add(styl)          if deck puste:           deck \= compose\_next\_deck(activeStyles, score, shownCount)           if stop\_criterion\_met():               break    |
| :---- |

**compose\_next\_deck():**

1. Priorytet – style z najwyższym `score` (top 5\) \+ style jeszcze niepokazane.  
2. Z każdego priorytetowego stylu 1 nowe zdjęcie (+ ewent. 2 z „runner-ups”).  
3. Łącznie 8–10 kart; eliminujemy style z `rejectedStyles`.

   ---

   #### **2.2.4 Ile kart, aby pewnie wskazać 3 dominujące style?**

Heurystyka (empirycznie z testów A/B):

| Parametr | Wartość |
| ----- | :---- |
| P-like (średni odsetek prawych swipe’ów) | ≈ 35 % |
| Minimalne „trafienia” na styl, by uznać go za dominujący | 4 |
| Bezpieczny bufor przewagi nad 4\. miejscem | ≥ 2 like |
| Średnia kart na jedno „trafienie” | 1 / P-like ≈ 2,9 |

\=\> `4 like × 3 style × 2,9 ≈ 35 kart`  
 Zatem **35–40 kart** (3 minuty swajpów) wystarcza, by z 90 % pewnością ustalić top-3 i mieć \> 2 pkt przewagi nad stylem nr 4\.

---

#### **2.2.5 Warunki zatrzymania lub awaryjne ścieżki**

| Sytuacja | Reguła | Działanie |
| :---- | :---- | ----- |
| Top-3 spełnia warunki (≥ 4 like każdy \+ ≥ 2 przewagi) | Stop | Przechodzimy do Rundy 2 (Zawężenie) |
| Pokazano 40 kart, a warunek nie spełniony | Stop hard | Zamiast Rundy 2 przeł. na **wspomagany wybór kolorów / materiałów** |
| ≥ 10 kart pod rząd swipe LEWO | brak pozytywnych sygnałów | Wyświetl modalkę: „Nie trafiamy? → spróbuj innych inspiracji / opisz co lubisz” |
| Użytkownik odrzucił \> 50 % stylów | pula zbyt mała | Dołóż zdjęcia z pozostałych stylów \+ zapytaj o ulubioną funkcję (np. „naturalne światło”, „dużo drewna”) – kieruj tym dobór kart |

---

#### **2.2.6 Dobór zdjęć – zasady jakości i różnorodności**

1. **Zero podpisów** na obrazie.  
2. Rozdzielczość ≥ 1600 px szer. (crop na 1:1 lub 4:5 – opt. dla swipe).  
3. Każdy styl ma min. 12 unikalnych zdjęć na pomieszczenie (starcza na 3 rundę).  
4. Zdjęcia testowane na *first-look appeal* ≥ 60 % w badaniach preferencji (usuwamy słabe assety).  
5. Przed pokazaniem zdjęcia AI sprawdza, czy materiał/detal nie powtarza się w \> 2 ostatnio polubionych kartach – wymusza różnorodność.  
   

   

   ## 2.3. Runda 2: Zawężenie wyboru

   **Cel rundy:**  
    Doprecyzowanie preferencji użytkownika poprzez prezentację zdjęć wyłącznie z tych stylów, które uzyskały najwyższe wyniki w Rundzie 1\. Runda ta pozwala wyłonić 2–3 dominujące style oraz zidentyfikować konkretne materiały i detale, które użytkownik lubi lub odrzuca.  
   ---

   #### **Przebieg rundy:**

1. **Wybór stylów do zawężenia**  
   * System wybiera 3–5 stylów z najwyższą liczbą pozytywnych ocen (swipe w prawo) z Rundy 1\.  
   * Jeśli użytkownik odrzucił większość stylów, do rundy trafiają wszystkie style, które nie zostały odrzucone.  
   * Jeśli po pierwszej rundzie nie wyłoniono żadnych stylów (wszystko na „nie podoba mi się”), system wyświetla pytanie otwarte: „Czego szukasz w aranżacji wnętrza?” i na tej podstawie dobiera kolejną pulę zdjęć do oceny.  
2. **Dobór zdjęć**  
   * Dla każdego wybranego stylu prezentowane są 2–4 zdjęcia na każde wybrane przez użytkownika pomieszczenie.  
   * Jeśli użytkownik wybrał jedno pomieszczenie, zobaczy 6–20 zdjęć (3–5 stylów × 2–4 zdjęcia).  
   * Jeśli wybrał kilka pomieszczeń, liczba zdjęć rośnie proporcjonalnie (np. 3 style × 3 pomieszczenia × 2 zdjęcia \= 18 zdjęć).  
   * **Limit maksymalny:** Jeśli suma zdjęć przekracza 30, system ogranicza liczbę zdjęć na styl/pomieszczenie do 1–2, wybierając najbardziej zróżnicowane aranżacje.  
   * Zdjęcia są zróżnicowane pod względem aranżacji, materiałów i detali, by użytkownik mógł precyzyjnie wskazać, co mu się podoba.  
3. **Mechanika oceny**  
   * Użytkownik ocenia każde zdjęcie gestem „w prawo” (podoba się) lub „w lewo” (nie podoba się).  
   * Może komentować wybrane detale na zdjęciach (kliknięcie w obszar – komentarz tekstowy lub głosowy).  
   * Pod każdym zdjęciem (w wersji przeglądarkowej) dostępne jest pole do wpisania komentarza tekstowego lub nagrania komentarza głosowego, który może dotyczyć zarówno konkretnego detalu, jak i całego stylu/aranżacji.  
   * Komentarze głosowe są automatycznie transkrybowane i analizowane przez moduł konwersacyjny (rozpoznawanie intencji, słów kluczowych, tonu wypowiedzi).  
4. **Analiza detali, materiałów i kontekstu komentarzy**  
   * System analizuje nie tylko wybory „lubię/nie lubię”, ale także treść komentarzy – zarówno tych przypisanych do detali (np. „super lampa”), jak i tych odnoszących się do całego zdjęcia lub stylu (np. „podoba mi się klimat tego wnętrza”, „nie lubię takiej surowości”).  
   * Komentarze są klasyfikowane według kontekstu:  
     * **Komentarz do detalu** – przypisany do konkretnego elementu na zdjęciu (np. lampa, podłoga).  
     * **Komentarz do całości/stylu** – wpisany pod zdjęciem lub wypowiedziany ogólnie, analizowany jako ocena całej aranżacji/stylu.  
   * System przypisuje wagę komentarzom pozytywnym i negatywnym, uwzględniając ich kontekst (np. pozytywny komentarz do stylu podnosi ogólną ocenę stylu, negatywny – obniża).  
5. **Progi decyzyjne – kiedy styl jest odrzucany lub uznany za preferowany**  
   * **Styl zostaje odrzucony**, jeśli użytkownik odrzucił (swipe w lewo) co najmniej 75% zdjęć danego stylu w tej rundzie (np. 3 z 4 lub 2 z 2\) lub dodał wyraźnie negatywny komentarz do stylu.  
   * **Styl zostaje uznany za preferowany**, jeśli użytkownik polubił (swipe w prawo) co najmniej 50% zdjęć danego stylu i minimum 2 zdjęcia z danego stylu zostały ocenione pozytywnie, lub dodał wyraźnie pozytywny komentarz do stylu.  
   * Jeśli styl nie spełnia żadnego z powyższych warunków (np. oceny są mieszane), styl pozostaje w grze, ale z niższym priorytetem w kolejnej analizie.  
6. **Nietypowe sytuacje i obsługa wyjątków**  
   * **Wszystko na „nie podoba mi się”:** System wyświetla pytanie otwarte: „Czego szukasz w aranżacji wnętrza?” i na tej podstawie dobiera nową pulę zdjęć do dogrywki – są to zdjęcia z różnych stylów, ale zgodne z podanymi preferencjami (np. „jasne drewno”, „dużo światła”, „brak metalu”).  
   * **Brak aktywności/niezdecydowanie:** Quiz proponuje pytania otwarte, które pomagają lepiej dopasować zdjęcia do oceny (np. „Czy są jakieś kolory lub materiały, które szczególnie lubisz lub chcesz wykluczyć?”). Na podstawie odpowiedzi system generuje dogrywkę – nową, krótką serię zdjęć (np. 6–10), które odpowiadają wskazanym preferencjom. Użytkownik ocenia je jak wcześniej.  
   * **Wszystko na „podoba mi się”:** System prosi o doprecyzowanie: „Wybrałeś wszystkie inspiracje – czy są jakieś, które podobają Ci się bardziej?” i przechodzi do rundy z detalami/materiałami, by zawęzić preferencje.  
7. **Warunki zakończenia rundy**  
   * Runda kończy się po ocenieniu wszystkich zdjęć (zwykle 9–30 kart, w zależności od liczby stylów i pomieszczeń, z dogrywką jeśli była potrzebna).  
   * Po tej rundzie system wyłania 2–3 dominujące style na podstawie liczby pozytywnych ocen, spełnienia progów decyzyjnych oraz analizy kontekstu komentarzy.

   ---

   #### **Podsumowanie efektu rundy:**

* Wyłonienie 2–3 stylów, które są najbardziej atrakcyjne dla użytkownika (na podstawie jasnych progów decyzyjnych i analizy kontekstu komentarzy).  
* Zidentyfikowanie konkretnych materiałów i detali, które użytkownik lubi lub odrzuca.  
* Uwzględnienie zarówno ocen, jak i komentarzy tekstowych/głosowych – zarówno do detali, jak i do całości stylu.  
* W przypadku braku aktywności lub niezdecydowania, system zawsze przeprowadza dogrywkę z nowo dobranymi zdjęciami, opartą na preferencjach wyrażonych w pytaniach otwartych.  
* Cały proces opiera się wyłącznie na analizie zdjęć i ocen użytkownika, a pytania otwarte służą jedynie lepszemu dopasowaniu kolejnych inspiracji, nigdy nie zastępują analizy wizualnej.

  ## 2.4. Runda 3: Detale i materiały

  **Cel rundy:**  
   Precyzyjne wyłonienie konkretnych materiałów, detali i rozwiązań wizualnych, które najbardziej podobają się użytkownikowi w ramach wybranych wcześniej stylów i pomieszczeń. Runda ta pozwala na dopracowanie rekomendacji i przygotowanie spersonalizowanego zestawu inspiracji.

  ---

  #### **Przebieg rundy:**

1. **Dobór detali i materiałów**  
   * System prezentuje użytkownikowi zbliżenia na detale i materiały pochodzące wyłącznie z 2–3 stylów, które zostały wyłonione w poprzedniej rundzie.  
   * Dla każdego stylu i pomieszczenia prezentowanych jest 5–8 detali (łącznie zwykle 10–24 detale, w zależności od liczby stylów i pomieszczeń).  
   * Detale są wyselekcjonowane z bazy elementów, pogrupowanych według kategorii:

   **Lista detali podlegających ocenie (pogrupowana):**

   **Oświetlenie**

1. Lampa wisząca centralna  
2. Lampa sufitowa (plafon)  
3. Lampa podłogowa  
4. Lampa stołowa  
5. Lampa biurkowa  
6. Lampa nocna  
7. Kinkiet ścienny  
8. Reflektor punktowy  
9. Oświetlenie LED liniowe (widoczne)  
10. Taśma LED podszafkowa (widoczna)  
11. Oświetlenie schodowe (widoczne)  
12. Oświetlenie obrazów  
13. Oświetlenie lustra  
14. Oświetlenie szafkowe (np. pod szafkami kuchennymi)  
15. Oświetlenie sufitowe wpuszczane  
16. Oświetlenie ogrodowe (widoczne w aranżacji tarasu/balkonu)  
17. Oświetlenie tarasowe  
18. Oświetlenie łazienkowe  
19. Oświetlenie z czujnikiem ruchu (jeśli widoczne jako element lampy)  
20. Girlanda świetlna  
    **Podłogi i pokrycia**  
     21\. Parkiet (np. dębowy, jodełka, klasyczny)  
     22\. Panele podłogowe  
     23\. Płytki podłogowe (np. gres, terakota, heksagonalne)  
     24\. Dywan duży  
     25\. Dywanik mały  
     26\. Wykładzina  
     27\. Chodnik do przedpokoju  
     28\. Mata łazienkowa  
     29\. Mata kuchenna  
     30\. Podłoga z żywicy epoksydowej  
     31\. Podłoga z mikrocementu  
     32\. Podłoga z korka  
     33\. Podłoga z marmuru  
     34\. Podłoga z mozaiki  
     35\. Podłoga z desek drewnianych  
    **Tkaniny i tekstylia**  
     36\. Zasłony  
     37\. Firany  
     38\. Rolety rzymskie  
     39\. Rolety dzień-noc  
     40\. Żaluzje poziome  
     41\. Żaluzje pionowe  
     42\. Narzuta na łóżko  
     43\. Koc na sofę  
     44\. Poduszki dekoracyjne  
     45\. Poduszki na krzesła  
     46\. Obrus na stół  
     47\. Bieżnik na stół  
     48\. Ręcznik łazienkowy (widoczny w aranżacji)  
     49\. Ręcznik kuchenny (widoczny w aranżacji)  
     50\. Dywanik łazienkowy  
     51\. Dywanik do przedpokoju  
     52\. Pokrowiec na sofę  
     53\. Pokrowiec na krzesło  
     54\. Zasłona prysznicowa  
     55\. Mata do jogi (jeśli widoczna w aranżacji)  
    **Meble**  
     56\. Sofa  
     57\. Fotel  
     58\. Krzesło  
     59\. Taboret  
     60\. Pufa  
     61\. Łóżko pojedyncze  
     62\. Łóżko podwójne  
     63\. Łóżko piętrowe  
     64\. Łóżko z pojemnikiem (jeśli widoczny)  
     65\. Stół jadalniany  
     66\. Stół kawowy  
     67\. Stół rozkładany  
     68\. Biurko  
     69\. Konsola do przedpokoju  
     70\. Komoda  
     71\. Regał otwarty  
     72\. Regał zamknięty  
     73\. Witryna  
     74\. Szafa ubraniowa  
     75\. Szafa wnękowa (jeśli widoczna)  
     76\. Szafka nocna  
     77\. Szafka RTV  
     78\. Szafka na buty  
     79\. Ława  
     80\. Toaletka  
     81\. Łóżeczko dziecięce  
     82\. Krzesełko dziecięce  
     83\. Biurko dziecięce  
     84\. Stolik nocny  
     85\. Stolik pomocniczy  
    **Kolory i wykończenia ścian**  
     86\. Ściana malowana jednolicie  
     87\. Ściana z akcentem kolorystycznym  
     88\. Tapeta na ścianie  
     89\. Tapeta z wzorem geometrycznym  
     90\. Tapeta z motywem roślinnym  
     91\. Tapeta z motywem dziecięcym  
     92\. Farba tablicowa na ścianie  
     93\. Farba magnetyczna na ścianie  
     94\. Ściana z cegły  
     95\. Ściana z betonu  
     96\. Ściana z paneli drewnianych  
     97\. Ściana z paneli tapicerowanych  
     98\. Ściana z lameli  
     99\. Ściana z płyt gipsowych (jeśli widoczne wykończenie)  
     100\. Ściana z tynkiem strukturalnym  
     101\. Ściana z fototapetą  
     102\. Ściana z korka  
     103\. Ściana z paneli winylowych  
     104\. Ściana z mozaiką  
     105\. Ściana z boazerią  
    **Dekoracje i dodatki**  
     106\. Lustro ścienne  
     107\. Lustro stojące  
     108\. Obraz na ścianie  
     109\. Plakat na ścianie  
     110\. Zegar ścienny  
     111\. Zegar stojący  
     112\. Półka ścienna  
     113\. Półka narożna  
     114\. Regał na książki  
     115\. Wazon na kwiaty  
     116\. Figurka dekoracyjna  
     117\. Świecznik  
     118\. Lampion  
     119\. Donica na rośliny  
     120\. Kosz na pranie  
     121\. Kosz na zabawki  
     122\. Kosz na gazety  
     123\. Makrama na ścianę  
     124\. Girlanda świetlna  
     125\. Sztuczne kwiaty  
     126\. Sztuczne rośliny  
     127\. Panele korkowe (dekoracyjne)  
     128\. Panele z mchu  
     129\. Wieszak ścienny  
     130\. Wieszak stojący  
     131\. Parawan dekoracyjny  
     132\. Organizer na biżuterię  
     133\. Organizer na buty  
     134\. Skrzynia na pościel  
     135\. Pufa do przechowywania  
    **Kuchnia i łazienka**  
     136\. Blat kuchenny (widoczny)  
     137\. Blat łazienkowy (widoczny)  
     138\. Fronty szafek kuchennych  
     139\. Fronty szafek łazienkowych  
     140\. Umywalka nablatowa  
     141\. Umywalka wpuszczana  
     142\. Wanna wolnostojąca  
     143\. Wanna zabudowana  
     144\. Prysznic walk-in  
     145\. Kabina prysznicowa  
     146\. Bateria umywalkowa (widoczna)  
     147\. Bateria wannowa (widoczna)  
     148\. Bateria prysznicowa (widoczna)  
     149\. Zlewozmywak kuchenny  
     150\. Zlewozmywak jednokomorowy  
     151\. Zlewozmywak dwukomorowy  
     152\. Szafki wiszące kuchenne  
     153\. Szafki podblatowe kuchenne  
     154\. Okap kuchenny (widoczny)  
     155\. Płytki ścienne kuchenne  
     156\. Płytki ścienne łazienkowe  
     157\. Płytki podłogowe kuchenne  
     158\. Płytki podłogowe łazienkowe  
     159\. Lustro łazienkowe  
     160\. Grzejnik łazienkowy (dekoracyjny, drabinkowy)  
    **Technologie i funkcje (widoczne elementy)**  
     161\. Gniazdko elektryczne  
     162\. Gniazdko z USB  
     163\. Panel sterowania ogrzewaniem (jeśli widoczny)  
     164\. Wideodomofon (jeśli widoczny)  
     165\. Zasłony automatyczne (jeśli widoczny mechanizm)  
     166\. Czujnik ruchu (jeśli widoczny)  
     167\. System alarmowy (jeśli widoczny panel)  
     168\. Zamek elektroniczny (jeśli widoczny)  
     169\. Stacja ładowania (jeśli widoczna)  
     170\. Głośniki w suficie (jeśli widoczne)  
    **Rośliny i ogrody**  
     171\. Roślina doniczkowa duża  
     172\. Roślina doniczkowa mała  
     173\. Ogród wertykalny (na ścianie)  
     174\. Kwiaty cięte w wazonie  
     175\. Bonsai  
     176\. Sukulent  
     177\. Palma domowa  
     178\. Paproć  
     179\. Zioła w kuchni (widoczne na parapecie/blacie)  
     180\. Trawy ozdobne  
    **Inne**  
     181\. Kominek tradycyjny (widoczny portal/obudowa)  
     182\. Kominek elektryczny (widoczny portal/obudowa)  
     183\. Biokominek (widoczny)  
     184\. Parawan dekoracyjny  
     185\. Wieszak ścienny  
     186\. Wieszak stojący  
     187\. Organizer na buty (jeśli widoczny)  
     188\. Organizer na biżuterię (jeśli widoczny)  
     189\. Skrzynia na pościel (jeśli widoczna)  
     190\. Pufa do przechowywania (jeśli widoczna)  
    ---

2. **Mechanika oceny**  
   * Użytkownik ocenia każdy detal gestem „w prawo” (podoba się) lub „w lewo” (nie podoba się).  
   * Może dodać komentarz tekstowy lub głosowy do wybranego detalu (np. „Chciałbym taką lampę w salonie”, „Nie lubię złotych uchwytów”).  
   * Komentarze mogą dotyczyć zarówno konkretnego detalu, jak i ogólnego wrażenia z danego stylu lub materiału.  
   * Komentarze głosowe są automatycznie transkrybowane i analizowane przez moduł konwersacyjny.  
3. **Zestawienia detali, które ze sobą współgrają**  
   * System posiada bazę powiązań i harmonijnych zestawień detali (np. „jasne drewno \+ lniane zasłony \+ białe ściany” \= styl skandynawski; „czarne matowe baterie \+ beton architektoniczny \+ szkło” \= nowoczesny minimalizm).  
   * Po każdej ocenie system analizuje, które detale użytkownik wybiera w zestawieniu i podpowiada inspiracje, które łączą te elementy w spójną całość.  
   * Jeśli użytkownik wybiera detale z różnych stylów, system proponuje aranżacje eklektyczne lub kompromisowe, pokazując przykłady, jak łączyć wybrane elementy.  
4. **Adaptacyjność**  
   * Jeśli użytkownik konsekwentnie wybiera tylko jeden typ detalu (np. zawsze lampy lub tylko podłogi), system automatycznie poszerza pulę detali o inne kategorie, by upewnić się, że preferencje są kompletne.  
   * Jeśli użytkownik nie ocenia żadnego detalu pozytywnie, system wyświetla pytanie otwarte (np. „Jakie materiały lubisz najbardziej?”) i na tej podstawie dobiera dodatkowe detale do dogrywki.  
5. **Warunki zakończenia rundy**  
   * Runda kończy się po ocenieniu wszystkich detali (zwykle 10–24).  
   * Jeśli użytkownik wszystko akceptuje lub wszystko odrzuca, system wyświetla komunikat i proponuje dodatkowe pytania lub krótką dogrywkę z nowymi detalami, by doprecyzować preferencje.

   ---

   #### **Efekt rundy:**

* Wyłonienie listy materiałów i detali, które użytkownik lubi najbardziej (np. jasne drewno, lniane zasłony, czarne matowe uchwyty).  
* Zidentyfikowanie elementów, które użytkownik odrzuca (np. połyskliwe powierzchnie, złote dodatki).  
* Precyzyjne dopasowanie rekomendacji do indywidualnych preferencji użytkownika.  
* Propozycje harmonijnych zestawień detali i inspiracji, które łączą wybrane elementy w spójną aranżację.  
  ---

  #### **Podsumowanie:**

  Runda 3 pozwala na dogłębną analizę gustu użytkownika na poziomie detali i materiałów, co umożliwia przygotowanie spersonalizowanego zestawu inspiracji i rekomendacji. Dzięki bazie powiązań system podpowiada nie tylko pojedyncze elementy, ale także gotowe zestawienia detali, które ze sobą współgrają i tworzą harmonijną całość.

  ## 2.5. Podsumowanie i rekomendacje

  **Cel etapu:**  
   Przedstawienie użytkownikowi jasnego, spersonalizowanego wyniku quizu – z wyraźnym wskazaniem dominujących stylów, preferowanych materiałów i detali oraz praktycznymi inspiracjami i propozycjami dalszych kroków. Użytkownik otrzymuje możliwość pobrania szczegółowego raportu w formacie PDF.

  ---

  #### **Przebieg i zawartość podsumowania:**

1. **Dominujące style – szczegółowy opis i charakterystyka użytkownika**  
   * System prezentuje 2–3 style, które uzyskały najwyższe wyniki w quizie.  
   * Każdy styl jest opisany bardzo szczegółowo:  
     * charakterystyka i geneza stylu,  
     * kluczowe cechy wizualne,  
     * typowe materiały, kolory, układy,  
     * przykłady aranżacji (galeria zdjęć z quizu lub dodatkowe inspiracje, podlinkowane do konkretnych opisów).  
   * Przy każdym stylu pojawia się sekcja „Dla kogo pasuje ten styl?”, która opisuje typ użytkownika, do którego dany styl jest szczególnie dopasowany (np. „Styl skandynawski polecany jest osobom ceniącym prostotę, jasne wnętrza, funkcjonalność i naturalne materiały. Sprawdzi się u osób aktywnych, rodzin z dziećmi oraz wszystkich, którzy lubią przytulność i minimalizm.”).  
   * Opis stylu jest personalizowany – odnosi się do wyborów użytkownika (np. „Wybrałeś jasne drewno i lniane zasłony, co doskonale wpisuje się w klimat stylu skandynawskiego…”).  
2. **Analiza wyborów i uzasadnienie rekomendacji**  
   * Raport zawiera sekcję, w której autor odnosi się do konkretnych wyborów i komentarzy użytkownika:  
     * cytuje lub parafrazuje wybrane komentarze,  
     * wyjaśnia, dlaczego dany detal, materiał czy kolor został zarekomendowany,  
     * uzasadnia, jak wybory użytkownika wpływają na końcowy efekt aranżacji.  
   * Przykład:  
      „Zaznaczyłeś, że lubisz ciemne ściany i złote dodatki – to połączenie nadaje wnętrzu elegancji i przytulności, typowej dla stylu modern glamour.”  
3. **Szczegółowa lista detali, materiałów, kolorów i elementów składowych**  
   * W raporcie znajduje się tabela lub lista wszystkich wybranych i odrzuconych detali, materiałów i kolorów, z krótkim opisem ich roli w aranżacji.  
   * Każdy element jest opisany pod kątem funkcji, estetyki i potencjalnych korzyści (np. „Lniane zasłony zapewniają naturalny klimat i są łatwe w utrzymaniu czystości”).  
   * Wskazanie, które elementy są typowe dla wybranego stylu, a które stanowią akcent indywidualny.  
   * Przy każdym detalu, materiale lub kolorze, do którego odnosi się opis, znajduje się podlinkowane zdjęcie z quizu (lub miniatura), aby użytkownik mógł łatwo zidentyfikować inspirację.  
4. **Korzyści funkcjonalne i estetyczne**  
   * Raport zawiera sekcję, w której opisane są zalety wybranej konfiguracji:  
     * funkcjonalność (np. „Wybór dużej ilości zamkniętych szafek pozwoli utrzymać porządek w przestrzeni”),  
     * estetyka (np. „Połączenie jasnych podłóg i białych ścian optycznie powiększa wnętrze”),  
     * komfort użytkowania (np. „Miękkie dywany i poduszki zwiększają przytulność sypialni”),  
     * trwałość i łatwość pielęgnacji (np. „Płytki gresowe są odporne na zabrudzenia i wilgoć”).  
5. **Analiza nietypowych lub eklektycznych wyborów**  
   * Jeśli użytkownik wybrał detale, które nie są typowe dla danego stylu lub mogą być trudne do połączenia, raport zawiera:  
     * informację o potencjalnych wyzwaniach aranżacyjnych,  
     * sugestie, w jakich sytuacjach dany element może się sprawdzić (np. „Miedziana lampa stojąca w sypialni jest efektowna, ale wymaga przestrzeni wokół siebie, by nie przytłoczyć wnętrza”),  
     * inspiracje, jak łączyć nietypowe detale z resztą aranżacji (np. „Jeśli chcesz zachować spójność, zestaw miedzianą lampę z dodatkami w ciepłych odcieniach lub naturalnym drewnem”).  
6. **Opis harmonijnych zestawień detali i łączenia stylów**  
   * W raporcie znajduje się sekcja, w której autor podsumowania opisuje przykłady harmonijnych zestawień detali, które współgrają ze sobą w ramach wybranych stylów.  
   * Jeśli użytkownik wybrał więcej niż jeden styl, raport zawiera dedykowany akapit:  
      **„Jak łączyć style, by uzyskać spójny efekt?”**  
      W tej części opisane są zasady i inspiracje dotyczące łączenia konkretnych wybranych przez użytkownika stylów, z odniesieniem do wybranych detali i materiałów.  
   * Opis obejmuje:  
     * które elementy są uniwersalne i mogą być łączone bez ryzyka dysonansu,  
     * które połączenia wymagają szczególnej uwagi (np. kontrastowe kolory, nietypowe materiały),  
     * przykłady sytuacji, w których eklektyczne zestawienia sprawdzą się najlepiej,  
     * ostrzeżenia przed typowymi błędami (np. „Łączenie stylu industrialnego z glamour wymaga umiaru – warto ograniczyć błyszczące dodatki i postawić na jeden dominujący akcent.”).  
7. **Rekomendacje i dalsze kroki**  
   * Propozycje kolejnych działań, np.:  
     * „Przejdź do quizu materiałowego, by doprecyzować wybór materiałów i kolorów.”  
     * „Umów się na konsultację z projektantem.”  
     * „Zapisz wynik i wróć do quizu w dowolnym momencie.”  
8. **Możliwość edycji i powrotu**  
   * Użytkownik może wrócić do wybranych etapów quizu, zmienić ocenę detali lub dodać nowe komentarze, a system natychmiast aktualizuje podsumowanie i rekomendacje.  
9. **Pobranie raportu PDF**  
   * Całość podsumowania i rekomendacji generowana jest w formie atrakcyjnego, czytelnego raportu PDF.  
   * Raport zawiera:  
     * stronę tytułową z nazwą użytkownika/projektu,  
     * szczegółowe opisy stylów i wyborów,  
     * uzasadnienia i analizy,  
     * tabele i listy detali z podlinkowanymi zdjęciami,  
     * sekcję z praktycznymi wskazówkami i inspiracjami,  
     * na końcu raportu – galerię wszystkich zdjęć, które pojawiły się w quizie (z podpisami i odniesieniami do opisów),  
     * datę wygenerowania i opcjonalnie logo marki/projektanta.

   ---

   #### **Efekt etapu:**

* Użytkownik otrzymuje jasny, atrakcyjny wizualnie i merytorycznie raport PDF, który może wykorzystać jako inspirację do dalszych działań projektowych lub przekazać projektantowi.  
* System zapewnia poczucie personalizacji i sprawczości, a także zachęca do kolejnych kroków (np. konsultacji, dalszych quizów).  
* Raport jest nie tylko podsumowaniem, ale również praktycznym narzędziem do planowania i komunikacji w procesie projektowania wnętrza.

## 	2.6. Tryb dla dwojga

	**1\. Tryb „dla dwojga” – wybór na starcie**

* Na początku quizu użytkownicy wybierają tryb: „dla jednej osoby” lub „dla pary”.  
* W trybie dla pary quiz prowadzi dwie równoległe ścieżki oceniania tych samych zdjęć.

  #### **2\. Indywidualna ocena**

* Każda osoba ocenia zdjęcia niezależnie (np. na dwóch urządzeniach, w dwóch oknach lub naprzemiennie na jednym ekranie).  
* Każda osoba może komentować detale, dodawać komentarze tekstowe/głosowe, odrzucać style itd.  
* System zapisuje osobno wybory i komentarze każdej osoby.

  #### **3\. Analiza wyników – szukanie punktów wspólnych**

* System analizuje:  
  * **Wspólne wybory** – style, zdjęcia, detale, które obie osoby polubiły.  
  * **Różnice** – elementy, które jedna osoba zaakceptowała, a druga odrzuciła.  
  * **Unikalne preferencje** – co podoba się tylko jednej osobie.

    #### **4\. Prezentacja kompromisów**

* W kolejnych rundach quiz skupia się na:  
  * Zdjęciach i stylach, które uzyskały pozytywne oceny od obu osób (priorytet).  
  * Detalach i materiałach, które są akceptowalne dla obu stron.  
  * Jeśli nie ma pełnej zgodności, system pokazuje inspiracje łączące elementy z preferencji obu osób (np. styl bazowy jednej osoby z detalami drugiej).  
* Quiz może zaproponować kompromisowe style (np. „Scandi-boho”, „Modern farmhouse”), które łączą cechy preferowane przez obie strony.

  #### **5\. Obsługa konfliktów**

* Jeśli pojawiają się style lub detale, które jedna osoba zdecydowanie odrzuca, system wyklucza je z dalszych propozycji.  
* Jeśli nie ma żadnych wspólnych wyborów, quiz prosi każdą osobę o wskazanie, z czego mogłaby zrezygnować, a co jest absolutnie nie do zaakceptowania.  
* Quiz może zaproponować podział przestrzeni (np. „Salon w stylu X, sypialnia w stylu Y”) lub kompromisowe rozwiązania materiałowe.

  #### **6\. Wynik końcowy**

* Prezentacja stylów, detali i materiałów, które są akceptowalne dla obu osób.  
* Wskazanie elementów, które są „wspólne”, oraz tych, które są „indywidualne” (np. „Oboje lubicie jasne drewno i naturalne tkaniny, ale tylko jedna osoba preferuje industrialne lampy”).  
* Propozycje kompromisowych aranżacji i inspiracji, które łączą preferencje obu stron.

  ---

  #### **Podsumowanie:**

  Quiz dla pary:

* Zbiera i analizuje preferencje każdej osoby osobno.  
* Szuka punktów wspólnych i kompromisów.  
* Wyklucza elementy, które są nieakceptowalne dla którejkolwiek ze stron.  
* Proponuje rozwiązania łączące style, detale i materiały, by zadowolić obie osoby lub podzielić przestrzeń zgodnie z preferencjami.

3. # Algorytm punktowania i logika obsługi skrajnych przypadków

   ## 3.1. Struktura danych

   **Cel:**  
    Zdefiniowanie, jakie dane są gromadzone w systemie quizowym, by umożliwić zaawansowaną analizę preferencji, adaptację algorytmu oraz rozwój narzędzia w przyszłości.  
   ---

   #### **Zakres gromadzonych danych:**

   **1\. Dane sesji użytkownika**  
* Unikalny identyfikator sesji i użytkownika (jeśli dotyczy).  
* Data i godzina rozpoczęcia oraz zakończenia quizu.  
* Typ quizu (indywidualny, para, inny wariant).  
  **2\. Wybory i oceny**  
* Lista wybranych pomieszczeń.  
* czas reakcji, liczba powrotów, zmiany decyzji.  
  **3\. Komentarze i interakcje**  
* Komentarze tekstowe i głosowe (przypisane do konkretnych elementów lub ogólne).  
* Analiza sentymentu komentarzy (pozytywny/negatywny/neutralny).  
* Liczba i długość komentarzy.  
* Słowa kluczowe pojawiające się w komentarzach.  
  **4\. Zachowania behawioralne**  
* Czas spędzony na każdym ekranie/etapie quizu.  
* Sposób interakcji (kliknięcie, gest, przesunięcie, głos).  
* Przerwy w quizie (czas bezczynności, wyjście i powrót do quizu).  
  **5\. Dane dotyczące par (jeśli quiz dla dwóch osób)**  
* Identyfikatory obu użytkowników.  
* Porównanie ocen i komentarzy (zgodność, rozbieżności).  
* Liczba kompromisów i elementów wspólnych.  
* Czas reakcji i zaangażowanie każdej osoby.  
  **6\. Dane techniczne i kontekstowe**  
* Typ urządzenia, system operacyjny, rozdzielczość ekranu.  
* Informacje o urządzeniu i przeglądarce (do analizy UX).  
* Lokalizacja (jeśli użytkownik wyrazi zgodę).  
* Język interfejsu.  
* Źródło wejścia do quizu (np. strona główna, kampania reklamowa).

  ## 3.2. Punktacja

  **Cel:**  
   Określenie zasad przyznawania punktów za wybory użytkownika w quizie, tak aby możliwe było wyłonienie dominujących stylów, detali i materiałów oraz przygotowanie spersonalizowanego raportu. System umożliwia dynamiczną konfigurację parametrów oceny, co pozwala na optymalizację algorytmu na podstawie rzeczywistych danych.

  ---

  #### **Zasady punktacji:**

  **1\. Ocena stylów, detali i materiałów**

* Każdy wybór użytkownika (np. „lubię”/„nie lubię”, przesunięcie w prawo/lewo, kliknięcie) jest rejestrowany i przeliczany na punkty.  
* Pozytywna ocena (np. „lubię”, przesunięcie w prawo): **\+1 punkt** dla danego stylu, detalu lub materiału.  
* Negatywna ocena (np. „nie lubię”, przesunięcie w lewo): **0 punktów** (lub \-1, jeśli system ma rozróżniać aktywne odrzucenie – parametr konfigurowalny).  
* Brak oceny (pominięcie): **nie wpływa na punktację**.  
  **2\. Wzmacnianie punktacji**  
* Jeśli użytkownik powtarza pozytywne wybory dla detali lub materiałów typowych dla danego stylu, suma punktów dla tego stylu rośnie szybciej (np. wybierając kilka detali charakterystycznych dla stylu skandynawskiego, styl ten zyskuje dodatkowe punkty).  
* System może stosować dodatkowe wagi dla powiązanych wyborów – parametr konfigurowalny.  
  **3\. Zmiany decyzji – wpływ na ocenę**  
* Dla każdego stylu, detalu lub materiału liczy się wyłącznie **ostatnia decyzja** użytkownika (np. jeśli użytkownik najpierw zaznaczy „nie lubię”, a potem zmieni na „lubię”, do punktacji trafia tylko „lubię”).  
* **Liczba zmian decyzji** jest rejestrowana dla każdego elementu oraz sumarycznie dla całego quizu.  
* Wysoka liczba zmian decyzji jest interpretowana jako **niska pewność wyboru**; niska liczba zmian – jako **wysoka pewność preferencji**.  
* Progi liczby zmian decyzji (np. niska \= 0–1, średnia \= 2–3, wysoka \= 4+) są **konfigurowalne** przez administratora systemu.  
* W raporcie, przy wysokiej liczbie zmian, pojawia się informacja o niepewności wyborów oraz sugestie dogrywki lub dodatkowych inspiracji.  
* System może automatycznie analizować rozkład liczby zmian decyzji wśród wszystkich użytkowników i sugerować optymalne progi.  
  **4\. Punktacja w quizie dla par**  
* Każda osoba ocenia style i detale niezależnie.  
* Wynik końcowy to suma punktów wspólnych (elementy, które obie osoby oceniły pozytywnie) oraz kompromisowych (elementy, które jedna osoba zaakceptowała, a druga nie odrzuciła).  
* W raporcie prezentowane są zarówno elementy wspólne, jak i indywidualne preferencje każdej osoby.  
  **5\. Adaptacyjność punktacji**  
* System może dynamicznie dostosowywać wagę punktów w zależności od liczby ocenionych elementów (np. jeśli użytkownik ocenił bardzo dużo detali, pojedynczy wybór ma mniejszy wpływ na końcowy wynik).  
* W przypadku bardzo rozproszonych wyborów (np. użytkownik wybiera detale z wielu różnych stylów), system może obniżyć pewność rekomendacji i zaproponować dogrywkę lub pytania otwarte.  
  **6\. Elastyczność i optymalizacja**  
* Wszystkie kluczowe parametry punktacji (progi liczby zmian decyzji, wagi punktów, sposób traktowania negatywnych ocen) są **konfigurowalne** przez administratora lub projektanta quizu.  
* System powinien posiadać panel administracyjny umożliwiający testowanie i zmianę tych parametrów bez konieczności modyfikowania kodu.  
* Możliwość wprowadzenia adaptacyjnych progów, które zmieniają się wraz z rosnącą liczbą danych.  
  ---

  #### **Przykład działania punktacji:**

* Użytkownik ocenia 10 zdjęć stylu skandynawskiego pozytywnie i 2 zdjęcia stylu industrialnego pozytywnie.  
* Dodatkowo wybiera 5 detali typowych dla stylu skandynawskiego i 1 detal typowy dla industrialnego.  
* Wynik: styl skandynawski uzyskuje 15 punktów, industrialny 3 punkty.  
* Użytkownik 4 razy zmienia decyzję dotyczącą stylu industrialnego – w raporcie pojawia się informacja o niepewności tego wyboru i sugestia dogrywki.  
* Administrator po analizie danych zmienia próg „wysokiej liczby zmian” z 4+ na 5+, by lepiej dopasować algorytm do zachowań użytkowników.

  ## 3.3. Obsługa skrajnych przypadków

  **Cel:**  
   Zapewnienie płynności działania quizu i sensowności rekomendacji nawet w nietypowych lub trudnych scenariuszach użytkowania, takich jak brak wyraźnych preferencji, odrzucenie wszystkich stylów, bardzo eklektyczne wybory czy brak pozytywnych ocen.

  ---

  #### **1\. Odrzucenie wszystkich stylów w Rundzie 1**

* Jeśli użytkownik odrzuci wszystkie prezentowane style:  
  * System wyświetla komunikat z pytaniem otwartym, np. „Nie znalazłeś nic dla siebie? Opisz, co Ci się podoba lub czego szukasz.”  
  * Możliwość przejścia do quizu detali i materiałów bez wyboru stylu – użytkownik ocenia wyłącznie konkretne elementy, a system na tej podstawie sugeruje potencjalnie pasujące style.  
  * Opcjonalnie: wyświetlenie dodatkowych, mniej popularnych stylów lub inspiracji spoza głównej listy.

  #### **2\. Akceptacja tylko jednego stylu**

* Jeśli użytkownik akceptuje tylko jeden styl:  
  * Quiz przechodzi do dogłębnej analizy detali i materiałów w ramach tego stylu.  
  * System może zaproponować inspiracje eklektyczne lub kompromisowe, jeśli w dalszych etapach pojawią się wybory nietypowe dla danego stylu.

  #### **3\. Wybory eklektyczne lub nietypowe**

* Jeśli użytkownik wybiera detale i materiały charakterystyczne dla różnych, często niekompatybilnych stylów:  
  * W raporcie pojawia się dedykowana sekcja z opisem, jak łączyć wybrane elementy, by uzyskać spójny efekt.  
  * System podkreśla, które detale są uniwersalne, a które wymagają szczególnej uwagi przy łączeniu.  
  * Możliwość wyświetlenia ostrzeżenia lub inspiracji pokazujących udane eklektyczne aranżacje.

  #### **4\. Brak pozytywnych ocen detali**

* Jeśli użytkownik nie oceni pozytywnie żadnego detalu lub materiału:  
  * System zadaje pytanie otwarte (np. „Jakie materiały lubisz najbardziej?”) lub proponuje dogrywkę z nowymi detalami.  
  * Możliwość powrotu do wcześniejszych etapów i ponownego wyboru stylów lub pomieszczeń.

  #### **5\. Brak jednoznacznych preferencji**

* Jeśli wybory użytkownika są bardzo rozproszone i nie pozwalają na wyłonienie dominującego stylu:  
  * System informuje o niejednoznaczności wyników i sugeruje powtórzenie quizu, dogrywkę lub konsultację z projektantem.  
  * W raporcie pojawia się informacja o szerokim spektrum inspiracji i propozycja dalszego doprecyzowania preferencji.

  #### **6\. Wysoka liczba zmian decyzji**

* Jeśli użytkownik wielokrotnie zmienia decyzje dotyczące stylów lub detali:  
  * W raporcie pojawia się informacja o niepewności wyborów.  
  * System może zaproponować dodatkowe inspiracje, dogrywkę lub pytania otwarte, by pomóc użytkownikowi w podjęciu decyzji.

  #### **7\. Przerwanie quizu**

* Jeśli użytkownik przerwie quiz na dłużej (np. wyjdzie z aplikacji lub nie podejmuje działań przez określony czas):  
  * System zapisuje postęp i umożliwia powrót do quizu w dowolnym momencie.  
  * Po powrocie użytkownik otrzymuje przypomnienie, na jakim etapie zakończył quiz.

  ## 3.4. Adaptacyjność

  **Cel:**  
     Zapewnienie, by quiz dynamicznie dostosowywał się do zachowań i wyborów użytkownika, zwiększając trafność rekomendacji oraz komfort korzystania z narzędzia.

  ---

  #### **1\. Dynamiczne dostosowanie pytań i materiałów**

* System analizuje na bieżąco wybory użytkownika (np. preferowane style, detale, materiały) i na tej podstawie:  
  * Zawęża lub poszerza pulę prezentowanych zdjęć i detali.  
  * Jeśli użytkownik konsekwentnie wybiera tylko jedną kategorię detali (np. wyłącznie oświetlenie), system automatycznie wprowadza do quizu inne kategorie, by uzyskać pełniejszy obraz preferencji.  
  * W przypadku braku jednoznacznych wyborów, system proponuje dogrywkę lub pytania otwarte.

  #### **2\. Reagowanie na zachowania nietypowe**

* Jeśli użytkownik często wraca do wcześniejszych etapów lub wielokrotnie zmienia decyzje:  
  * System może wyświetlić komunikat zachęcający do spokojnego przejrzenia inspiracji lub zaproponować krótką dogrywkę z nowymi przykładami.  
  * W przypadku bardzo rozproszonych wyborów, system sugeruje konsultację z projektantem lub powtórzenie quizu.

  #### **3\. Personalizacja ścieżki quizu**

* Na podstawie wcześniejszych wyborów, quiz może:  
  * Skracać lub wydłużać liczbę prezentowanych pytań (np. jeśli preferencje są bardzo wyraźne, quiz kończy się szybciej; jeśli są niejednoznaczne – pojawia się więcej pytań).  
  * Dostosowywać poziom szczegółowości pytań (np. jeśli użytkownik wykazuje duże zainteresowanie detalami, quiz pogłębia tematykę materiałów i wykończeń).

  #### **4\. Adaptacyjne raportowanie**

* Raport końcowy jest generowany w oparciu o rzeczywiste zachowania użytkownika:  
  * Jeśli wybory były pewne i spójne – rekomendacje są jednoznaczne.  
  * Jeśli pojawiło się wiele zmian decyzji lub rozproszone wybory – raport zawiera ostrzeżenia o niepewności i propozycje dalszych kroków.

  #### **5\. Uczenie się na podstawie danych**

* System może analizować zbiorcze dane z wielu sesji, by:  
  * Optymalizować algorytm doboru pytań i materiałów.  
  * Automatycznie dostosowywać progi punktacji, liczbę pytań dogrywki, zakres inspiracji itp.  
  * Wprowadzać nowe style, detale lub mechanizmy na podstawie rzeczywistych potrzeb użytkowników.

4. # UX/UI – kluczowe elementy

   ### **Cel:**

Stworzenie interfejsu, który jest intuicyjny, atrakcyjny wizualnie, dostępny dla szerokiego grona użytkowników i wspiera adaptacyjność oraz skuteczność quizu.

---

### **4.1 Przejrzystość i prostota interfejsu**

* Minimalistyczny, nowoczesny design z dużą ilością przestrzeni i czytelną typografią.  
* Jasna, logiczna nawigacja – użytkownik zawsze wie, na jakim etapie quizu się znajduje i co powinien zrobić dalej.  
* Duże, wyraźne zdjęcia detali, stylów i materiałów, z możliwością powiększenia.  
* Widoczny postęp quizu (np. pasek postępu, liczba pytań do końca).

  ### **4.2 Intuicyjne mechanizmy wyboru**

* Ocenianie zdjęć i detali za pomocą prostych gestów (przesunięcie w prawo/lewo) lub kliknięć.  
* Jasne oznaczenia wyborów (np. „lubię”/„nie lubię” z ikonami).  
* Możliwość szybkiego cofnięcia lub zmiany decyzji.  
* Komentarze tekstowe lub głosowe przypisane do konkretnych elementów.

  ### **4.3 Personalizacja i adaptacyjność**

* Dynamiczne dostosowywanie interfejsu do preferencji użytkownika (np. skracanie quizu przy wyraźnych wyborach, dogrywka przy niejednoznacznych).  
* Wyświetlanie podpowiedzi i komunikatów kontekstowych (np. „Nie możesz się zdecydować? Zobacz więcej inspiracji\!”).  
* Możliwość wyboru trybu quizu (indywidualny, dla pary).

  ### **4.4 Dostępność i inkluzywność**

* Zgodność z wytycznymi WCAG (dostępność dla osób z niepełnosprawnościami).  
* Kontrastowe kolory, duże przyciski, czytelne fonty.  
* Alternatywne opisy zdjęć dla osób niewidomych i słabowidzących.  
* Obsługa klawiatury i czytników ekranu.

  ### **4.5 Responsywność**

* Pełna responsywność – quiz działa płynnie na komputerach, tabletach i smartfonach.  
* Automatyczne dostosowanie układu do rozmiaru ekranu.

  ### **4.6 Informacja zwrotna i wsparcie**

* Natychmiastowa informacja zwrotna po każdej akcji użytkownika (np. animacja po przesunięciu zdjęcia, potwierdzenie zapisu komentarza).  
* Komunikaty o błędach i podpowiedzi, jak je rozwiązać.  
* Możliwość kontaktu z pomocą techniczną lub projektantem (np. formularz kontaktowy, czat).

  ### **4.7 Estetyka i spójność wizualna**

* Spójna kolorystyka i styl graficzny na wszystkich ekranach.  
* Wysokiej jakości zdjęcia i grafiki.  
* Dbałość o detale wizualne (np. animacje, mikrointerakcje).


5. # Dobór i prezentacja materiałów

   ### **Cel:**

Zapewnienie, by prezentowane w quizie zdjęcia, detale i materiały były czytelne, inspirujące, jednoznacznie identyfikowalne oraz adekwatne do wybranych stylów i pomieszczeń.

---

### **5.1 Kryteria doboru materiałów i zdjęć**

* Każdy prezentowany materiał, detal lub inspiracja musi być:  
  * **Widoczny i rozpoznawalny** na zdjęciu (np. lampa, podłoga z drewna, zasłona, blat kuchenny).  
  * **Przypisany do konkretnego stylu lub kilku stylów** (np. jasne drewno – skandynawski, boho; czarne matowe lampy – industrialny, nowoczesny).  
  * **Odpowiedni do danego pomieszczenia** (np. płytki łazienkowe nie pojawiają się w quizie dotyczącym salonu).  
  * **Wysokiej jakości** – zdjęcia muszą być ostre, dobrze oświetlone, bez zakłóceń i nieczytelnych fragmentów.  
  * **Zgodny z aktualnymi trendami** – baza materiałów powinna być regularnie aktualizowana.

  ### **5.2 Struktura bazy materiałów**

* Każdy materiał/detal posiada:  
  * Unikalny identyfikator.  
  * Nazwę i krótki opis.  
  * Przypisanie do stylów i pomieszczeń.  
  * Zestaw zdjęć referencyjnych (w różnych aranżacjach).  
  * Tagowanie pod kątem funkcji (np. oświetlenie, tekstylia, meble).  
  * Informację o uniwersalności lub wyjątkowości (czy pasuje do wielu stylów, czy jest charakterystyczny dla jednego).

  ### **5.3 Prezentacja w quizie**

* Materiały i detale prezentowane są w formie dużych, wyraźnych zdjęć z krótkim opisem.  
* Możliwość powiększenia zdjęcia i obejrzenia go w kontekście całej aranżacji.  
* Przy każdym detalu/materiału – opcja dodania komentarza lub zaznaczenia, w jakim pomieszczeniu użytkownik chciałby go zastosować.  
* W quizie pojawiają się tylko te materiały, które są możliwe do oceny wizualnej (nie prezentujemy np. ogrzewania podłogowego czy ukrytych instalacji).

  ### **5.4 Personalizacja doboru materiałów**

* System dynamicznie dobiera materiały do prezentacji na podstawie:  
  * Wybranych wcześniej stylów i pomieszczeń.  
  * Dotychczasowych ocen użytkownika (np. jeśli użytkownik konsekwentnie odrzuca dany typ detalu, system ogranicza jego prezentację).  
  * Preferencji wyrażonych w komentarzach.  
* W przypadku braku jednoznacznych preferencji – system prezentuje szerokie spektrum inspiracji, by pomóc użytkownikowi w podjęciu decyzji.

  ### **5.5 Aktualizacja i rozwój bazy materiałów**

* Baza materiałów powinna być regularnie aktualizowana o nowe trendy, produkty i inspiracje.  
* Możliwość dodawania nowych zdjęć, stylów i detali przez administratora lub projektanta.  
* System może analizować popularność poszczególnych materiałów i na tej podstawie proponować aktualizacje bazy.


6. # Przykład interakcji użytkownika (symulacja)

   ### **Cel:**

Pokazanie, jak użytkownik przechodzi przez kolejne etapy quizu, jakie podejmuje decyzje i jak system reaguje na jego wybory – od pierwszego ekranu po otrzymanie raportu.

---

#### **Przykładowy przebieg sesji quizu(sesję można zapauzować w dowolnym momencie i wrócić do niej jak będzie więcej czasu):**

**1\. Ekran powitalny i wybór trybu (pomyśl jak chcesz się  jak chcesz się czuć w swoim nowym domu. Warto być wyspanym, najedzonym, po treningu i włączyć ulubioną muzykę.)**

* Użytkownik widzi krótki opis quizu i wybiera tryb: indywidualny lub dla pary.  
* Po wyborze trybu przechodzi do kolejnego etapu.

**2\. Wybór pomieszczeń**

* Użytkownik zaznacza, które pomieszczenia chce urządzić (np. salon, sypialnia).  
* System przechodzi do prezentacji stylów.

**3\. Runda 1 – Ocena stylów**

* Użytkownik przegląda galerię stylów (np. skandynawski, industrialny, boho).  
* Każdy styl ocenia gestem (przesunięcie w prawo/lewo) lub kliknięciem „lubię”/„nie lubię”.  
* Może dodać krótki komentarz do wybranych stylów.  
* Jeśli odrzuci wszystkie style, system proponuje pytanie otwarte lub przejście do quizu detali.

**4\. Runda 2 – Ocena zestawów materiałów i detali**

* System prezentuje zestawy zdjęć detali i materiałów powiązanych z wybranymi stylami i pomieszczeniami.  
* Użytkownik ocenia poszczególne elementy (np. jasne drewno, czarne lampy, lniane zasłony, betonowe ściany).  
* Może komentować, które detale chciałby zastosować w konkretnym pomieszczeniu.

**5\. Runda 3 – Dogłębna analiza detali**

* Użytkownik ocenia szczegółowe detale (np. rodzaj podłogi, typ oświetlenia, wzór zasłon).  
* System rejestruje czas reakcji, liczbę powrotów, zmiany decyzji, sposób interakcji i ewentualne przerwy.

**6\. Adaptacja quizu**

* Jeśli użytkownik wykazuje niepewność (częste zmiany decyzji, powroty), system proponuje dodatkowe inspiracje lub pytania otwarte.  
* W przypadku wyraźnych preferencji quiz może zakończyć się szybciej.

**7\. Podsumowanie i prezentacja wyniku**

* Po zakończeniu quizu użytkownik otrzymuje raport:  
  * Dominujące style i detale, które najbardziej mu odpowiadają.  
  * Lista wybranych materiałów z podlinkowanymi zdjęciami.  
  * Wskazówki, jak łączyć wybrane elementy.  
  * Informacja o pewności rekomendacji (np. „Twoje wybory były spójne” lub „Wybory były niejednoznaczne – rozważ dogrywkę”).  
  * Propozycje dalszych kroków (np. konsultacja z projektantem, kolejny quiz).

**8\. Opcje po quizie**

* Użytkownik może pobrać raport w PDF, wrócić do quizu, powtórzyć go lub przejść do konsultacji.


7. # Lista stylów wnętrzarskich do wyboru

   ### **Cel:**

Zapewnienie użytkownikowi szerokiego, reprezentatywnego wyboru stylów wnętrzarskich, które odzwierciedlają zarówno klasykę, jak i aktualne trendy oraz umożliwiają precyzyjne dopasowanie quizu do indywidualnych preferencji.

---

### **8.1 Główna lista stylów**

Poniżej znajduje się przykładowa, rozbudowana lista stylów, które mogą być dostępne do wyboru w quizie. Lista powinna być regularnie aktualizowana i może być rozszerzana o nowe trendy.

* Skandynawski  
* Nowoczesny  
* Industrialny  
* Minimalistyczny  
* Boho  
* Glamour  
* Klasyczny  
* Loft  
* Japandi  
* Art déco  
* Retro  
* Vintage  
* Hamptons  
* Modern farmhouse  
* Eklektyczny  
* Śródziemnomorski  
* Rustykalny  
* Urban jungle  
* Mid-century modern  
* Bauhaus  
* Cottagecore  
* Wabi-sabi  
* French country  
* Coastal  
* Transitional  
* Contemporary  
* Memphis  
* Zen  
* High-tech  
* Chalet  
* Tropical

8. # Lista pomieszczeń do wyboru

Umożliwienie użytkownikowi precyzyjnego określenia, które przestrzenie chce urządzić lub przeanalizować, co pozwala na lepsze dopasowanie prezentowanych inspiracji, detali i rekomendacji.

---

### **8.1 Główna lista pomieszczeń**

Poniżej znajduje się przykładowa, szeroka lista pomieszczeń, które mogą być dostępne do wyboru w quizie. Lista powinna być elastyczna i możliwa do rozbudowy w zależności od potrzeb użytkowników i trendów rynkowych.

* Salon  
* Sypialnia  
* Kuchnia  
* Jadalnia  
* Łazienka  
* Przedpokój / Hol  
* Gabinet / Biuro domowe  
* Pokój dziecięcy  
* Pokój młodzieżowy  
* Garderoba  
* Pokój gościnny  
* Pokój hobby / Pracownia  
* Spiżarnia  
* Pralnia  
* Taras / Balkon / Loggia  
* Ogród zimowy  
* Pokój fitness / Siłownia domowa  
* Pokój multimedialny / Kino domowe  
* Pokój rekreacyjny / Sala zabaw  
* Pokój dla seniora  
* Pokój dla niemowlęcia  
* Przestrzeń dla zwierząt (np. kącik dla psa/kota)  
* Garaż  
* Pomieszczenie gospodarcze  
* Piwnica  
* Stryszek / Strych


9. # Mechanizm odrzucania stylów w Rundzie 1

   ### **Cel:**

Umożliwienie użytkownikowi szybkiego i intuicyjnego wyeliminowania stylów, które mu nie odpowiadają, już na początku quizu. Pozwala to na zawężenie dalszych propozycji i lepsze dopasowanie inspiracji do indywidualnych preferencji.

---

### **9.1 Przebieg rundy odrzucania stylów**

* Użytkownik widzi galerię stylów wnętrzarskich, prezentowanych w formie dużych, inspirujących zdjęć z krótkim opisem.  
* Każdy styl można ocenić gestem (przesunięcie w prawo/lewo) lub kliknięciem w przycisk „lubię”/„nie lubię”.  
* Odrzucone style są natychmiast usuwane z dalszych etapów quizu – nie pojawiają się już w kolejnych rundach ani w propozycjach detali i materiałów.  
* Użytkownik może dodać krótki komentarz do każdego stylu (opcjonalnie), co pozwala lepiej zrozumieć powody odrzucenia.  
  ---

  ### **9.2 Obsługa skrajnych przypadków**

* **Odrzucenie wszystkich stylów:**  
   Jeśli użytkownik odrzuci wszystkie dostępne style, system:  
  * Wyświetla pytanie otwarte: „Nie znalazłeś nic dla siebie? Opisz, czego szukasz lub co Ci się podoba.”  
  * Proponuje dodatkowe, mniej popularne lub niszowe style do wyboru.  
  * Umożliwia przejście do quizu detali i materiałów bez wyboru stylu – dalsze etapy opierają się wtedy na ocenach konkretnych elementów, a nie całych stylów.  
* **Zmiana decyzji:**  
   Użytkownik może cofnąć się i przywrócić wcześniej odrzucony styl, jeśli zmieni zdanie.