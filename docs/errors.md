

\# Ülesanne 4 - vead ja arendushügieen



\## Käitusviga ja programmiviga



|               | käitusviga           | programmiviga                 |

|---------------|----------------------|-------------------------------|

| näide         | puuduv kirje         | undefined.foo, trükiviga      |

| kas oodatav   | jah                  | ei - see on bug               |

| mida teha     | vasta ja JÄTKA       | logi ja SURE                  |

| kliendile     | vea tegelik teade    | "Serveri sisemine viga"       |



Käitusviga on oodatav olukord, näiteks puuduv sündmus,

vigased sisendandmed või välja müüdud üritus.



Programmiviga tähendab viga rakenduse koodis.

Sellise vea üksikasju ei tohi tootmiskeskkonnas

kasutajale näidata.



\## Veaklassid ja HTTP-koodid



NotFound      -> 404, küsitud kirjet ei ole

InvalidInput  -> 422, sisendandmed on vigased

Conflict      -> 409, seis on vastuoluline



Kõik kolm klassi pärivad RuntimeError klassist.



makeErrorResponse() kontrollib, kas viga on käitusviga.

Oodatud veale antakse tema HTTP-kood.

Tundmatu programmiviga annab vastuseks 500.



Liiga suure JSON-keha korral annab express.json()

vea 413. Seda käsitletakse eraldi, et server

saaks pärast vigast päringut edasi töötada.



\## Veateade ja päringu ID



requestId() lisab igale päringule ID.

Sama ID peab olema nii veavastuses kui ka logis.



See võimaldab leida logidest konkreetse päringu vea.



Arenduskeskkonnas võib veavastus sisaldada stack-i.

Tootmiskeskkonnas ei näidata kasutajale stack-i,

sest see võib avaldada rakenduse sisemisi üksikasju.



\## Miks headersSent on vajalik?



Kui HTTP-vastus on juba saadetud, ei saa selle

staatust ega päiseid enam muuta.



errorHandler() kontrollib res.headersSent väärtust.

Kui päised on juba saadetud, antakse viga next(err)

kaudu Expressi viimasele veakäsitlejale.



See väldib olukorda, kus server proovib

ühele päringule kaks korda vastata.



\## Protsessikaitsed



installProcessGuards() kuulab kahte sündmust:



uncaughtException  -> püüdmata erind

unhandledRejection -> käsitlemata Promise'i tagasilükkamine



Need ei asenda tavalist veakäsitlust.

Nende eesmärk on logida ootamatu viga ja

lõpetada protsess veakoodiga 1.



Pärast tõsist programmiviga võib protsessi olek

olla määramata. Seetõttu peab protsess lõppema

ja protsessihaldur peab selle vajadusel taaskäivitama.



\## Miks readConfig() peatab käivituse?



readConfig() kontrollib DB\_URL ja SESSION\_SECRET

olemasolu enne serveri käivitamist.



Kui kohustuslik muutuja puudub, lõpetatakse käivitus.

Nii ei avastata konfiguratsiooniviga alles siis,

kui esimene kasutaja saadab päringu.



Vigane PORT annab RangeError-i.

Saladusi ei kirjutata logisse.



\## Käsud, mis asendavad paketi



| Node.js-i käsk        | Asendatav pakett või tööriist |

|-----------------------|-------------------------------|

| node --watch server.js | nodemon                       |

| node --env-file=.env   | dotenv                        |

| npm ci                | npm install konveieris        |

| node --test           | eraldi testiraamistik         |



node --watch taaskäivitab serveri failimuudatuste järel.

node --env-file loeb keskkonnamuutujad .env failist.

npm ci paigaldab sõltuvused lukustusfaili järgi.

node --test võimaldab kasutada Node.js-i sisseehitatud

testimisvahendeid.



\## package.json skriptid



npm start       -> node server.js

npm run dev     -> node --watch --env-file=.env server.js

npm test        -> node materials/check-app.js

npm run audit   -> npm audit



\## Proovijooks



npm test



27 kontrolli OK



