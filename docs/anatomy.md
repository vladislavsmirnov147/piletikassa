

\# Ülesanne 1 - päringu ja vastuse anatoomia



\## Mida klient ISE lisas

| päis           | kes ta pani            |

|----------------|------------------------|

| host           | klient, kohustuslik    |

| user-agent     | klient ise             |

| content-type   | MINA                   |

| content-length | klient arvutas kehast  |



\## Päringu neli osa

&#x20;   päringurida

&#x20;   päised

&#x20;   tühi rida

&#x20;   keha



Tühi rida eraldab päised kehast.



\## GET ja HEAD - mõõdetud

&#x20;   GET  /api/events -> 200, keha 634 B

&#x20;   HEAD /api/events -> 200, keha   0 B



Päised on identsed, ka Content-Length.



HEAD teeb serveril SAMA töö ja viskab keha ära.

Nii hoitakse võrgu mahtu kokku.



\## /api/mirror

&#x20;   POST /api/orders?confirm=1 HTTP/1.1

&#x20;   Host: localhost:3004

&#x20;   Content-Type: application/json



&#x20;   {"event":3,"qty":2}



Server näitab, millise päringu ta tegelikult sai.



Sama päring kaks korda:

server ei mäleta automaatselt eelmist päringut.



\## Network-paneel

&#x20;   Waiting

&#x20;       ooteaeg serveri esimese vastuseni



&#x20;   Content Download

&#x20;       vastuse keha allalaadimise aeg



\## cURL

Copy as cURL abil saab sama päringu käsurealt uuesti saata.



\## Kokkuvõte

HTTP päring koosneb neljast osast.

Päised annavad lisainfot päringu kohta.

HTTP on olekuta protokoll.

GET tagastab keha, HEAD keha ei tagasta.



