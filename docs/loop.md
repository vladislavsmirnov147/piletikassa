\# Ülesanne 1 - sündmuste tsükkel mõõdetuna



\## Kolm järjekorda - mõõdetud



&#x20;   1 sünkroonne algus

&#x20;   2 sünkroonne lõpp

&#x20;   3 mikroülesanne

&#x20;   4 queueMicrotask

&#x20;   5 setTimeout 0       <- VIIMANE, kuigi viivitus on null



\## Mikroülesanded söövad järjekorra ära



&#x20;   mikro 1, mikro 2, mikro 3, makro 1, makro 2



mikro 2 ja 3 EI OLNUD OLEMAS, kui makro 1 juba järjekorras seisis.



\## setTimeout ei ole kellaaeg



&#x20;   delay(lubatud 100, blokeerin 250) -> tegelik 250 ms



\## Minu ennustused enne käivitamist



\### threeQueues()



Ennustasin järgmist järjekorda:



&#x20;   1 sünkroonne algus

&#x20;   2 sünkroonne lõpp

&#x20;   3 mikroülesanne

&#x20;   4 queueMicrotask

&#x20;   5 setTimeout 0



Põhjus: JavaScript täidab kõigepealt sünkroonse koodi, seejärel kõik mikroülesanded ja alles siis makroülesanded.



\### microBeforeMacro()



Ennustasin järgmist järjekorda:



&#x20;   mikro 1, mikro 2, mikro 3, makro 1, makro 2



Põhjus: mikroülesanded täidetakse enne makroülesandeid. Ka mikroülesannete sees loodud uued mikroülesanded jõuavad enne makroülesandeid käivituda.



\### delay(100, 250)



Lubatud aeg: 100 ms.

Ennustatud tegelik aeg: umbes 250 ms.



Põhjus: sünkroonne blokeerimine kestab 250 ms ja setTimeout ei saa enne selle lõppu käivituda.



\## Ennustuste ja tulemuste võrdlus



threeQueues() järjekord vastab ennustusele.



microBeforeMacro() järjekord vastab ennustusele.







delay(100, 250) tegelik mõõdetud aeg oli 250 ms. Ennustus vastas tulemusele.







\## Miks mikro 2 ja mikro 3 jõudsid enne makro 1?



Promise'i ahel loob uusi mikroülesandeid.



JavaScript tühjendab mikroülesannete järjekorra enne järgmise makroülesande käivitamist.



Seetõttu käivituvad mikro 2 ja mikro 3 enne makro 1, kuigi makro 1 oli juba varem järjekorras.



\## Miks setTimeout käivitub hiljem?



setTimeout(f, 0) ei käivita funktsiooni kohe.



See lisab funktsiooni makroülesannete järjekorda.



Kõigepealt peab lõppema sünkroonne kood ja seejärel peavad täituma mikroülesanded.



setTimeout(f, 100) tähendab, et funktsioon võib käivituda kõige varem 100 ms pärast, mitte täpselt sellel hetkel.



Kui JavaScripti lõim on blokeeritud 250 ms, peab taimer ootama.



\## Tagasikutsed ja lubadused



Tagasikutse ehk callback on funktsioon, mis antakse teisele funktsioonile hilisemaks käivitamiseks.



Kolme pesastatud tagasikutse korral peab järgmine samm ootama eelmise lõppu.



Promise võimaldab asünkroonse tegevuse tulemust käsitleda .then() ja .catch() abil.



async/await aitab asünkroonset koodi loetavamalt kirjutada.



\## Kolm kohta, kus see piletikassas maksma läheb



1\. Sündmuste laadimine serverist peab olema asünkroonne, et leht ei hanguks.



2\. Piletite ostmisel tuleb oodata serveri vastust enne ostu kinnitamist.



3\. Pikk sünkroonne arvutus võib blokeerida nupuvajutused ja lükata taimerite käivitumist edasi.



\## Kokkuvõte



JavaScript täidab kõigepealt sünkroonse koodi.



Seejärel täidetakse kõik mikroülesanded.



Alles pärast seda käivitatakse järgmine makroülesanne.



Asünkroonne ei tähenda paralleelset täitmist.



Taimeri viivitus näitab kõige varasemat võimalikku käivitusaega, mitte täpset käivitusaega.

