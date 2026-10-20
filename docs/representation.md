\# Ülesanne 6 - sisu läbirääkimine ja osaline sisu



\## Range - mõõdetud



| Range          | kood | Content-Range           |

|----------------|------|-------------------------|

| bytes=0-49     | 206  | bytes 0-49/15499        |

| bytes=100-     | 206  | bytes 100-15498/15499   |

| bytes=-60      | 206  | bytes 15439-15498/15499 |

| bytes=99999-   | 416  | bytes \*/15499           |



Liiga suur LÕPP kärbitakse, liiga suur ALGUS on viga.



\## Vary: päis, milleta vahemälu VALETAB



&#x20;   1. A küsib Accept: text/csv          -> CSV läheb vahemällu

&#x20;   2. B küsib Accept: application/json

&#x20;   3. Vahemälu annab B-le CSV - sama URL, "sama vastus"



Vary: Accept ütleb vahemälule, et vastus sõltub Accept-päisest.



\## Accept - mõõdetud



&#x20;   Accept: text/csv

&#x20;   200 OK

&#x20;   Content-Type: text/csv; charset=utf-8

&#x20;   Content-Length: 129

&#x20;   Vary: Accept



&#x20;   Accept: application/json

&#x20;   200 OK

&#x20;   Content-Type: application/json; charset=utf-8

&#x20;   Content-Length: 413

&#x20;   Vary: Accept



Sama URL, erinev esitus.

CSV on 129 baiti ja JSON on 413 baiti.

JSON on 284 baiti suurem kui CSV.



\## Range - lisamõõtmised



&#x20;   Range: bytes=0-499

&#x20;   206 Partial Content

&#x20;   Content-Length: 500

&#x20;   Content-Range: bytes 0-499/15499



&#x20;   Range: bytes=500-

&#x20;   206 Partial Content

&#x20;   Content-Length: 14999

&#x20;   Content-Range: bytes 500-15498/15499



&#x20;   Range: bytes=-500

&#x20;   206 Partial Content

&#x20;   Content-Length: 500

&#x20;   Content-Range: bytes 14999-15498/15499



Kogu logi pikkus on 15499 baiti.

Range on defineeritud BAITIDES, mitte sõnades.



\## Range vastuse päised



&#x20;   200 -> täielik sisu

&#x20;   206 -> osaline sisu

&#x20;   416 -> vahemik ei sobi



Accept-Ranges: bytes näitab, et server toetab baidivahemikke.

Content-Range näitab, milline osa sisust saadeti.

Content-Length näitab vastuse keha pikkust baitides.



range(header, length) arvutab vahemiku.

rangeBody(text, value) tagastab ainult valitud baidid.



\## Accept ja esituse valimine



parseAccept(header) loeb tüübid ja q-väärtused.

q=1 on suurim eelistus, q=0 tähendab keelamist.

Täpsem tüüp on sama q korral üldisest eespool.



pickRepresentation(acceptHeader, offered)

valib sobivaima pakutud esituse või tagastab null.



representationHeaders(type) lisab Content-Type ja Vary: Accept.



\## Kontroll



&#x20;   node public\\check-representation.js

&#x20;   25 kontrolli OK



Kõik 25 automaatset kontrolli läbisid edukalt.

