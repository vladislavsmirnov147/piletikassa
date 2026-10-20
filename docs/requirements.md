

\# Ülesanne 6 — Nõuded ja arhitektuuri valik



\## Rakenduse eesmärk



Piletikassa on veebirakendus, kus kasutaja saab leida üritusi, valida pileteid ja neid osta.



Kolm kõige olulisemat nõuet:

1\. Kasutaja leiab sobiva ürituse ja näeb vabu kohti.

2\. Kasutaja saab valida pileti ja selle eest maksta.

3\. Süsteem väldib sama koha müümist mitmele inimesele.



\## Rollid



Kasutaja — globaalne roll. Saab vaadata üritusi ja osta pileteid.



Korraldaja — ühe sündmuse ulatuses. Saab hallata enda loodud sündmust.



Süsteemihaldur — globaalne roll, kuid haldab ainult toimumiskohti.



Korraldaja ei ole eraldi konto liik. See on kasutaja ja sündmuse vaheline seos. Sündmuse looja on selle sündmuse korraldaja.



Sama kasutaja võib olla ühe sündmuse korraldaja ja teise sündmuse tavaline ostja.



\## Funktsioonide tähtsuse järjekord



1\. Ürituse leidmine

2\. Pileti või koha valimine

3\. Pileti eest maksmine

4\. Piletiga sündmusele sisenemine

5\. Sündmuste loomine ja muutmine

6\. Ostetud piletite vaatamine

7\. Toimumiskohtade haldamine



Esimesed neli funktsiooni on kõige tähtsamad, sest need moodustavad ühe tervikliku tegevuse: tule, vali, maksa, sisene.



Kõigepealt peab kasutaja ürituse leidma. Seejärel valib ta pileti või koha, maksab selle eest ja saab piletiga sündmusele siseneda.



Kui üks neist sammudest ei tööta, ei saa kasutaja kogu protsessi lõpuni teha.



\## Andmete üldpilt



kasutaja --< sündmus >-- toimumiskoht --< saaliplaan --< koht

&#x20;               |                                    |

&#x20;               +--< hinnaklass                      |

&#x20;               |                                    |

&#x20;               +--< ost --< pilet >-----------------+

&#x20;                           |

&#x20;                           +--< sissepääs



Peamised olemid on kasutaja, sündmus, toimumiskoht, saaliplaan, koht, hinnaklass, ost, pilet ja sissepääs.



Kasutaja võib luua sündmuse ja olla selle korraldaja.



Sündmus toimub kindlas toimumiskohas. Toimumiskohal võib olla saaliplaan koos kohtadega.



Sündmusel võivad olla erinevad hinnaklassid.



Kasutaja teeb ostu, mis võib sisaldada mitut piletit. Pilet võib olla seotud kindla kohaga.



Sissepääsu kirje näitab, kas piletit on juba kasutatud.



\## Koha ajutine hoidmine



Kui kasutaja valib koha, peab süsteem seda ajutiselt hoidma.



Hoid on eraldi olem, mitte ostu staatus.



Hoid sisaldab kohta, ostjat ja aegumisaega.



Kui ostja ei lõpeta ostu õigel ajal, aegub hoid automaatselt ja koht muutub jälle vabaks.



Nii saab vähendada sama koha topeltmüügi ohtu.



\## Arhitektuurimudelite võrdlus



| mudel         | kes hoiab andmeid | kes otsustab | siin      |

|---------------|------------------|--------------|-----------|

| monoliit      | üks masin        | üks programm | võimalik  |

| p2p           | igal osalejal    | igaüks       | ei sobi   |

| klient-server | server           | server       | sobib     |



Monoliidis töötab kogu rakendus ühe tervikuna. Seda võib olla lihtne alustada, kuid suurema süsteemi muutmine võib muutuda keeruliseks.



P2P puhul hoiavad osalejad andmeid ise ja suhtlevad omavahel otse. Piletikassa jaoks see ei sobi, sest kõik kasutajad peavad nägema samu vabu kohti.



P2P sobiks paremini näiteks failide jagamiseks, kus ei ole vaja ühte keskset ostuotsust.



Klient-server mudelis kasutab ostja veebilehte, kuid server hoiab ühiseid andmeid ja kontrollib ostmist.



\## Miks valin klient-server arhitektuuri?



Piletikassa peab vältima sama koha topeltmüüki.



Kui kaks inimest proovivad korraga sama kohta osta, peab server kontrollima, kas koht on veel vaba.



Brauser üksi ei saa seda usaldusväärselt teha, sest eri kasutajate brauserid ei tea alati üksteise tegevustest.



Server saab hallata ajutisi hoide ja kinnitada ostu ühe tehinguna.



Seetõttu sobib Piletikassale klient-server arhitektuur.



\## Mida CSS tegi JavaScripti asemel?



CSS Grid koos auto-fit ja minmax() võimalustega paigutab kaardid automaatselt vastavalt vabale ruumile.



Subgrid aitab kaartide sisu joondada.



@container võimaldab kujundust muuta ümbrise suuruse järgi.



clamp() muudab pealkirjade suurust sujuvalt.



:focus-visible näitab klaviatuuriga liikudes fookust.



:invalid ja :user-invalid võimaldavad vormiväljade välimust muuta vastavalt nende kehtivusele.



prefers-color-scheme ja color-scheme aitavad arvestada kasutaja teemaeelistusega.



JavaScripti on endiselt vaja näiteks ostuvormi veateadete kuvamiseks ja e-posti aadresside võrdlemiseks.



CSS tegeleb kujunduse ja paigutusega, JavaScript kasutaja tegevustega ning server ostude ja ühiste andmete haldamisega.



