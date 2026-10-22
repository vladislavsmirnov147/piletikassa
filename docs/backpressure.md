

\# Ülesanne 5 - tagasisurve ja serveri vahemälu



\## Viis teadet, puhver 3



&#x20;   drop\_new   -> \[1, 2, 3]  hoiab VANU

&#x20;   drop\_old   -> \[3, 4, 5]  hoiab UUSI

&#x20;   last\_only  -> \[5]        4 kaotatud

&#x20;   buffer     -> ootel 5    mälu kasvab



Tagasisurve tekib siis, kui server saadab andmeid kiiremini, kui klient suudab neid vastu võtta.



drop\_new säilitab vanemad teated ja jätab uued kõrvale, kui puhver on täis.



drop\_old eemaldab kõige vanema teate, et uus teade mahuks puhvrisse.



last\_only säilitab ainult viimase oleku ning kaotab vahepealsed olekud.



buffer säilitab kõik teated, kuid aeglase kliendi korral võib mälu kasutus piiramatult kasvada.



Piletikassa kohtade saadavuse hetkeseisu jaoks sobib last\_only, sest kliendile on oluline kõige värskem seis, mitte iga vahepealne muudatus.



Kui kõik sündmused peavad kindlasti kohale jõudma, ei tohi neid lihtsalt ära visata. Sellisel juhul on vaja püsivat järjekorda ja võimalust andmeid hiljem uuesti lugeda.



\## Aeglase kliendi sulgemine



WebSocketi bufferedAmount näitab, kui palju andmeid ootab veel saatmist.



Kui see kasvab liiga suureks, võib server aeglase kliendi ühenduse sulgeda.



Meie lahenduses kasutatakse piiri 1 MiB.



See aitab vältida olukorda, kus üks aeglane klient kulutab liiga palju serveri mälu.



bufferedAmount on varajane hoiatus, kuid ühenduse sulgemise piir sõltub rakenduse vajadustest.



\## Kehtetuks muutmine



| viis      | probleem                              |

|-----------|---------------------------------------|

| aeg (TTL) | andmed on kuni TTL-i lõpuni VALED     |

| võti      | pead teadma KÕIKI mõjutatud võtmeid   |

| silt      | -                                     |



TTL määrab, kui kaua kirje vahemälus kehtib.



LRU eemaldab mahupiirangu saavutamisel kõige kauem kasutamata kirje.



Kui kirjet loetakse, muutub see hiljuti kasutatuks ja ei lange esimesena välja.



Võtmepõhine kehtetuks muutmine nõuab kõigi mõjutatud võtmete tundmist.



Sildipõhine kehtetuks muutmine võimaldab eemaldada korraga kõik sama sildiga seotud kirjed.



Näiteks sündmuse event:3 muutumisel saab eemaldada nii sündmuse nimekirja kui ka otsingutulemuste vahemälukirjed.



Sildipõhine kehtetuks muutmine sobib hästi mitme seotud vahemälukirje haldamiseks.



\## Mida ei tohi jagatud vahemällu panna



Salajasi andmeid ei tohi salvestada jagatud vahemällu.



Kasutajapõhised andmed ei sobi jagatud vahemällu, sest need võivad põhjustada andmete lekke.



Näiteks kasutaja isiklikke pileteid ja ostuandmeid ei tohi väljastada teisele kasutajale vahemälust.



Tihti muutuvate avalike andmete jaoks kasutatakse lühikest TTL-i, näiteks 5 sekundit.



Stabiilsete avalike andmete jaoks võib kasutada pikemat TTL-i, näiteks 300 sekundit.



Vahemälu on koopia, mis võib olla aegunud. Seetõttu on oluline õigel ajal kirjed kehtetuks muuta.



\## Piletikassa näide



Piletikassas võib kohtade saadavus kiiresti muutuda.



Reaalajas oleku edastamiseks sobib last\_only, sest klient vajab kõige värskemat kohtade seisu.



Avalikku sündmuste nimekirja võib serveri vahemällu salvestada.



Kui sündmuse andmed muutuvad, saab seotud vahemälukirjed eemaldada sündmuse sildi järgi.



Isiklikud piletid ja kasutajapõhised ostuandmed peavad jääma jagatud vahemälust välja.



\## Proovijooks



Käivitatud käsk:



&#x20;   node materials\\check-cache.js



Tulemus:



&#x20;   30 kontrolli OK



Kõik 30 õpetaja kontrolli läbisid edukalt.



\## Kokkuvõte



Tagasisurve strateegia valik sõltub sellest, milliseid teateid võib kaotada.



Serveri vahemälu aitab vähendada korduvat tööd, kuid nõuab TTL-i, LRU ja kehtetuks muutmise reegleid.



Jagatud vahemällu ei tohi panna salajasi ega kasutajapõhiseid andmeid.



