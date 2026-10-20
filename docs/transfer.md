

\# Ülesanne 3 - andmete edastamise neli viisi



Sama ost: event=3, qty=2, buyer=Mari



\## Mõõdetud tulemused



| viis          | Content-Type                       | keha | kood |

|---------------|------------------------------------|-----:|-----:|

| päringustring | - (keha ei ole)                    |    0 | 415  |

| vormiandmed   | application/x-www-form-urlencoded |   24 | 201  |

| JSON          | application/json                   |   34 | 201  |

| multipart     | multipart/form-data                |  356 | 201  |

| tundmatu      | text/plain                         |    1 | 415  |



\## Mida vorming kaotab



&#x20;   urlencoded: qty=2  -> SÕNE "2"

&#x20;   JSON:       {"qty":2} -> ARV 2



Urlencoded edastab vormiväljade väärtused sõnedena.

JSON säilitab arvu ja teksti tüübi.



\## Millal kasutada päringustringi



Päringustring sobib otsinguks ja filtriteks.

Näiteks /api/events?venue=Tallinn



Ostu loomine ei sobi päringustringiga,

sest ostu andmed peaksid olema päringu kehas.

Server tagastas 415 Unsupported Media Type.



\## Miks charset on oluline



Charset määrab teksti kodeeringu.

Näiteks täpitähed: õ, ä, ö, ü.



Vale kodeeringu korral võivad täpitähed

brauseris kuvada valesti.



\## Location päis



201 Created tähendab, et ressurss loodi.

Location näitab loodud ressursi aadressi.



Ilma Location-päiseta peab klient ressursi

aadressi leidmiseks tegema lisapäringu.



\## Mahu võrdlus



&#x20;   urlencoded: 24 baiti

&#x20;   JSON:       34 baiti

&#x20;   multipart: 356 baiti



Multipart on 356 / 24 = 14,83 korda

suurem kui urlencoded.



Multipart lisab igale väljale piiritähised

ja päised, mistõttu on keha suurem.



\## Content-Type ja Accept



Content-Type ütleb, mis vormingus päringu keha on.

Accept ütleb, millist vastuse vormingut klient soovib.



\## Kokkuvõte



Päringustring sobib otsinguks ja filtriteks.

Urlencoded sobib tavalise HTML-vormi jaoks.

JSON sobib API-de ja struktureeritud andmete jaoks.

Multipart sobib failide üleslaadimiseks.



Väikese vormi korral on urlencoded kompaktne.

JSON säilitab andmetüübid paremini.

Multipart on failide saatmisel kasulik,

kuid lisab päringu kehale palju andmeid.



