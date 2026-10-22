\# Ülesanne 3 - Express: marsruudid ja vahevara



\## Süsititud defektid ja nende tagajärjed



| defekt                         | tagajärg                         |

|--------------------------------|----------------------------------|

| express.json ära võetud        | req.body on undefined (8 katki) |

| /popular ära võetud            | id oli "popular"                 |

| requestId ära võetud           | X-Request-Id kadus               |

| 204 asendatud 200-ga           | keha oli 11 baiti, ootus 0       |

| kohtade kontroll ära võetud    | ülemüük läks läbi                |



\## Koodid, mida Express sinu eest EI vali



201 + Location    ost loodi

204 tühi keha     ost kustutati

422 sisendile     vigased või puuduvad väljad

409 SEISULE       vabu kohti ei jätku



\## Vahevara järjekord



1\. requestId - võtab kliendi X-Request-Id üle või loob uue.

2\. logger - mõõdab päringu aega kuni res.on("finish") sündmuseni.

3\. express.json - loeb JSON-keha, piir on 10 kB.

4\. express.static - teenindab staatilisi faile.

5\. /api/events - sündmuste marsruudid.

6\. /api/orders - tellimuste marsruudid.

7\. /api/health - tervisekontroll.

8\. notFound - tagastab tundmatu tee korral 404.

9\. errorHandler - käsitleb vigu ahela lõpus.



requestId peab olema enne teisi vahevarasid, et päringu ID

oleks kättesaadav ka vigade korral.



logger kasutab res.on("finish"), sest next() ei oota

HTTP-vastuse lõpetamist.



notFound peab olema pärast kõiki marsruute.

Veakäsitlejal on neli parameetrit: err, req, res, next.



\## Marsruutide järjekord



/api/events/popular peab olema enne /api/events/:id,

sest Express valib esimese sobiva marsruudi.



Kui /:id oleks enne /popular, käsitletaks sõna

"popular" sündmuse ID-na.



\## Keha suuruse piir



express.json({ limit: "10kb" }) piirab päringukeha suurust.



20 000 märgiga JSON-keha -> 413.

Server vastab ka pärast seda järgmistele päringutele.



\## Proovijooks



node materials\\check-app.js



27 kontrolli OK







\## Marsruutide kontrollimine curl-iga



Serveri käivitamine (esimeses CMD aknas):



node --input-type=module -e "import {createApp} from './server/app.js'; import {createStore} from './materials/store.js'; import fs from 'node:fs'; const data=JSON.parse(fs.readFileSync('./materials/events.json','utf8')); createApp(createStore(data)).listen(3006,()=>console.log('Server töötab: http://localhost:3006'));"



Kõik curl-käsud käivitatakse teises CMD aknas.



\### 200 - sündmuste nimekiri



curl -i http://localhost:3006/api/events



Oodatav tulemus: 200 OK, neli sündmust JSON-vormingus.



\### 200 - populaarne sündmus



curl -i http://localhost:3006/api/events/popular



Oodatav tulemus: 200 OK, üks populaarne sündmus.



\### 201 - tellimuse loomine



curl -i -X POST http://localhost:3006/api/orders -H "Content-Type: application/json" -d "{\\"event\\":3,\\"qty\\":2}"



Oodatav tulemus: 201 Created

Location: /api/orders/9001



\### 204 - tellimuse kustutamine



curl -i -X DELETE http://localhost:3006/api/orders/9001



Oodatav tulemus: 204 No Content, vastuse keha on tühi.



\### 404 - tundmatu tee



curl -i http://localhost:3006/unknown



Oodatav tulemus: 404 Not Found, vastus JSON-vormingus.



\### 409 - kohti ei jätku



curl -i -X POST http://localhost:3006/api/orders -H "Content-Type: application/json" -d "{\\"event\\":2,\\"qty\\":1}"



Oodatav tulemus: 409 Conflict, sest Talveball on välja müüdud.



\### 413 - liiga suur JSON-keha



PowerShelli kaudu CMD aknast:



powershell -NoProfile -Command "$body = '{\\"event\\":3,\\"qty\\":1,\\"note\\":\\"' + ('x' \* 20000) + '\\"}'; curl.exe -i -X POST http://localhost:3006/api/orders -H 'Content-Type: application/json' --data-raw $body"



Oodatav tulemus: 413 Payload Too Large.



Pärast seda kontrollin, et server töötab edasi:



curl -i http://localhost:3006/api/health



Oodatav tulemus: 200 OK.



\### 422 - vigased sisendandmed



curl -i -X POST http://localhost:3006/api/orders -H "Content-Type: application/json" -d "{\\"event\\":\\"x\\"}"



Oodatav tulemus: 422 Unprocessable Entity.



\## Kokkuvõte



Marsruutide kontrollimiseks kasutan curl-käske ja võrdlen

HTTP-vastuse koode oodatud tulemustega.



201 tähendab, et tellimus loodi.

204 tähendab, et tellimus kustutati ja vastuse keha on tühi.

404 tähendab, et soovitud teed või ressurssi ei leitud.

409 tähendab, et sündmusele ei jätku vabu kohti.

413 tähendab, et päringukeha ületab 10 kB piiri.

422 tähendab, et sisendandmed ei ole korrektsed.



Automaatne proovijooks:



node materials\\check-app.js



27 kontrolli OK



