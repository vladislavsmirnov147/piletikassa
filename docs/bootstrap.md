\# Ülesanne 5 — Bootstrap ja CSS-i jõudlus



\## Bootstrap ja Sass



Kasutasin Bootstrapit ja Sassi. Muutsin põhivärvi enne Bootstrapi importimist.





$primary: #0b3d52;





Failis public/template.scss importisin ainult vajalikud Bootstrapi osad: grid, containers, forms, buttons ja card. Lisaks on kasutusel Bootstrapi põhistiilid ja utilities.



Ma ei importinud näiteks carousel, modal, tooltip ja dropdown komponente, sest minu Piletikassa lehel pole neid praegu vaja.



Sassiga koostasin faili public/template.css.



\## 5000 kaardi jõudluse mõõtmine



Tegin eraldi lehe public/performance.html, kus JavaScript loob 5000 kaarti.



Võrdlesin kahte varianti: tavaline paigutus ja `content-visibility: auto`.



| Variant                    | Aeg       |

|----------------------------|-----------|

| Ilma optimeerimiseta       | 4,10 ms   |

| content-visibility: auto   | 3,20 ms   |



Minu testis oli teine variant 0,90 ms kiirem ehk umbes 22%.



Need on JavaScriptiga tehtud esialgsed mõõtmised, mitte brauseri Layout-etapi täpsed ajad. Tulemus võib mõõtmiste vahel muutuda.



\## CSS-valijate võrdlus



Võrdlesin nelja valijat, kasutades `querySelectorAll()` meetodit.



| CSS-valija        | Aeg       |

|-------------------|-----------|

| .card             | 0,32 ms   |

| div               | 0,30 ms   |

| \* p               | 0,48 ms   |

| #cards .card p    | 0,27 ms   |



Minu mõõtmises oli kõige kiirem #cards .card p ja kõige aeglasem \* p.



See test mõõdab elementide otsimise aega JavaScriptis, mitte CSS-reeglite rakendamise kiirust. Seetõttu ei saa nende tulemuste põhjal öelda, et üks valija on alati teisest kiirem.



\## Kokkuvõte



Sain teada, kuidas Bootstrapit Sassiga kohandada ja kuidas importida ainult vajalikke komponente.



Proovisin ka content-visibility: auto kasutamist ning võrdlesin erinevaid CSS-valijaid.



Mõõtmistulemused sõltuvad arvutist, brauserist ja mõõtmise tingimustest.

