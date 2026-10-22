

\# Ülesanne 2 - WebSocket: kanalid ja taasühendus



\## Sulgemiskood ütleb, kas tasub uuesti proovida



| kood | tähendus | proovida |

|------|----------|----------|

| 1000 | normaalne | ei |

| 1006 | ühendus kadus | jah |

| 4401 | autentimata | EI |

| 4429 | ülekoormus | jah, hiljem |

| 4503 | server seiskub | jah, kohe |



Sulgemiskood näitab, miks WebSocketi ühendus lõppes ja kas klient peaks uuesti ühenduma.



Kood 1000 tähendab normaalset sulgemist. Uut ühendust ei ole vaja.



Kood 1006 tähendab, et ühendus katkes ootamatult. Klient võib proovida uuesti ühenduda.



Kood 4401 tähendab, et kasutaja ei ole autenditud. Sama autentimisinfoga uuesti proovimine ei lahenda probleemi.



Kood 4429 tähendab serveri ülekoormust. Klient peaks enne uut katset ootama.



Kood 4503 tähendab, et server seiskub. Klient võib proovida uuesti ühenduda.



Koodid 4000–4999 on rakenduse enda sulgemiskoodid.



\## Taasühendus



&#x20;   1. katse 500 ms   2. katse 1000 ms   3. katse 2000 ms



&#x20;   ÕNNESTUMINE NULLIB - muidu kasvab ooteaeg igavesti



createReconnector() kasutab kasvavat ooteaega ehk exponential backoff'i.



Iga ebaõnnestunud katse järel ooteaeg suureneb, kuid ei ületa määratud ülempiiri.



Juhuslik kõikumine ehk jitter aitab vältida olukorda, kus paljud kliendid proovivad täpselt samal ajal uuesti ühenduda.



Kui ühendus õnnestub, kutsub klient välja succeeded() ja katsete loendur muutub nulliks.



See on oluline, sest pärast edukat ühendust peab järgmine katkestus alustama uuesti lühikesest ooteajast.



\## Kanalid ja ruumid



createHub() kasutab kanalite hoidmiseks Map-i ning iga kanali liikmete jaoks Set-i.



Kui klient liitub kanaliga event:1, saadetakse selle kanali sõnumid ainult event:1 liikmetele.



Teise kanali liikmed ei saa neid sõnumeid.



Üks klient võib kuuluda korraga mitmesse kanalisse.



Kui klient lahkub viimasena, kustutatakse tühi kanal Map-ist.



See väldib mäluleket, sest tühje kanaleid ei jäeta serveri mällu alles.



Enne sõnumi saatmist kontrollitakse, et ühendus ei oleks suletud.



\## Autentimine ühenduse loomisel



authConnection() kontrollib kasutajat ühenduse loomisel.



Autentimiseks saab kasutada küpsist (cookie) või esimest autentimissõnumit.



Tokenit ei lisata URL-i, sest URL võib sattuda serveri logidesse, brauseri ajalukku või jälgimissüsteemidesse.



WebSocketi ühendus algab HTTP käepigistusega, kuid pärast seda ei saadeta iga sõnumiga uusi HTTP-päiseid.



Seetõttu tuleb kasutaja tuvastada ühenduse alguses ning siduda tema identiteet ühendusega.



Kui autentimine ebaõnnestub, kasutatakse sulgemiskoodi 4401.



\## Ping ja pong



createHeartbeat() kontrollib, kas ühendused on endiselt elus.



Server saadab ping-sõnumi ja ootab pong-vastust.



Kui ühendus järgmise kontrolli ajaks ei vasta, loetakse see katkenuks.



Katkenud TCP-ühendus ei pruugi serverile ise teada anda, et klient on kadunud.



Näiteks võib kasutaja internetiühendus katkeda või telefon minna unerežiimi.



Ping-pong kontroll aitab surnud ühendused eemaldada ning vältida ressursside raiskamist.



\## Piletikassa näide



Piletikassas saab iga sündmuse jaoks kasutada eraldi kanalit, näiteks event:1 või event:2.



Kui sündmuse vabade kohtade arv muutub, saadab server uuenduse ainult selle sündmuse kanali liikmetele.



Nii ei pea kõik kliendid saama kõigi sündmuste teateid.



Kui klient kaotab ühenduse, aitab taasühendamise loogika ühenduse taastada.



Heartbeat eemaldab ühendused, mis on vaikselt katkenud.



\## Proovijooks



Käivitatud käsk:



&#x20;   node materials\\check-channels.js



Tulemus:



&#x20;   34 kontrolli OK



Kõik 34 õpetaja kontrolli läbisid edukalt.



\## Kokkuvõte



WebSocket võimaldab kahesuunalist suhtlust ühe püsiühenduse kaudu.



Kanalid tagavad, et sõnumid jõuavad ainult õigete klientideni.



Autentimine kaitseb ühendust ning sulgemiskoodid aitavad otsustada, kas taasühendus on vajalik.



Kasvav ooteaeg, jitter ja ping-pong kontroll muudavad ühenduste haldamise töökindlamaks.



