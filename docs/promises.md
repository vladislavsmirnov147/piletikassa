\# Ülesanne 2 - lubadused, async/await ja mitu päringut



\## Järjest või korraga - kolm sõltumatut 80 ms tööd

| viis                          | aeg    |

|-------------------------------|--------|

| for + await sees (järjest)    | 277 ms |

| Promise.all (korraga)         | 91 ms  |



3,0 KORDA. Järjest võtab SUMMA, korraga võtab MAKSIMUMI.



Mõõtsin kolme sõltumatu töö täitmist. Järjest töötades kulus 277 ms, sest iga järgmine töö pidi ootama eelmise lõppu. Promise.all abil käivitusid kõik kolm tööd korraga ja aega kulus ainult 91 ms.



Aegade vahe oli 186 ms. Korraga töötamine oli umbes 3 korda kiirem.



\## allSettled - üks kukkuja ei kaota teisi

&#x20;   fulfilled: \["seatmap", "prices"]

&#x20;   rejected:  \["soodustused kukkusid"]



all-iga oleks kadunud TERVE leht, mitte ainult soodustuste riba.



Promise.allSettled ootab ära kõik lubadused, isegi kui mõni neist ebaõnnestub. Meie näites õnnestusid istekohtade plaan ja hinnad, aga soodustuste päring andis vea.



Promise.all puhul läheks kogu ühine päring vea tõttu tagasi lükatud olekusse. Promise.allSettled puhul saan õnnestunud tulemusi ikkagi kasutada. Piletikassas tähendaks see, et kasutaja näeb endiselt istekohti ja hindu, kuigi soodustuste osa ei tööta.



\## chain() - ette antud näide



Käivitasin õpetaja antud chain(1) funktsiooni.



Tulemus:

&#x20;   result: { id: 1, name: "Sügiskontsert", price: 24 }



Jälg:

&#x20;   1. sain sündmuse

&#x20;   2. lisasin hinna

&#x20;   3. finally



Kõigepealt saadi sündmuse andmed, siis lisati hind ja lõpuks käivitus finally. Funktsioon tagastas sündmuse nime ja hinna õigesti.



\## chainWithAwait() - minu lahendus



Kirjutasin chainWithAwait(id) funktsiooni async/await abil ja kasutasin try/catch/finally plokke.



See annab sama tulemuse nagu õpetaja chain(id):

&#x20;   result: { id: 1, name: "Sügiskontsert", price: 24 }



Jälg on samuti sama:

&#x20;   \["sain sündmuse", "lisasin hinna", "finally"]



Minu jaoks on async/await variant lihtsam lugeda, sest tegevused on kirjutatud järjest. try/catch abil saan vead kinni püüda ja finally käivitub ka siis, kui funktsioon tagastab tulemuse.



\## finally ei muuda tagastusväärtust



Õpetaja chain() näites tagastab finally sõne "seda ignoreeritakse", aga lõpptulemus jääb samaks.



Sündmuse nimi on ikka "Sügiskontsert" ja hind on 24.



See näitab, et finally sees tavalise väärtuse tagastamine ei asenda lubaduse varasemat tulemust.



\## async tagastab alati lubaduse



Ka siis, kui async funktsioon tagastab tavalise arvu, saab väljakutsuja Promise'i.



Näiteks:



&#x20;   async function number() {

&#x20;     return 5;

&#x20;   }



&#x20;   const result = number();

&#x20;   console.log(result instanceof Promise); // true



Arvu 5 saab kätte await abil:



&#x20;   console.log(await number()); // 5



Seega async funktsiooni tulemus tuleb vajaduse korral ära oodata.



\## sequential() ja parallel()



Katsetasin kolme 80 ms pikkust tööd.



sequential() käivitab järgmise töö alles siis, kui eelmine on valmis. Seetõttu on koguaeg ligikaudu kõigi tööde aegade summa.



parallel() käivitab tööd korraga ja Promise.all ootab nende kõigi lõppu. Seetõttu sõltub koguaeg peamiselt kõige aeglasemast tööst.



Piletikassas sobib paralleelne lahendus siis, kui näiteks sündmuse andmeid, hindu ja istekohtade infot saab küsida üksteisest sõltumatult.



Kui järgmine päring vajab eelmise tulemust, tuleb need teha järjest.



\## withTimeout() - mida ta ei tee



Kontrollisin withTimeout() funktsiooni.



Kui päring võtab 200 ms ja ajalimiit on 50 ms, saan vea:

&#x20;   Ajalõpp 50 ms



Kui päring lõpetab 5 ms jooksul ja ajalimiit on 100 ms, saan tulemuse:

&#x20;   kiire



withTimeout() kasutab Promise.race lahendust. See tähendab, et võidab esimesena lõppenud lubadus.



Oluline on see, et Promise.race ei katkesta aeglast tööd automaatselt. Aeglane päring võib taustal edasi töötada ka siis, kui ajalimiidi lubadus juba vea andis.



Kontrollfail kinnitas, et ajalimiit töötab, kuid eraldi täpset millisekundite mõõtmist ma veel ei teinud.



\## Kontrollide tulemus



Käivitasin õpetaja antud kontrollfaili:



&#x20;   node materials/check-promises.js



Tulemus:

&#x20;   \[mõõdetud] sequential 277 ms · parallel 91 ms

&#x20;   17 kontrolli OK



Kõik 17 kontrolli läbisid edukalt.



\## Mida sellest Piletikassa jaoks õppisin



1\. Sõltumatud päringud tasub teha korraga, sest nii saab kasutaja tulemused kiiremini kätte.

2\. Kui üks kõrvaline päring ebaõnnestub, ei pea kogu leht katki minema. Promise.allSettled aitab ülejäänud andmed alles hoida.

3\. Ajalimiit aitab liiga kaua ootamist vältida, aga Promise.race ei peata aeglast päringut ise. Vajaduse korral tuleb päring eraldi katkestada.



\## Lahknev jälg



Võrdlesin chain(1) ja chainWithAwait(1) tulemusi.



Mõlema funktsiooni jälg oli sama:

&#x20;   \["sain sündmuse", "lisasin hinna", "finally"]



Ka tagastatud tulemus oli sama:

&#x20;   { id: 1, name: "Sügiskontsert", price: 24 }



Lahknevusi ei olnud. Mõlemad funktsioonid teevad samad tegevused samas järjekorras. Erinevus on ainult selles, et chain() kasutab .then() ahelat ja chainWithAwait() kasutab async/await süntaksit.

