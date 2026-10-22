

\# Ülesanne 2 - puhas http-server ja keskkond



\## Konfiguratsioon kukub KÄIVITUSEL



puuduv DB\_URL  ->  "Puuduvad keskkonnamuutujad: DB\_URL"

kaks puudujat  ->  "Puuduvad keskkonnamuutujad: DB\_URL, SESSION\_SECRET"

vigane PORT    ->  RangeError



readConfig() kontrollib kõiki kohustuslikke keskkonnamuutujaid

serveri käivitamisel. Puuduvad muutujad nimetatakse korraga.



configForLog() peidab databaseUrl ja sessionKey väärtused

tärnidega (\*\*\*), et saladused ei satuks logisse.



.env EI lähe Gitti. .env.example läheb Gitti ilma saladusteta.



\## Mida Express sinu eest teeb



| käsitsi                          | Expressis                 |

|----------------------------------|---------------------------|

| keha lugemine tükkide kaupa+lagi | express.json({ limit })   |

| tee sobitamine ja :id            | app.get("/x/:id", ...)    |

| Content-Type + charset + pikkus  | res.json(...)             |

| 404, kui ükski tee ei sobinud    | vaikimisi olemas          |



\## Marsruudid ja vastused



GET /api/events       ->  200, sündmuste nimekiri

GET /api/events/3     ->  200, üks sündmus

GET /api/events/99    ->  404, sündmust ei leitud

GET /unknown          ->  404, tundmatu tee

POST /api/orders      ->  201 + Location: /api/orders/9001

Puuduvad ostuväljad   ->  422

Vigane JSON           ->  400



404-käsitleja on kõige viimane.

Asünkroonsed vead püütakse makeServer() funktsioonis

.catch() abil kinni, et server jätkaks töötamist.



\## Keha suuruse piir



1,2 MB keha 1 MB lae vastu -> ühendus katkeb, ja server on pärast seda ELUS.



readBody() kontrollib päringukeha suurust.

Liiga suur päring katkestatakse, et kaitsta serveri mälu.



\## Proovijooks



node materials\\check-plain.js



29 kontrolli OK



