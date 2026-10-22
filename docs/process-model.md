

\# Ülesanne 6 - protsessimudel mõõdetuna



\## Kerge päringu p95



Mõõtmised tehti 12 loogilise tuumaga arvutis.

Mõõteriist oli õpetaja antud materials/load-tool.js.



| server         | vaikselt | koormuse all | halvenemine |

|----------------|----------|--------------|-------------|

| blokeeriv      | 1,1 ms   | 39,9 ms      | 36,3x       |

| worker\_threads | 0,8 ms   | 1,4 ms       | 1,75x       |



Blokeeriva serveri kerge päringu p95 halvenes

39,9 / 1,1 = 36,3 korda.



worker\_threads-serveri kerge päringu p95 halvenes

1,4 / 0,8 = 1,75 korda.



Blokeeriva serveri puhul tehakse raske arvutus

peamises lõimes. Selle ajal ei saa sündmuste tsükkel

kerget päringut kohe teenindada.



worker\_threads kasutab arvutamiseks eraldi lõime.

Seetõttu saab peamine lõim kergetele päringutele

palju kiiremini vastata.



\## Raskete tööde arv



| server         | raskeid töid |

|----------------|-------------|

| blokeeriv      | 45          |

| worker\_threads | 5           |



Blokeeriv server jõudis testi jooksul teha

45 rasket tööd, worker\_threads-server ainult 5.



worker\_threads-variandis luuakse iga raske päringu

jaoks uus Worker. Uue töölõime käivitamine,

andmete edastamine ja lõpetamine võtavad aega.



See näitab kompromissi: kergete päringute latents

paranes, kuid raskete tööde läbilaskevõime langes.



\## Mõõteriist oli esimesel katsel katki



Õpetaja mõõteriista koodis on selgitatud,

et esimene fetch võttis 47,0 ms,

aga järgmiste päringute mediaan oli 0,7 ms.



Esimene fetch peab looma ühenduse ja valmistama

ette fetch-mehhanismi. See lisakulu ei näita

serveri tegelikku tavapärast vastamisaega.



Ilma soojenduseta võib mõõtmine näidata

mõõteriista käivitamise kulu, mitte serveri latentsi.



Seepärast teeb load-tool.js enne mõõtmist

viis soojenduspäringut.



47,0 ms ja 0,7 ms on õpetaja mõõteriistas

kirjeldatud näitearvud, mitte minu arvuti

eraldi mõõdetud tulemused.



\## Kolm protsessimudelit



| mudel | kuidas töötab | sobiv kasutus |

|-------|---------------|---------------|

| üks protsess | Üks Node.js protsess ja peamine sündmuste tsükkel | Kerged päringud ja I/O |

| cluster | Mitu Node.js protsessi, igaühel oma sündmuste tsükkel | HTTP-päringute jaotamine mitme protsessi vahel |

| worker\_threads | Eraldi töölõimed CPU-mahukate arvutuste jaoks | Rasked arvutused ilma peamist lõime blokeerimata |



Üks protsess on lihtne, kuid CPU-mahukas

sünkroonne töö blokeerib selle sündmuste tsüklit.



cluster võimaldab kasutada mitut protsessi

ja jagada päringuid protsesside vahel.

Ühes protsessis toimuv raske arvutus

blokeerib siiski selle protsessi sündmuste tsüklit.



worker\_threads sobib CPU-mahukate ülesannete jaoks,

sest arvutused saavad töötada eraldi lõimes.



\## Miks on töötajate kogum parem?



Iga päringu jaoks uue Workeri loomine on kulukas.



Töötajate kogum ehk worker pool loob piiratud arvu

töölõimi ette ja kasutab neid korduvalt.



Nii ei pea iga raske päringu jaoks uut töölõime

käivitama ega kohe pärast tööd lõpetama.



Tööde järjekord aitab kontrollida samaaegselt

töötavate ülesannete arvu ja ressursikasutust.



\## Millise mudeli valin Piletikassa jaoks?



Piletikassa tavaliste HTTP-päringute jaoks

valin ühe Node.js protsessi koos asünkroonse I/O-ga.



See sobib ürituste vaatamiseks, tellimuste

töötlemiseks ja andmebaasiga suhtlemiseks.



Kui rakendusse lisanduvad CPU-mahukad ülesanded,

näiteks suurte aruannete arvutamine, kasutan

worker\_threads-mudelit koos töötajate kogumiga.



Suurema HTTP-koormuse korral võib kasutada

ka cluster-mudelit või mitut serveriprotsessi.



\## Kokkuvõte



Mõõtmised näitasid, et blokeeriva serveri

kerge päringu p95 halvenes 36,3 korda,

kuid worker\_threads-serveril ainult 1,75 korda.



Samas tegi blokeeriv server 45 rasket tööd

ja worker\_threads-server 5.



Seega tuleb eristada latentsi ja läbilaskevõimet:

kiirem vastus kergele päringule ei tähenda

automaatselt suuremat raskete tööde arvu.



