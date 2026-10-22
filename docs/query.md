

\# Ülesanne 3 - filter, otsing, sort ja lehekülg



\## Millal viga ja millal vaikeväärtus



| sisend         | tulemus          | miks |

|----------------|------------------|------|

| ?page=abc      | vaikeväärtus 1   | Vigane leheküljenumber ei muuda otsingu tulemuste hulka. |

| ?per=0         | vaikeväärtus 20  | Null ei ole sobiv lehekülje suurus, seega kasutatakse vaikeväärtust. |

| ?min\_price=abc | VISKAB           | Vigase hinnafiltri eiramine näitaks liiga palju sündmusi. |

| ?sort=password | VISKAB           | Tundmatu sortimisväli ei kuulu lubatud väärtuste hulka. |



Kui vigane sisend muudaks tulemuste valikut, tuleb visata viga.

Kui vigane sisend puudutab ainult lehekülje kuvamist, võib kasutada vaikeväärtust.



Päringu ?per=1000000 korral piirab readPage() tulemuse väärtusega PAGE\_MAX = 100.

See kaitseb serverit liiga suurte vastuste eest.



\## Kokku arvutatakse ENNE lehekülge (?per=2\&page=1)



total        4    kõik vasted

rows.length  2    ainult see lehekülg

pages        2



Kõigepealt rakendatakse otsing ja filtrid ning arvutatakse total.

Alles seejärel sorteeritakse tulemused ja võetakse soovitud lehekülg.



Kui total arvutataks pärast lehekülje lõikamist, näeks klient

ainult selle lehekülje ridade arvu ega saaks õigesti kuvada

lehekülgede koguarvu.



\## Stabiilne sortimine



Stabiilne sort: võrdsete korral otsustab id -> \[1, 2, 3] ALATI.



Kui sortimisvälja väärtused on võrdsed, kasutatakse

teisese järjestusena sündmuse id-d.



See annab päringutele kindla järjestuse ja aitab vältida

olukorda, kus sama sündmus ilmub mitmel leheküljel.



Miinusmärk tähendab kahanevat järjestust.

Näiteks -price järjestab sündmused kallimast odavamani.



free on arvutatud väli:



free = seats - sold



Seda ei pea salvestama sündmuse eraldi väljana.



\## Lubatud väljad



SORTABLE sisaldab ainult lubatud sortimisvälju:

id, name, venue, start, price ja free.



FILTERABLE sisaldab lubatud filtreid:

venue, min\_price, max\_price ja free\_at\_least.



Lubatud väärtuste loend on turvalisem kui keelatud väärtuste

loend, sest tundmatud väljad ei jõua sortimise loogikasse.



Kui klient saadab ?sort=password, viskab readSort() vea.

Vea fields.sort nimetab lubatud väärtused, et klient

teaks, kuidas päringut parandada.



\## Päringu plaan ja kihiline arhitektuur



createPlan(query) koostab päringu plaani ega kasuta SQL-i

ega sõltu mälupõhisest repositooriumist.



Plaan sisaldab otsingut, filtreid, sortimist ja

lehekülje andmeid.



Praegu rakendab plaani õpetaja antud apply() mälus

hoitud sündmustele.



Hiljem saab sama plaani kasutada SQL-päringu koostamiseks.

See eraldab kasutaja sisendi tõlgendamise andmete salvestamisest.



\## Tühi tulemus



Kui otsing ei leia ühtegi sündmust, on vastus:



total = 0

pages = 1

rows = \[]



Tühi tulemus ei ole HTTP 404 viga, sest päring ise

oli korrektne. Lihtsalt ükski sündmus ei vastanud tingimustele.



\## Proovijooks



Käivitatud käsk:



node materials\\check-query.js



Tulemus:



34 kontrolli OK



Kõik 34 kontrolli läbisid edukalt.



\## Kokkuvõte



Piletikassa päringutes kasutatakse lubatud väljade loendeid,

kontrollitud filtreid ja piiratud lehekülje suurust.



Tulemuste koguarv arvutatakse enne lehekülgede moodustamist

ning võrdsete sortimisväärtuste korral otsustab id.



Selline lahendus on turvaline, ennustatav ja sobib

hiljem ka SQL-põhise repositooriumiga.



