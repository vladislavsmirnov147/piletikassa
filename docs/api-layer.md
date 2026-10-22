

\# Ülesanne 5 - API-kiht kliendis



\## Iga erind tuleb välja ApiError-ina



| server andis       | laad    | korratav |

|--------------------|---------|----------|

| 500                | server  | jah      |

| 404                | client  | ei       |

| võrguviga          | network | jah      |

| 200 + vigane JSON  | format  | ei       |

| ajalõpp            | timeout | jah      |

| kutsuja katkestas  | abort   | ei       |



\## Teisendus piiril



server    { start: "2026-10-04T19:00", seats: 420, sold: 118 }



rakendus  { start: Date, free: 302, soldOut: false }



free on ARVUTATUD - server teda ei saada, sest ta on tuletatav



\## Minu selgitus



API-kiht eraldab kasutajaliidese serveriga suhtlemisest. Komponendid ei pea teadma, kuidas HTTP-päringuid tehakse või kuidas server veateateid tagastab.



Kõik vead teisendatakse `ApiError` objektideks. Nii saab rakendus ühtemoodi käsitleda võrguvigu, serverivigu, vigast JSON-i, ajalõppu ja kasutaja katkestamist.



Funktsioon `toEvent()` teisendab serveri andmed rakendusele sobivaks. Näiteks arvutatakse vabade kohtade arv valemiga:



&#x20;   free = seats - sold

&#x20;   free = 420 - 118 = 302



Kui kõik kohad on müüdud, muutub `soldOut` väärtuseks `true`.



Funktsioon `makeApi()` koondab päringud ühte kohta. See muudab koodi lihtsamaks, sest kasutajaliides ei pea otse `fetch()` funktsiooni kasutama.



\## Kontrollimine



Kontrollimiseks kasutasin käsku:



&#x20;   node materials\\check-api.js



Praegune tulemus: 29 kontrolli OK, 1 KATKI.



Parandamist vajab renderdusviiside `roundTrips` kontroll.









\## Mis kuulub API-kihti ja mis EI kuulu?



API-kihti kuuluvad HTTP-päringute tegemine, URL-ide koostamine, päringumeetodite ja päiste määramine, ajalõpu käsitlemine, vigade teisendamine ApiError-iks ning serveri andmete teisendamine rakendusele sobivaks.



API-kihti EI kuulu HTML-i loomine, nuppude kujundamine, kasutajaliidese sündmuste käsitlemine ega otsustamine, kuidas andmeid ekraanil näidata.



Näiteks `makeApi()` saadab päringud ja `toEvent()` arvutab vabade kohtade arvu. Kasutajaliides saab juba valmis andmed ning otsustab ise, kuidas neid kuvada.



Ajalõpp ja `Accept: application/json` on määratud ühes kohas, et neid ei peaks iga API-meetodi juures eraldi kordama.





