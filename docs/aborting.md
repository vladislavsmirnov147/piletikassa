\# Ülesanne 4 - katkestamine, ajalõpp ja kordamine



\## Serveri ?retry - iga kolmas läbi

&#x20;   503  503  200  503  503  200



\## Kordamine võltsitud fetch-iga

| stsenaarium       | päringuid | tulemus           |

|-------------------|-----------|-------------------|

| 503, 503, 200     | 3         | 200               |

| 404               | 1         | 404 (ei korratud) |

| POST: 503, 201    | 1         | 503 (ei korratud) |

| võrguviga x3      | 3         | viskas            |

| kasutaja katkestas| 1         | AbortError        |

| ajalõpp x2        | 2         | TimeoutError      |



\## Kasvav ooteaeg ja juhuslikkus

&#x20;       ilma:       A 203 403 806    B 203 403 806    lagi 5000

&#x20;   jitteriga:  A 278 489 861    B 246 427 834



\## Minu kontrollid



Käivitasin õpetaja antud kontrollfaili:



&#x20;   node materials/check-abort.js



Tulemus:



&#x20;   36 kontrolli OK



Kõik 36 kontrolli läbisid edukalt.



\## Mida ma sellest õppisin?



AbortController katkestab päringu päriselt. Ainult Promise.race() lõpetaks ootamise, kuid võrgupäring võiks taustal edasi töötada.



AbortError tähendab, et kasutaja katkestas päringu. Sellist päringut ei tohi automaatselt korrata.



TimeoutError tähendab, et päring kestis liiga kaua. GET-päringut võib pärast ajalõppu uuesti proovida.



HTTP 503 ja 429 korral võib päringut korrata, sest server võib mõne aja pärast jälle töötada. HTTP 404 korral ei ole kordamine tavaliselt mõistlik.



POST-päringut ei korda ma automaatselt, sest näiteks pileti ostmisel võiks see tekitada topeltostu.



Kasvav ooteaeg vähendab serveri koormust. Jitter lisab juhuslikkust, et kõik kliendid ei prooviks samal hetkel uuesti.



\## Mida kasutan Piletikassas?



1\. Kui kasutaja alustab uut otsingut, katkestan eelmise päringu, et vana vastus ei kirjutaks uut tulemust üle.

2\. Kui sündmuste laadimine ebaõnnestub ajutise serverivea tõttu, proovin GET-päringut mõistliku pausiga uuesti.

3\. Pileti ostmise POST-päringut ei korda automaatselt, et vältida topeltoste.



\## Märkus mõõtmiste kohta



Ülal olev serveri ?retry järjestus ja jitteriga arvud on õpetaja slaidi näited, mitte minu enda serverimõõtmised.



Minu C04 server ei toeta ?retry parameetrit. Kordamise käitumist kontrollisin õpetaja fakeFetch() ja check-abort.js abil. Automaatsete kontrollide tulemus oli 36 kontrolli OK.



\## Mis juhtub ilma katkestamiseta? (punkt 3)



Kui kasutaja kirjutab otsingusse kiiresti "Sü", "Süg" ja "Sügis", saadetakse kolm päringut.



Ilma katkestamiseta võivad kõik kolm päringut edasi töötada, isegi kui kasutaja ootab ainult viimase otsingu tulemust.



Vastused ei pruugi saabuda samas järjekorras, milles päringud saadeti. Näiteks võib esimese päringu vastus saabuda viimasena ja kirjutada uuema otsingutulemuse üle.



See raiskab võrguühendusi ja andmemahtu ning võib näidata kasutajale vale nimekirja.



AbortControlleriga saan eelmise päringu katkestada, kui kasutaja alustab uut otsingut. Nii ei pea rakendus ootama enam mittevajalikku vastust.



\## Brauseri ühenduste piirang (punkt 5)



HTTP/1.1 puhul on brauseril tavaliselt umbes kuus sama hosti ühendust korraga.



Kui vanu päringuid ei katkestata, võivad need ühendused hõivata ja uued päringud peavad järjekorras ootama.



HTTP/2 puhul saab ühe ühenduse kaudu teha mitu päringut, kuid ka seal on korraga töös olevatel päringutel piirangud.



Seetõttu ei ole katkestamine ainult kiiruse küsimus. See aitab vältida vananenud vastuseid ja vabastada ressursse uute päringute jaoks.



Promise.race() lõpetab ainult ootamise, aga AbortController võimaldab katkestada fetch-päringu enda.





\## Minu mõõtmised (punktid 8 ja 9)



Käivitasin eraldi C05 testiserveri ja saatsin kuus päringut aadressile /api/events?retry.



Serveri vastuste järjekord oli:



&#x20;   503 503 200 503 503 200



Iga kolmas päring õnnestus, täpselt nagu ülesandes nõutud.



Mõõtsin kahe kliendi A ja B kolme pausi:



&#x20;   ilma:       A 203 403 806    B 203 403 806

&#x20;   jitteriga:  A 278 489 861    B 246 427 834



Ilma jitterita olid klientide pausid peaaegu võrdsed. Jitteriga olid pausid erinevad, mis aitab vältida olukorda, kus kõik kliendid koormavad serverit samal ajal.



Mõõtmised tegin failiga materials/measure-jitter.js. Tegelikud ajad erinevad veidi arvutatud aegadest, sest taimer ei ole täiesti täpne.

