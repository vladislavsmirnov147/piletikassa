

\# Ülesanne 3 - failide üleslaadimine ja turve



\## Kolm kinti, kaks neist valetavad



| allikas              | kas usaldada |

|----------------------|--------------|

| Content-Type päis    | EI           |

| failinime laiend     | EI           |

| faili esimesed baidid | JAH         |



Content-Type päise ja failinime laiendi määrab klient. Neid ei saa usaldada, sest pahatahtlik kasutaja võib need ise muuta.



Faili esimesed baidid ehk signatuur aitavad tuvastada faili tegelikku vormingut.



Näiteks JPEG algab baitidega FF D8 FF, PNG-l on kindel kaheksabaidine signatuur ja PDF algab tekstiga %PDF-.



WebP puhul ei piisa ainult RIFF-signatuurist, sest ka WAV kasutab RIFF-vormingut. WebP tuvastamiseks tuleb kontrollida ka WEBP-tunnust.



Signatuuri kontroll on oluline esimene samm, kuid ei tõesta üksinda, et kogu fail on ohutu.



\## Turvaline failinimi



safeName() genereerib faili salvestamiseks UUID-põhise nime.



Faili laiend määratakse kontrollitud failitüübi järgi, mitte kasutaja antud failinime põhjal.



Algne nimi säilitatakse eraldi kuvanimena, näiteks Content-Disposition päise jaoks.



See aitab vältida olukorda, kus kasutaja antud failinimi määrab salvestuskoha või käivitatava faililaiendi.



Kontrollitud ohtlikud nimed:



\- ../../etc/passwd - kataloogitee ei tohi jõuda salvestusnimesse.

\- pilt.jpg.php - salvestusnimi ei tohi lõppeda .php-ga.

\- CON, NUL, aux.txt - süsteemi erinimesid ei kasutata salvestusnimena.



Ka kuvanimest eemaldatakse ohtlikud märgid, näiteks jutumärgid ja teekonna eraldajad.



\## Faili kontrollimine



checkFile() kontrollib kolme asja: faili sisu, väidetavat Content-Type väärtust ja failinime laiendit.



Kõik kolm peavad omavahel klappima.



Samuti kontrollitakse, et fail ei oleks tühi ega ületaks lubatud suurust.



Kui kasutaja saadab PDF-faili, kuid väidab, et see on PNG, tuleb üleslaadimine tagasi lükata.



Kui failinimi on x.jpg, kuid sisu on PNG, tuleb üleslaadimine samuti tagasi lükata.



Tundmatu sisuga faili ei võeta vastu.



\## Ligipääs: avalik ja kaitstud fail



accessDecision() otsustab, kas faili võib kasutajale väljastada.



Avalik fail on loetav ilma autentimiseta ja võib kasutada pikka vahemälu:



&#x20;   public, max-age=31536000, immutable



Kaitstud faili puhul tuleb õigusi kontrollida iga lugemispäringu korral.



Kui kasutaja ei ole autenditud, tagastatakse 401.



Kui kasutaja on autenditud, kuid tal puudub õigus faili lugeda, tagastatakse 403.



Õiguste otsuse teeb õpetaja antud mayRead(user, file).



Näiteks võib faili lugeda selle omanik või korraldaja rolliga kasutaja.



Kaitstud faili vastus peab kasutama järgmist vahemälupoliitikat:



&#x20;   private, no-store



See takistab kaitstud faili salvestamist HTTP-vahemällu.



Juhuslikult genereeritud URL ei asenda ligipääsukontrolli.



\## Kus faili hoida



|                | skaleerub | allalaadimine |

|----------------|-----------|---------------|

| failisüsteem   | EI        | sinu server   |

| andmebaas      | jah       | sinu server   |

| objektihoidla  | jah       | OTSE hoidlast |



\### Failisüsteem



Failisüsteem on lihtne lahendus ühe väikese serveri jaoks.



Kui rakendus töötab mitmes serverieksemplaris, ei pruugi ühte serverisse salvestatud fail teises serveris olemas olla.



Seetõttu ei sobi lokaalne failisüsteem hästi mitme serveriga lahendusele ilma ühise salvestusruumita.



\### Andmebaas



Andmebaas sobib eriti väikeste failide jaoks, kui faili salvestamine peab olema seotud andmebaasitehinguga.



Faili allalaadimine toimub siiski rakenduse serveri kaudu.



Suured failid võivad andmebaasi koormata ja varundamist keerulisemaks muuta.



\### Objektihoidla



Objektihoidla sobib mitme serveriga rakendusele ja suurte failide hoidmiseks.



Faili saab alla laadida otse hoidlast, nii et rakenduse server ei pea kogu faili sisu ise edastama.



See aitab vähendada serveri koormust ja muudab skaleerimise lihtsamaks.



Samas ei ole objektihoidla alati parim valik: arvestada tuleb teenuse hinna, päringutasude ja andmeedastuse kuludega.



Kaitstud faili puhul peab rakendus enne allalaadimist õigusi kontrollima ning vajaduse korral väljastama lühiajalise ligipääsu.



\## Piletikassa näide



Piletikassas võivad korraldajad laadida üles sündmuste plakateid ja muid faile.



Avalik plakat võib kasutada pikka vahemälu, sest sama faili loevad paljud külastajad.



Kaitstud fail, näiteks ainult korraldajale mõeldud dokument, peab läbima õiguste kontrolli iga kord.



Kui Piletikassa töötab mitmes serverieksemplaris, on objektihoidla tavaliselt sobivam kui ühe serveri lokaalne failisüsteem.



\## Proovijooks



Käivitatud käsk:



&#x20;   node materials\\check-files.js



Tulemus:



&#x20;   34 kontrolli OK



Kõik 34 õpetaja kontrolli läbisid edukalt.



\## Kokkuvõte



Üleslaaditud fail on kasutaja sisend ja seda tuleb kontrollida samamoodi nagu vormiandmeid.



Faili tegelik tüüp tuvastatakse sisust, salvestusnimi genereeritakse serveris ning ligipääsuõigusi kontrollitakse iga kaitstud faili lugemisel.



Failide hoidmise viis sõltub rakenduse suurusest, serverieksemplaride arvust ja allalaadimise koormusest.



