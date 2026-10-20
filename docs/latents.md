\# Ülesanne 6 – Latents ja renderdustee



\## Päringute kiiruse mõõtmine



Kasutasin curl-käsku, et vaadata, kui kiiresti erinevad serverid vastavad.



Mõõtsin kolme aadressi:

http://127.0.0.1:3000

https://ut.ee/et

https://www.google.com



| Aadress                 | DNS (s)           | TCP (s)  | TLS (s)  | TTFB (s) |

|-------------------------|-------------------|----------|----------|----------|

| Piletikassa             | 0.000363          | 0.000822 | 0.000000 | 0.002439 |

| Tartu Ülikool           | 0.064225          | 0.081192 | 0.216221 | 0.289026 |

| Google                  | 0.066495          | 0.085011 | 0.315709 | 0.535481 |



Minu mõõtmise järgi vastas kõige kiiremini Piletikassa kohalik server.



See on loogiline, sest server töötab minu enda arvutis. Teiste veebilehtede puhul peab päring liikuma läbi interneti.



Kohaliku serveri TLS-aeg oli 0, sest kasutasin HTTP-d, mitte HTTPS-i.



TTFB näitab, kui kaua läheb aega esimese vastusebaidi saamiseni.





\## Järjestikused ja paralleelsed päringud



Proovisin teha oma kohalikule serverile viis päringut järjest ja siis viis päringut paralleelselt.



| Päring | Järjest (s) | Paralleelselt (s) |

|--------| ------------|-------------------|

| 1      | 0.001709    | 0.002312          |

| 2      | 0.001694    | 0.002663          |

| 3      | 0.001556    | 0.002557          |

| 4      | 0.001440    | 0.002483          |

| 5      | 0.001448    | 0.004197          |



Minu katses olid järjestikused päringud eraldi võttes natuke kiiremad.



Arvan, et põhjus on selles, et kohalik server vastab niigi väga kiiresti. Paralleelsete päringute tegemine ei andnud siin erilist eelist.



Samas tähendab paralleelne päringute tegemine seda, et mitu päringut saavad toimuda samal ajal. Kui server vastab aeglasemalt, võib see aidata aega kokku hoida.







\## Lehe laadimine ja Performance



Avasin oma Piletikassa lehe aadressil

http://127.0.0.1:3000 ja vaatasin Chrome'i

Performance tööriista.



Kasutasin nuppu "Record and reload", et näha,

mis toimub lehe laadimise ajal.



Sain sellised tulemused:



\- LCP: 0.12 s

\- CLS: 0

\- Rendering: 20 ms

\- Painting: 2 ms

\- Scripting: 1 ms

\- Loading: 1 ms



Minu leht laadis kiiresti, sest see on üsna lihtne

ja töötab kohalikus serveris.



LCP näitab, millal lehe suurim nähtav element

on ekraanile ilmunud.



CLS oli 0, mis tähendab, et lehe elemendid

ei liikunud laadimise ajal ootamatult.



Performance'i graafikul oli näha, et brauser

tegeleb lehe laadimise, töötlemise ja kuvamisega.

