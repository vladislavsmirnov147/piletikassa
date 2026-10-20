\# Ülesanne 5 - brauseripoolne hoidla



\## Hoidla tunneb ainult sõnet

&#x20;   localStorage.setItem("x", { a: 1 })

&#x20;   localStorage.getItem("x")  ->  "\[object Object]"



localStorage salvestab ainult sõnesid. Kui tahan objekti salvestada,

pean kasutama JSON.stringify() ja lugemisel JSON.parse().



Vale tulemus VAIKSELT, mitte viga.



\## Versioon - kontrollimata

&#x20;   kirje versiooniga 1, kood ootab 2

&#x20;   read()  ->  null JA vana kirje KUSTUTATI



Kasutasin mustandi jaoks versiooninumbrit. Kui versioon ei sobi,

tagastab read() null ja vana kirje kustutatakse.

Seda tulemust ei ole ma veel brauseris kontrollinud.



\## Kumb hoidla

| hoidla         | eluiga                   | jagatud vahelehtedes |

|----------------|--------------------------|----------------------|

| localStorage   | kuni kustutamiseni       | jah                  |

| sessionStorage | kuni vahelehe sulgemiseni| ei                   |



localStorage sobib vormi mustandi jaoks, sest andmed jäävad alles.

sessionStorage sobib ajutiste istekohtade valikute jaoks.



\## IndexedDB

IndexedDB sobib suuremate andmete hoidmiseks.

Minu projektis piisab localStorage'ist.



\## Päritolu

localhost:8080 ja 127.0.0.1:8080 on erinevad päritolud.

Seetõttu ei näe nad üksteise localStorage andmeid.

Olulised on protokoll, host ja port.



\## Kolm veajuhtumit - kontrollimata

&#x20;   QuotaExceededError  ->  save() tagastab false

&#x20;   keelatud hoidla     ->  read() tagastab null

&#x20;   katkine JSON        ->  read() tagastab null



Kasutasin try/catch plokke, et hoidla vea korral

veebileht edasi töötaks. Neid kolme olukorda

ei ole ma veel eraldi testinud.



\## Kokkuvõte

Selles ülesandes õppisin, kuidas brauseris mustandit salvestada.

Sain aru, miks on vaja JSON-i, versiooni ja vigade käsitlemist.

