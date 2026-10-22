\# Ülesanne 3 - fetch, neli olekut ja vead



\## fetch ei viska HTTP-vea peale



fetch() ei viska automaatselt viga, kui server vastab näiteks 404 või 500.



404 korral saab fetch() vastuse kätte, aga response.ok on false.



Võrguvea korral fetch() lükkab lubaduse tagasi ja tekib TypeError.



Seetõttu kontrollin readResponse() funktsioonis nii HTTP-vastust kui ka vastuse keha lugemisel tekkinud vigu.



\## Kaks eri viga ühe päringu sees - ?broken



Õpetaja näites tagastab ?broken HTTP staatuse 200, kuid vastuse JSON on vigane.



&#x20;   response.ok      -> true

&#x20;   response.json()  -> viskab vea

&#x20;   vea liik         -> format



See näitab, et edukas HTTP staatus ei tähenda alati korrektseid andmeid.



Vigane JSON on vorminguviga, mitte serveri HTTP-viga.



\## Vealiikide eristamine



readResponse() eristab järgmisi vealiike:



\- server: HTTP 5xx ja 429

\- client: muud HTTP 4xx vastused

\- format: vigane vastuse keha või JSON



Võrguvea korral ei näita ma kasutajale toorest TypeError objekti, vaid teisendan vea errorToState() abil kasutajale sobivaks olekuks.



\## Neli olekut



| olek | serveri vastus | mida kasutaja näeb |

|------|----------------|--------------------|

| loading | ?slow=900 | kohatäide ja laadimise märge |

| data | 200, sündmuste nimekiri | nimekiri |

| empty | 200, tühi massiiv \[] | "Ükski sündmus ei vasta" |

| err | HTTP-viga või võrguviga | veateade ja kordamisnupp |



Need olekud tähendavad erinevaid olukordi.



loading tähendab, et päring pole veel lõppenud. Selle ajal ei tohiks näidata tühja ekraani.



data tähendab, et sündmused on olemas ja kasutaja näeb nimekirja.



empty tähendab, et päring õnnestus, kuid sobivaid sündmusi ei leitud. See ei ole viga.



err tähendab, et päring ebaõnnestus. Kasutajale tuleb näidata arusaadavat teadet ja võimalust uuesti proovida.



\## stateFromData()



Kirjutasin stateFromData(rows) funktsiooni.



Kui rows on tühi massiiv, tagastab funktsioon oleku empty.



Kui massiivis on sündmused, tagastab funktsioon oleku data koos sündmuste andmetega.



Nii ei aja ma tühja tulemust segamini päringu veaga.



\## createClient() - sama päringu liitmine



Kirjutasin createClient(options) funktsiooni, mis väldib samaaegseid topeltpäringuid.



Kui kaks väljakutset tehakse samal ajal, kasutavad need sama pooleliolevat Promise'it. Serverile saadetakse ainult üks GET-päring.



Kui esimene päring on lõppenud, saab järgmine väljakutse alustada uut päringut.



Seega kaks samaaegset väljakutset teevad ühe päringu, aga kaks järjestikust väljakutset teevad kaks päringut.



See on Piletikassas kasulik, sest mitu komponenti võivad vajada samu sündmuste andmeid.



\## Serveri katsetamine



Käivitasin olemasoleva serveri käsuga:



&#x20;   node server.js



Server töötas aadressidel:



&#x20;   http://localhost:3004

&#x20;   http://localhost:3005



Avasin brauseris järgmised aadressid:



&#x20;   http://localhost:3004/api/events?empty

&#x20;   http://localhost:3005/api/events?empty



Mõlemal aadressil tagastas server nelja sündmusega nimekirja, mitte tühja massiivi.



Kontrollisin server.js faili ja selgus, et see on C04 jaoks antud server. Selle eventsApi() funktsioon ei töötle parameetreid ?slow=900, ?err, ?broken ega ?empty.



Seetõttu ei saanud ma selle serveriga mõõta C05 ülesande kõiki nelja testvastust.



Õpetaja näites on ?slow=900 laadimisaeg ligikaudu 0,9 sekundit ja ?empty vastuse keha 2 baiti, kuid need ei ole minu mõõdetud tulemused.



\## Kontrollide tulemus



Käivitasin õpetaja antud kontrollfaili:



&#x20;   node materials/check-request.js



Tulemus:



&#x20;   21 kontrolli OK



Käivitasin kontrollid kaks korda ja mõlemal korral läbisid kõik 21 kontrolli edukalt.



See kinnitab, et public/request.js funktsioonid vastavad automaatsetele kontrollidele.



\## Mida sellest Piletikassa jaoks õppisin



1\. Tühi sündmuste nimekiri ei tähenda, et rakendus on katki. Kasutajale tuleb näidata eraldi empty olekut.

2\. fetch() puhul tuleb kontrollida HTTP staatust ja vastuse vormingut, sest HTTP 200 ei taga korrektset JSON-i.

3\. Kui mitu komponenti küsivad korraga samu andmeid, saab sama pooleliolevat päringut jagada. Nii väldin tarbetuid topeltpäringuid.

4\. Võrguvea korral ei tohiks kasutajale näidata tehnilist TypeError teadet. Parem on näidata arusaadavat veateadet ja kordamisnuppu.

