

\# Ülesanne 4 – DevTools Network



\## Veebilehe uurimine



Uurisin Google Chrome'i DevTools Network vahekaardil veebilehte `https://ut.ee/et`.



\### Üldandmed



\- Päringute arv: 48

\- Edastatud andmete maht: 52.3 kB

\- Ressursside kogumaht: 4.1 MB

\- Lehe laadimisaeg (Load): 360 ms



\### Peamine HTML-päring



\- Request URL: `https://ut.ee/et`

\- Request Method: `GET`

\- Status Code: `200 OK`

\- Content-Type: `text/html; charset=UTF-8`

\- Cache-Control: `max-age=900, public`

\- Cf-Cache-Status: `DYNAMIC`



HTTP staatus `200 OK` tähendab, et päring õnnestus. Content-Type `text/html` näitab, et server tagastas HTML-dokumendi.



Brauseri aadressis oli fragment `#test`, kuid Request URL-is seda ei olnud. Fragmenti ei saadeta serverile.

&#x20; 





\## Ressursside tüübid ja suurim päring



Network vahekaardil olid näha järgmised ressursitüübid:



\- HTML-dokument (`document`)

\- CSS-failid (`stylesheet`)

\- JavaScript-failid (`script`)

\- Pildid (`jpeg`, `svg+xml`)

\- Fondid (`font`)



Kõige suurem päring veeru Size järgi oli `UndercliffCreative-6943.jpg`.



\- Tüüp: `jpeg`

\- Suurus: `212 kB`

\- HTTP staatus: `200 OK`



Suurima päringu leidmiseks lülitasin DevTools Network vahekaardil sisse valiku `Disable cache`, laadisin lehe uuesti ja sorteerisin päringud suuruse järgi.

&#x20; 



## Vahemälu ja HTTP staatus 304

Esimesel lehe uuesti laadimisel näitas Network vahekaart paljude ressursside juures märget `(memory cache)`. See tähendab, et brauser kasutas mälus olevat faili ega pidanud seda uuesti alla laadima.

Ühe JPEG-pildi päringul oli HTTP staatus `304 Not Modified`. See tähendab, et server kinnitas, et vahemällu salvestatud ressurss ei ole muutunud, ning brauser sai kasutada olemasolevat koopiat.

Kui lülitasin sisse valiku `Disable cache` ja laadisin lehe uuesti, ilmusid Size veergu paljude failide tegelikud edastatud suurused. Uuel laadimisel oli 51 päringut ja edastati umbes 2.3 MB andmeid.

Vahemälu aitab vähendada võrguliiklust ja kiirendada veebilehe laadimist.
  

## Copy as cURL

Valisin DevTools Network vahekaardil peamise HTML-päringu `et`.

Seejärel tegin päringul paremklõpsu ja valisin `Copy` -> `Copy as cURL (cmd)`.

See toiming kopeeris päringu cURL-käsuna Windowsi käsurea jaoks.

Päringu põhiteave:

- URL: `https://ut.ee/et`
- Meetod: `GET`
- HTTP staatus: `200 OK`

cURL-käsku saab kasutada HTTP-päringu kordamiseks käsurealt. Kopeeritud käsk võib sisaldada küpsiseid ja muid päringu päiseid, seetõttu ei lisa ma siia võimalikke privaatseid seansiandmeid.
  

