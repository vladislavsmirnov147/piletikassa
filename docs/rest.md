

\# Ülesanne 2 - REST-i kuju



\## PUT ja PATCH - mõõdetud



olemasolev: { id: 3, name: "Improteater", note: "vana" }



PUT   { name: "Uus", venue: "X", price: 20 } -> note KADUS



PATCH { price: 20 }                         -> note JÄI



PUT asendab kogu ressursi sisu. Kui päringu kehas

puudub väli note, siis see kaob.



PATCH muudab ainult saadetud välju. Ülejäänud

väljad jäävad alles.



Mõlemal juhul jääb ressursi id muutumatuks.



PUT on idempotentne: sama päringu kordamisel

saadakse sama lõppseis.



\## Piletikassa olukorrad



| olukord                         | kood | miks |

|---------------------------------|------|------|

| katkine JSON                     | 400  | Päringu keha ei saa lugeda |

| negatiivne piletite arv          | 422  | JSON on loetav, kuid väärtus on vigane |

| ost sündmusele 999, mida ei ole  | 422  | Tellimuse sisend viitab olematule sündmusele |

| sündmus on kustutatud            | 404  | Soovitud ressurssi ei leitud |

| ost juba müüdud kohale           | 409  | Koht on juba hõivatud |

| liiga palju pileteid             | 409  | Vabu kohti ei jätku |

| tühistatud ostu tühistamine      | 409  | Tellimus on juba tühistatud |

| kasutaja pole sisse logitud      | 401  | Autentimine on vajalik |

| kasutaja ei ole korraldaja       | 403  | Kasutajal puudub vajalik õigus |



\## Ressursid ja HTTP-meetodid



REST-is nimetab URL ressurssi ning HTTP-meetod

näitab tegevust.



Näited:



GET /api/events

GET /api/events/3

DELETE /api/events/3

GET /api/events/3/seatmap

POST /api/orders

POST /api/orders/7/cancellation



URL-id kasutavad nimisõnu ja kogumite puhul

mitmust. Tühistamine on eraldi ressurss

(cancellation), mitte URL-i lisatud tegusõna.



\## Vale HTTP-meetod



Kui klient kasutab ressursi jaoks keelatud meetodit,

tagastab server 405 Method Not Allowed.



Vastusega peab kaasas olema Allow-päis,

mis näitab selle ressursi lubatud meetodeid.



See aitab kliendil aru saada, milliseid

HTTP-meetodeid võib kasutada.



\## API versioonimine



API versioon on URL-is:



/api/v1/events

/api/v2/events



Versioonis v1 kasutatakse välja price,

versioonis v2 välja priceCents.



Näiteks 15 eurot esitatakse v2-s väärtusena

priceCents: 1500.



Versiooni muutumisel peab klient kasutama

uut andmevälja ega tohi eeldada, et vana

price-väli on endiselt olemas.



\## Korduv POST ja piletikassa kaitse



POST /api/orders loob uue tellimuse.



Kui klient saadab sama ostupäringu kogemata

kaks korda, võivad tekkida kaks tellimust

ja pileteid võidakse reserveerida topelt.



Selle vältimiseks saab kasutada

Idempotency-Key päist.



Server jätab võtme ja esimese päringu tulemuse

meelde ning sama võtmega korduv päring

tagastab varasema tulemuse ilma uut ostu loomata.



\## Proovijooks



Käivitatud käsk:



node materials\\check-rest.js



Tulemus:



31 kontrolli OK, 6 KATKI



Kuus läbimata kontrolli puudutavad ALLOWED-tabeli

HTTP-meetodeid. Need tuleb enne ülesande lõplikku

valmimist parandada.



\## Kokkuvõte



REST API peab kasutama selgeid ressursiaadresse,

õigeid HTTP-meetodeid ja üheselt mõistetavaid

olekukoode.



PUT asendab ressursi, PATCH muudab ainult osa.

405 vastus sisaldab Allow-päist ning korduvate

ostude vältimiseks kasutatakse idempotentsusvõtit.



