

\# Ülesanne 4 - taustatööd, cron ja idempotentsus



\## Idempotentsusvõti: neli olukorda



| olukord                       | tulemus             |

|-------------------------------|---------------------|

| uus võti                      | next                |

| sama võti, sama keha, pooleli  | running             |

| sama võti, sama keha, valmis   | repeat + SAMA vastus |

| sama võti, ERI keha            | conflict            |



Idempotentsusvõti tuleb kliendilt, sest server ei saa kahte eraldi päringut alati eristada.



Kui võti on uus, võib server tööga alustada.



Kui sama võtme ja sama sisuga päring on juba pooleli, tagastatakse running ning tööd ei alustata uuesti.



Kui töö on valmis, tagastatakse repeat koos varem salvestatud vastusega.



Kui sama võtit kasutatakse teistsuguse päringu sisuga, on tulemuseks conflict. See on kliendi viga, mitte korduspäring.



Ebaõnnestunud töö korral vabastatakse võti, et klient saaks uuesti proovida.



Aegunud idempotentsuskirjeid võib eemaldada pärast määratud TTL-i möödumist.



\## Järjekord, korduskatsed ja surnukirjad



Taustatööde järjekord võimaldab teha aeglaseid tegevusi väljaspool HTTP-päringut.



createQueue() lisab töid järjekorda ja töötleb neid vastava käsitleja abil.



Kui töö ebaõnnestub, proovitakse seda uuesti kuni lubatud katsete arvuni.



Kui ka viimane katse ebaõnnestub, liigub töö surnukirjade nimekirja ehk dead-letter queue'sse.



Surnukirjas säilivad töö andmed, vea kirjeldus ja katsete arv. Nii saab probleemi hiljem uurida ning töö vajaduse korral uuesti käivitada.



Sama idempotentsusvõtmega tööd ei lisata järjekorda kaks korda.



Kolm korda ebaõnnestunud töö ei tohi märkamatult kaduda.



\## E-kiri pärast ostu



mailJob(order, event) koostab e-kirja saatmise töö.



Töö sisaldab saaja e-posti aadressi, sündmuse nime ja ostu identifikaatorit.



Korduvusvõti on seotud konkreetse ostuga:



&#x20;   email:order:7001



Nii ei lisata sama ostu kinnituskirja järjekorda mitu korda.



E-kirja saatmine ei tohi olla ostu salvestamise eeltingimus.



Kui SMTP-server ei tööta, peab ost jääma alles ning e-kirja saatmist saab hiljem korrata.



\## Cron ja ajaakna võti



windowKey() koostab korduvusvõtme ajavahemiku põhjal.



Näiteks ühe tunni jooksul annab sama töö sama võtme.



Järgmises tunnis on võti erinev.



See aitab vältida sama ajastatud töö korduvat lisamist ühes ajaaknas.



Cron võib käivituda mitu korda, mistõttu peab töö ise samuti olema idempotentne.



\## Aegunud hoiud - idempotentne



&#x20;   hoid 1: ootel,  aegus  -> vabastatakse

&#x20;   hoid 3: OSTETUD, aegus -> JÄÄB

&#x20;   teine jooks            -> ei tee midagi



releaseExpiredHolds() vabastab ainult aegunud hoiud, mille seis on pending.



Ostetud hoidu ei vabastata isegi siis, kui selle algne aegumisaeg on möödas.



Tulevikus aeguvat hoidu ei muudeta.



Pärast vabastamist muutub hoiu seis expired.



Kui sama cron-töö käivitatakse uuesti, ei vabastata sama hoidu teist korda.



Seetõttu tuleb kontrollida nii aegumisaega kui ka hoiu seisundit.



\## Piletikassa näide



Piletikassas võib ostu kinnitamine ja e-kirja saatmine toimuda eraldi töödena.



Ostu korduvusvõti aitab vältida sama ostu topelttöötlemist.



E-kirjad pannakse järjekorda, et ajutine SMTP-tõrge ei katkestaks ostu.



Cron kontrollib aegunud kohtade broneeringuid ja vabastab ainult need, mis on endiselt ootel.



Mitme serveri korral tuleb idempotentsuskirjeid ja järjekorda hoida ühises püsivas andmehoidlas. Selle ülesande lahendus kasutab kontrollide jaoks mälupõhiseid andmestruktuure.



\## Proovijooks



Käivitatud käsk:



&#x20;   node materials\\check-background-jobs.js



Tulemus:



&#x20;   31 kontrolli OK



Kõik 31 õpetaja kontrolli läbisid edukalt.



\## Kokkuvõte



Idempotentsus kaitseb korduvate päringute ja topelttöötluse eest.



Taustatööde järjekord võimaldab ebaõnnestunud tegevusi korrata ning surnukirjade nimekiri aitab lõplikke tõrkeid uurida.



Cron-töö peab olema ohutu ka siis, kui see käivitub mitu korda.



Oluline on kontrollida andmete tegelikku seisundit, mitte ainult möödunud aega.



