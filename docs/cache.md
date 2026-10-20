\# Ülesanne 5 - vahemälu ja tingimuslikud päringud



\## 304 on kõige odavam edukas vastus



&#x20;   200  keha 634 B + päised 222 B  = 856 B

&#x20;   304  keha   0 B + päised 164 B  = 164 B      81% vähem



\## Kaks kirjutajat, üks võitja - jooksutatud



&#x20;   A ja B loevad sündmuse 1        mõlemal silt "3e774731..."

&#x20;   A paneb hinnaks 26              -> 200, uus silt "f9adeea0..."

&#x20;   B paneb hinnaks 30 vana sildiga -> 412

&#x20;   hind lõpuks                     -> 26



Ilma If-Matchita oleks tulemus 30 ja A muudatus kaoks VAIKSELT.



428 = ei küsinud korralikult. 412 = küsis õigesti, aga jäi hiljaks.



\## Tingimuslik lugemine



&#x20;   If-None-Match sama sildiga  -> 304

&#x20;   If-None-Match vale sildiga  -> 200

&#x20;   If-Modified-Since hiljem    -> 304

&#x20;   If-Modified-Since varem     -> 200



304 tähendab, et keha ei saadeta uuesti.

200 tähendab, et vastuse keha saadetakse kliendile.



\## ETag - deterministlik silt



stateTag(obj) annab samale sisule sama sildi,

isegi kui objekti võtmete järjekord erineb.



tagsEqual(a, b) võrdleb silte.

Nõrk võrdlus lubab võrrelda ka W/ silte.



\## Kirjutamise tingimused



&#x20;   If-Match puudub -> 428

&#x20;   If-Match vale   -> 412

&#x20;   If-Match õige   -> 200



If-Match kaitseb vana andmete põhjal kirjutamise eest.

Nii ei kirjuta teine korraldaja esimest muudatust üle.



\## Cache-Control



&#x20;   immutable  -> public, max-age=31536000, immutable

&#x20;   short      -> public, max-age=60

&#x20;   revalidate -> no-cache

&#x20;   secret     -> no-store, private



no-cache nõuab enne kasutamist kontrollimist.

no-store keelab vastuse salvestamise vahemällu.



\## Last-Modified



httpDate(time) teisendab aja HTTP kuupäeva vormingusse.



Last-Modified näitab, millal sisu viimati muudeti.

If-Modified-Since võimaldab kontrollida, kas sisu on muutunud.



\## Kontroll



&#x20;   node public/check-cache.js

&#x20;   30 kontrolli OK

