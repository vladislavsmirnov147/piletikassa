\# Ülesanne 2 - Vastutuse jaotus



\## Klassifikatsioon



| # | Rakenduse osa                                              | Klient | Server | Põhjendus                                                                              |

|---|------------------------------------------------------------|--------|--------|----------------------------------------------------------------------------------------|

| 1 | Sündmuste nimekirja kuvamine                               | Jah    | Ei     | Klient kuvab kasutajale sündmuste nimekirja.                                           |

| 2 | Kuupäevavälja vorming                                      | Jah    | Jah    | Klient aitab kuupäeva õigesti sisestada, server kontrollib saadud väärtust.            | 

| 3 | "Vabu kohti vähemalt" filtri rakendamine                   | Jah    | Jah    | Klient saab filtreerida juba laaditud andmeid, server saab filtreerida andmebaasist saadavaid tulemusi. |

| 4 | Kontroll, kas väli on täitmata                             | Jah    | Jah    | Klient annab kohe tagasisidet, server kontrollib andmeid enne töötlemist.              |

| 5 | Kontroll, kas sündmus on välja müüdud                      | Jah    | Jah    | Klient võib näidata, et piletid on otsas, kuid server peab seda enne ostu kontrollima. |

| 6 | Kontroll, kas kasutaja on sisse logitud                    | Jah    | Jah    | Klient kohandab kasutajaliidest, server kontrollib tegelikku sisselogimise olekut.     |

| 7 | Kontroll, kas kasutaja on selle sündmuse korraldaja        | Ei     | Jah    | Server peab kontrollima kasutaja õigusi, sest klienti saab muuta.                      |

| 8 | Ootejärjekorra koha arvutamine                             | Ei     | Jah    | Server peab arvutama järjekorra koha ühtsete ja usaldusväärsete andmete põhjal.        |

| 9 | Saaliplaani kohtade genereerimine ridade ja numbrite kaupa | Jah    | Jah    | Klient kuvab saaliplaani, server määrab kehtivad kohad ja nende saadavuse.             |

| 10 | Müügiaruande arvutamine                                   | Ei     | Jah    | Server arvutab aruande usaldusväärsete müügiandmete põhjal.                            |

| 11 | Tulemuste sortimine juba laaditud tabelis                 | Jah    | Ei     | Klient saab juba laaditud tabelit sortida ilma uue serveripäringuta.                   |

| 12 | Andmebaasi parool                                         | Ei     | Jah    | Andmebaasi parool peab jääma serverisse ja seda ei tohi kliendile avaldada.            |

&#x20;





\## Kolm asja, mis ei tohi kunagi kliendile jõuda



1\. \*\*Andmebaasi parool\*\* – Andmebaasi parool peab jääma serverisse, sest selle avaldamine võimaldaks ründajal andmetele ligi pääseda.



2\. \*\*Salajased API-võtmed\*\* – Salajasi API-võtmeid ei tohi kliendile saata, sest keegi võib neid kopeerida ja teenuseid ilma loata kasutada.



3\. \*\*Teiste kasutajate privaatsed andmed\*\* – Kasutajate isikuandmeid ei tohi kõrvalistele isikutele avaldada, sest see rikuks nende privaatsust ja ohustaks andmete turvalisust.

&#x20;





\## Kolm rünnakut



| Rünnak                                   | Kuidas                                      | Miks serveripoolne kontroll aitab |

|------------------------------------------|---------------------------------------------|---------------------------------------------------------------|

| 1. Välja müüdud üritusele pileti ostmine | Ründaja muudab brauseris ostunupu olekut või saadab ostupäringu otse serverile, kuigi pileteid enam ei ole. | Server kontrollib enne ostu, kas vabu kohti on piisavalt, ja keeldub ostust, kui kohad on otsas. |

| 2. Teise kasutaja ürituse muutmine | Ründaja saadab päringu teise korraldaja ürituse muutmiseks, minnes kasutajaliidese piirangutest mööda. | Server kontrollib, kas sisselogitud kasutaja on selle ürituse korraldaja. |

| 3. Lubamatu andmete sisestamine | Ründaja eemaldab brauseris vormi piirangud ja saadab näiteks negatiivse vabade kohtade arvu. | Server kontrollib sisestatud andmeid ja lükkab vigased väärtused tagasi. |

&#x20;

