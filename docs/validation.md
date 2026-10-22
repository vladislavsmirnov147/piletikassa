

\# Ülesanne 4 - valideerimine ja ühtne veakuju



\## Kõik vead korraga



Näidissisend:



&#x20;   { event: -1, qty: 0, buyer: "M", email: "x" }



Tulemus:



&#x20;   fields: { event, qty, buyer, email }    KÕIK NELI



OrderSchema kontrollib kõiki välju korraga.

Kasutaja ei pea parandama nelja vigast välja neljas eraldi saatmises.



OrderSchema kasutab .strict(), seega tundmatu väli on viga.

Näiteks role: "admin" ei tohi vaikselt kaduda.



Päringu kehas ei kasutata coerce'i.

Kui qty on sõne "2", peab klient saatma õige andmetüübi.



\## Veakuju



| väli   | kellele  | kas tohib muutuda |

|--------|----------|-------------------|

| err    | inimesele | jah (tõlge) |

| code   | MASINALE  | EI |

| fields | vormile   | uusi võib lisanduda |



Ühtne veakuju võimaldab kliendil vigu õigesti töödelda.



err on inimesele mõeldud sõnum ja seda võib tõlkida.

code on masinloetav väärtus ning peab jääma stabiilseks.

fields näitab, millised vormiväljad vajavad parandamist.



INVALID\_INPUT vastab HTTP 422 staatusele.

NOT\_FOUND vastab HTTP 404 staatusele.

FORBIDDEN vastab HTTP 403 staatusele.

CONFLICT vastab HTTP 409 staatusele.



\## Vahevara peab req.body ASENDAMA



&#x20;   enne:   "  Mari  "

&#x20;   pärast: "Mari"



Valideerimise vahevara ei tohi ainult sisendit kontrollida.

See peab asendama req.body Zodi puhastatud andmetega.



Nii kasutab järgmine marsruut juba kontrollitud väärtusi.



Päringustringi puhul salvestatakse puhastatud tulemus

req.request sisse, sest Expressi req.query on kirjutuskaitstud.



\## Päringustringi valideerimine



ListQuery kasutab C07 Ex3 lubatud sortimis- ja filtrivälju.



Päringustringis võib kasutada arvude teisendamist,

sest URL-i parameetrid saabuvad sõnedena.



Vigane page või per kasutab vaikeväärtust.

Liiga suur per kärbitakse PAGE\_MAX = 100 peale.



Vigane filter või tundmatu sortimisväli annab vea,

sest selle vaikne eiramine muudaks päringu tulemust.



Tundmatud päringuparameetrid eemaldatakse .strip() abil.



\## Teksti puhastamine ja XSS



cleanText() eemaldab juhtmärgid, kuid säilitab

HTML-märgid ja reavahetused.



Näiteks:



&#x20;   <b>Sügis</b>



jääb sisendis alles.



Mitmerealine märkus peab jääma mitmerealiseks.



XSS-kaitse tehakse väljundis, mitte sisendis.

Sisendist HTML-märkide eemaldamine võib rikkuda andmeid

ega taga iseenesest turvalist väljundit.



\## Proovijooks



Käivitatud käsk:



&#x20;   node materials\\check-validate.js



Viimane tulemus:



&#x20;   41 kontrolli OK, 2 KATKI



Läbisid tellimuse skeemi, päringustringi, muudatuse skeemi,

valideerimise vahevara ja teksti puhastamise kontrollid.



Kaks teenuse vigade käsitlemise kontrolli ei läbinud:

NOT\_FOUND ja FORBIDDEN ei saanud oodatud masinloetavat koodi.



\## Kokkuvõte



Piletikassa valideerimine kasutab Zodi skeeme,

lubatud väljade loendeid ja ühtset veakuju.



Valideerimine kontrollib sisendi kuju ja andmetüüpe.

Ärireeglid jäävad teenusekihti.



Ühtne veakuju aitab kliendil näidata arusaadavaid

veateateid ning töödelda stabiilseid veakoode.



