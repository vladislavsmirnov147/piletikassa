

\# Ülesanne 5 - vood ja tagasisurve



\## MÕÕDETUD: 120 MB fail, 5 991 864 rida



| viis                      | RSS kasv |

|---------------------------|----------|

| fs.readFile (kõik mällu)  | 515 MB   |

| voog rea kaupa            | 21 MB    |



24,5 KORDA vähem. Ja 515 MB on peaaegu NELI KORDA faili suurus:

fail on mälus kaks korda (puhver + sõne) ja split teeb

ligi 6 miljonit sõnet.



Mõlemad meetodid lugesid sama arvu ridu: 5 991 864.

Faili suurus oli 120 MB.



Mälu mõõdeti ERALDI PROTSESSIDES, sest samas protsessis

võib eelmise katse mälu jääda prügikoristust ootama

ja tulemused ei ole võrreldavad.



\## Tükk ei ole rida



tükk 1: "date,event,tic"

tükk 2: "kets\\n2026-10-04,1,2\\n2026-1"



Ilma jäägita kaob IGA tükipiiri peal olev rida.



createReadStream() annab andmed tükkidena, kuid

üks tükk ei pruugi sisaldada tervet CSV-rida.

Rida võib alata ühes tükis ja lõppeda järgmises.



csvToRows() on Transform-voog, mis säilitab

pooliku rea jäägis (remainder).

Kui saabub järgmine tükk, liidetakse see jäägiga

ja alles siis eraldatakse terved read.



Testimiseks jagati CSV-sisu 7-baidisteks tükkideks.

Kõik read jäid terveks.



\## Viimase rea töötlemine



CSV-faili viimane rida ei pruugi lõppeda

reavahetusega (\\n).



flush() töötleb voo lõpus allesjäänud andmed,

et viimane rida ei läheks kaduma.



Ilma flush()-ita võiks viimane rida jääda lugemata.



\## Tagasisurve ehk backpressure



writeWithBackpressure() kirjutab andmed Writable-voogu.



Kui write() tagastab false, tähendab see, et

kirjutuspuhver on täitunud ja kirjutamine peab ootama.



Programm ootab drain-sündmust ning jätkab alles siis,

kui voog saab jälle andmeid vastu võtta.



Testis kirjutati 200 tükki, igaüks 256 baiti.

Kõik 51 200 baiti jõudsid kohale ja tagasisurve

peatas kirjutamise vähemalt ühe korra.



Kui write() tagastusväärtust eirata, võivad andmed

koguneda mällu ja voogedastuse eelis kaob.



\## pipeline ja vigade käsitlemine



pipeline() ühendab vood, edastab vead

ja hoolitseb voogude sulgemise eest.



Tavaline pipe() ei korralda kogu veakäsitlust

automaatselt samal viisil.



sendAsStream() saadab faili HTTP-vastusesse

ilma kogu faili korraga mällu laadimata.



\## Proovijooks



CSV-faili loomine:



node materials\\make-big-file.js 120



Kontrollide käivitamine:



node materials\\check-streams.js



Mõõtmistulemused:



\[MÕÕDETUD] fail 120 MB, 5 991 864 rida

allInMemory : 515 MB

streamRows  : 21 MB (24.5x vähem)



11 kontrolli OK



\## Kokkuvõte



Voogedastus sobib suurte failide töötlemiseks,

sest kogu faili ei ole vaja korraga mällu laadida.



120 MB CSV-faili puhul oli voogedastus

mälukasutuse poolest 24,5 korda säästlikum.



Olulised põhimõtted on poolikute ridade säilitamine,

flush() kasutamine ja tagasisurve austamine.



