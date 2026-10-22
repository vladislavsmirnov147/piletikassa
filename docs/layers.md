

\# Ülesanne 1 - kihiline arhitektuur



\## Sõltuvuste suund on TÕESTATAV



check-layers.js -> EI IMPORDI Expressi ega HTTP-d  

&#x20;               -> EI vaja andmebaasi ega tänast kuupäeva



Rakenduse kihid töötavad ühes suunas:



marsruut -> kontroller -> teenus -> repositoorium



Marsruut määrab HTTP-meetodi ja aadressi.

Kontroller võtab päringu andmed vastu, kutsub teenust

ja koostab HTTP-vastuse.

Teenus sisaldab ärireegleid ega kasuta req-, res- ega SQL-objekte.

Repositoorium vastutab andmete lugemise ja salvestamise eest.



Sõltuvuste suunda saab kontrollida ilma Expressi serverit

käivitamata. Repositoorium ja kell antakse teenusele

parameetritena, mistõttu saab neid testis asendada.



\## Teenus kutsub repositooriumi - MÕÕDETUD



| kutse    | kordi |

|----------|-------|

| findById | 1     |

| addOrder | 1     |

| findAll  | 0     |



Piletite ostmisel otsib teenus sündmust ühe korra

ja loob ühe tellimuse.



Teenuse testimiseks kasutatakse createCountingStore()

funktsiooni, mis loendab repositooriumi väljakutseid.



See tõestab, et ostu ajal ei loeta kogu sündmuste

nimekirja ning sama sündmust ei otsita mitu korda.



\## Vea liik -> kood, ÜHES kohas



not\_found -> 404    conflict -> 409    invalid -> 422  

unauthenticated -> 401    forbidden -> 403



Teenus viskab ServiceError vea koos vea liigiga.

Teenus ei määra HTTP olekukoodi.



serviceErrorHandler() teisendab vea liigi HTTP-koodiks.

KIND\_TO\_CODE hoiab kõiki vastendusi ühes kohas.



Tundmatu viga antakse järgmisele veakäsitlejale edasi,

mitte ei peideta ära.



\## Ärireeglid kuuluvad teenusesse



Piletite ostmisel kontrollib teenus:

\- kas sündmus on olemas;

\- kas piletite arv on korrektne;

\- kas vabu kohti jätkub;

\- kas sündmus ei ole veel alanud.



Sündmuse muutmisel kontrollib teenus:

\- kas kasutaja on sisse logitud;

\- kas kasutajal on korraldaja õigused.



Õiguste kontrollimiseks kasutatakse etteantud

canEdit(user) funktsiooni.



Kasutaja andmed tulevad kontrollerist,

kuid otsus tehakse teenusekihis.



\## Testitavus



Teenuse loomisel kasutatakse funktsiooni

createEventService(store, { now }).



Repositoorium ja kell on asendatavad sõltuvused.

Seetõttu ei vaja test päris andmebaasi,

Expressi ega arvuti praegust kuupäeva.



Kontroller luuakse funktsiooniga

createEventsController(service).



Kontrolleri ülesanne on tõlkida HTTP-andmed

teenuse väljakutseteks ja tagastada vastus.



\## Proovijooks



Käivitatud käsk:



node materials\\check-layers.js



Tulemus:



26 kontrolli OK



Kõik 26 kontrolli läbisid edukalt ilma Expressi serverita.



\## Kokkuvõte



Kihiline arhitektuur eraldab HTTP-käsitluse,

ärireeglid ja andmete salvestamise.



Sõltuvuste õige suund muudab rakenduse

lihtsamini testitavaks, hooldatavaks ja laiendatavaks.



