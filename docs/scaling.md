\# Ülesanne 6 - olekuta server



\## Kuus viga, mis töötavad ÜHE eksemplariga



| mälus | ilming kahe eksemplariga |

|-------|--------------------------|

| istung | juhuslik väljalogimine |

| vahemälu | vastus sõltub sellest, kuhu päring sattus |

| WebSocket | A ei näe B teateid |

| loendur | statistika on eksemplaride arvu võrra vale |

| cron | kaks kirja ühe ostu kohta |

| üleslaaditud fail | 404 iga teise päringu peale |



\### 1. Istung



Kui kasutaja istung salvestatakse ainult ühe serveri mällu, ei näe teine server seda.



Kui järgmine päring satub teise eksemplari, võib kasutaja ootamatult välja logitud olla.



Lahendus: hoida istungeid ühises Redis-hoidlas.



\### 2. Vahemälu



Kui igal serveril on eraldi vahemälu, võivad serverid tagastada erinevaid andmeid.



Näiteks võib üks server näidata sündmuse vana hinda ja teine uut hinda.



Lahendus: kasutada ühist Redis-vahemälu ja kehtetuks muutmise reegleid.



\### 3. WebSocket



Kui WebSocketi ühendused ja teated on ainult ühe serveri mälus, ei saa server A automaatselt saata teadet serveri B klientidele.



Näiteks ei pruugi kõik Piletikassa külastajad näha kohtade saadavuse muutust.



Lahendus: kasutada ühist sõnumivahendajat, näiteks Redis Pub/Sub-i.



\### 4. Loendur



Kui iga server loendab tegevusi eraldi, ei näita ühe serveri loendur kogu rakenduse tegelikku statistikat.



Näiteks võib müüdud piletite arv olla erinev sõltuvalt sellest, milliselt serverilt andmeid küsitakse.



Lahendus: kasutada ühiseid atomaarseid loendureid Redis-es või andmebaasis.



\### 5. Cron



Kui mõlemad serverid käivitavad sama ajastatud töö, võib üks tegevus toimuda kaks korda.



Näiteks võib ostja saada ühe ostu kohta kaks kinnituskirja.



Lahendus: kasutada jagatud tööjärjekorda, idempotentsusvõtmeid ja vajaduse korral hajuslukku.



\### 6. Üleslaaditud fail



Kui fail salvestatakse ainult serveri A kettale, ei leia server B seda faili.



Näiteks võib sündmuse plakati allalaadimine anda mõne päringu korral 404 vea.



Lahendus: salvestada failid ühisesse objektihoidlasse.



\## Kolm hoidlat ja nende puudus



| hoidla | eelis | puudus |

|--------|-------|--------|

| Redis | kiire ühine olek ja TTL | üks lisateenus, mis võib maas olla |

| andmebaas | püsivad andmed ja tehingud | iga päringuga võib andmebaasi koormata |

| objektihoidla | kõik eksemplarid näevad SAMA faili | iga kirjutus saadab terve objekti |



\### Redis



Redis sobib istungite, ajutise oleku, loendurite ja vahemälu jaoks.



Redis võimaldab kasutada TTL-i, et ajutised kirjed aeguksid automaatselt.



Puuduseks on sõltuvus täiendavast teenusest, mille töökindlus tuleb tagada.



\### Andmebaas



Andmebaas sobib püsivate andmete, näiteks ostude, piletite ja kasutajate salvestamiseks.



Andmebaas toetab tehinguid ja aitab säilitada andmete terviklust.



Puuduseks on see, et iga päringuga andmebaasi kasutamine võib tekitada suure koormuse.



\### Objektihoidla



Objektihoidla sobib failide, näiteks sündmuste plakatite ja dokumentide salvestamiseks.



Kõik serverieksemplarid saavad kasutada samu faile.



Objektihoidla ei sobi hästi väikese ja sageli muutuva oleku jaoks, sest objekti muutmisel tuleb tavaliselt kirjutada terve objekt uuesti.



Istungeid ei ole mõistlik hoida objektihoidlas, sest neid tuleb sageli lugeda ja muuta.



\## findProblems()



Funktsioon findProblems(app) kontrollib, millised rakenduse osad kasutavad ühe serveri mälu.



Näiteks:



&#x20;   session: in-memory

&#x20;   cache: redis

&#x20;   websocket: in-memory

&#x20;   counter: database

&#x20;   scheduled\_job: in-memory

&#x20;   uploaded\_file: object\_store



Selles näites leitakse kolm probleemi:



\- session

\- websocket

\- scheduled\_job



Iga leitud probleemi juures tagastatakse selle nimi, ilmnemise kirjeldus ja lahendus.



\## Piletikassa näide



Piletikassa võib töötada mitmes serverieksemplaris, et teenindada rohkem külastajaid.



Kasutajate istungid ja ajutine olek peaksid olema ühises hoidlas.



Ostud ja piletid kuuluvad andmebaasi.



Sündmuste plakatid ja muud üleslaaditud failid sobivad objektihoidlasse.



Reaalajas kohtade uuendused vajavad serveritevahelist sõnumivahetust.



Ajastatud tööd peavad olema idempotentsed, et sama ostu ei töödeldaks mitu korda.



\## Proovijooks



Käivitatud käsk:



&#x20;   node materials\\check-scaling.js



Tulemus:



&#x20;   11 kontrolli OK



Kõik 11 õpetaja kontrolli läbisid edukalt.



\## Kokkuvõte



Olekuta server ei tähenda, et rakendusel puudub olek.



See tähendab, et vajalik olek ei sõltu ühe serveriprotsessi mälust.



Mitme eksemplariga rakenduses peavad vajalikud andmed olema ühises hoidlas, mida kõik eksemplarid saavad kasutada.



Redis sobib ajutise oleku jaoks, andmebaas püsivate andmete jaoks ja objektihoidla failide jaoks.





\## Kuhu olek kolib



| olek | hoidla |

|------|--------|

| istung | Redis |

| vahemälu | Redis |

| WebSocket | Redis Pub/Sub |

| loendur | Redis või andmebaas |

| cron | jagatud tööjärjekord ja andmebaas |

| üleslaaditud fail | objektihoidla |

