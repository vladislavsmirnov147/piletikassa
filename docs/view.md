

\# Ülesanne 3 - DOM kui puu: olek -> vaade



\## Nimekirja renderdamine - 2000 rida



| viis                     | aeg     |

|--------------------------|---------|

| tsüklis appendChild      | 1.70 ms |

| replaceChildren(...rows) | 0.30 ms |

| DocumentFragment         | 1.50 ms |



Mõõtmised tehti brauseris 2000 reaga, kasutades performance.now().



Selles mõõtmises oli kõige kiirem replaceChildren(...rows).



Vahe on millisekundites, MITTE kordades - brauser pakib paigutuse kokku.



\## Elav ja staatiline kollektsioon - kümme elementi, tsükkel eemaldab



| kollektsioon                | eemaldas | jäi alles |

|----------------------------|----------|-----------|

| elav getElementsByClassName | 5        | 5         |

| staatiline querySelectorAll | 10       | 0         |



Elav kollektsioon lüheneb keset tsüklit ja iga teine element jääb vahele.



Staatiline kollektsioon ei muutu DOM-i elementide eemaldamisel.



\## Olek ja vaade



Rakenduses on üks olekuobjekt: events, sort, dir, search ja loading.



forView(state) arvutab oleku põhjal kuvatavad sündmused.



Otsing toimub sündmuse nime ja toimumiskoha järgi.



Pärast filtreerimist sorteeritakse tulemused.



forView(state) tagastab rows ja state.



draw(rows, state) kuvab tulemused DOM-is.



Vaade ei kirjuta olekuobjekti tagasi.



setState(changes) muudab olekut ja käivitab uue renderdamise.



readState() tagastab oleku koopia, mitte algset objekti.



\## Kokkuvõte



Olek on rakenduse andmete tõe allikas ja vaade sõltub olekust.



DOM-i muutmiseks saab kasutada appendChild, replaceChildren ja DocumentFragment.



getElementsByClassName tagastab elava kollektsiooni.



querySelectorAll tagastab staatilise kollektsiooni.



Elava kollektsiooni muutmine tsükli ajal võib põhjustada elementide vahelejätmist.



