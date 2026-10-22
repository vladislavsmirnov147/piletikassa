
# Ülesanne 6 - teenustöötaja ja võrguta pilet

## Elutsükkel - mõõdetud

    install   ->  kest laetud (5 faili), skipWaiting kutsutud
    activate  ->  alles jäi ainult ["piletikassa-v3"]

## Kolm strateegiat

| strateegia   | kasutaja näeb          | kus piletikassas    |
|--------------|------------------------|---------------------|
| cache-first  | kohe                   | kest (5 faili)      |
| network-first| värsket, võrguta vana  | sündmuste nimekiri  |
| SWR          | vana kohe, uus hiljem  | üks pilet           |

## Isikuandmed: mis läheb vahemällu ja mis mitte

    /api/orders       ->  võrk-ainult   (isikuandmed, muutub iga ostuga)
    /api/tickets/:id  ->  SWR          (ei muutu, uksel vaja võrguta)

## Minu selgitus

### Teenustöötaja töö

Service Worker töötab eraldi lõimes ja tal puudub ligipääs DOM-ile. Ta asub rakenduse ja võrgu vahel ning saab päringuid käsitleda.

Teenustöötaja ei muuda kogu rakendust automaatselt võrguühenduseta töötavaks. Ta võimaldab varem salvestatud andmeid võrgu puudumisel lugeda.

### Install ja activate

Install-etapis salvestatakse rakenduse kest viie failiga vahemällu `piletikassa-v3`.

Activate-etapis kustutatakse kõik vanad vahemälud, sealhulgas `piletikassa-v1` ja `piletikassa-v2`. Alles jääb ainult uus versioon.

Brauser ei kustuta rakenduse vanu vahemälusid automaatselt. Seetõttu peab teenustöötaja need ise eemaldama.

### Millal on skipWaiting ohtlik?

`skipWaiting()` võib olla ohtlik, kui uus teenustöötaja võtab juhtimise üle ajal, mil avatud leht kasutab veel vana rakenduse faile. Erinevate versioonide failid võivad omavahel mitte sobida.

Selles ülesandes vähendab ohtu see, et uus kest salvestatakse enne `skipWaiting()` väljakutsumist ning aktiveerimisel eemaldatakse vanad vahemälud.

Päris rakenduses tuleb siiski kontrollida, et avatud leht ja uus teenustöötaja oleksid omavahel ühilduvad.

### Kolme strateegia erinevused

**Cache-first:** kõigepealt otsitakse vastust vahemälust. Kui vastus on olemas, ei tehta uut võrgupäringut. See sobib rakenduse kesta jaoks.

**Network-first:** kõigepealt küsitakse värskeid andmeid võrgust. Kui võrk ei tööta või päring aegub, kasutatakse varem salvestatud vastust. See sobib sündmuste nimekirjale.

**Stale-while-revalidate (SWR):** kasutaja näeb kohe vana salvestatud vastust, samal ajal uuendatakse vahemälu taustal. See sobib juba väljastatud pileti lugemiseks.

SWR ei sobi vabade kohtade arvu kuvamiseks, sest kasutaja võib näha aegunud arvu. Vabade kohtade arv võib kiiresti muutuda.

### Isikuandmete kaitse

`/api/orders` kasutab ainult võrku. Tellimused võivad sisaldada isikuandmeid ja muutuvad iga ostuga, mistõttu neid ei salvestata vahemällu.

`/api/tickets/:id` kasutab SWR-strateegiat, et varem avatud piletit oleks võimalik lugeda ka võrgu puudumisel.

Päris rakenduses tuleb lisaks arvestada piletiandmete privaatsuse ja seadme jagamise riskiga.

## Kontrollimine

Käivitasin õpetaja kontrollfaili käsuga:

    node materials\check-sw.js

Tulemus:

    19 kontrolli OK

Kontroll kinnitas, et install salvestas vähemalt viis faili, `skipWaiting()` kutsuti välja, vanad vahemälud kustutati ja `clients.claim()` töötas.

Samuti kontrolliti kolme vahemälustrateegiat ning seda, et `/api/orders` ei lähe vahemällu.




## Mida saab ja mida ei saa teha võrguühenduseta?

Võrguühenduseta saab avada varem vahemällu salvestatud rakenduse kesta, lugeda varem laaditud sündmuste nimekirja ja vaadata varem avatud piletit.

Võrguühenduseta ei saa teha uut piletiostu, sest `/api/orders` kasutab ainult võrku. Samuti ei saa garanteerida, et sündmuste nimekiri või vabade kohtade arv on ajakohane.

Teenustöötaja aitab rakendust võrgu puudumisel lugeda, kuid ei asenda serverit ega võimalda kõiki toiminguid ilma internetita.
