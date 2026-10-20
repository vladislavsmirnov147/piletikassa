\# Ülesanne 4 - sündmused ja delegeerimine



\## Faaside järjekord - oodatav

&#x20;   hõive     #events  (capture: true)

&#x20;   hõive     li

&#x20;   SIHTMÄRK  button

&#x20;   mullitus  li

&#x20;   mullitus  #events  (vaikimisi)



\## Üks kuulaja saja asemel

| viis                 | kuulajaid | uus nupp toimib |

|----------------------|-----------|-----------------|

| igale nupule         | 100       | ei              |

| delegeeritud vanemal | 1         | jah             |



e.target = klõpsatud element. e.currentTarget = kuulaja omanik.





Vormi jaoks kasutasin submit-sündmust, mitte otsingunupu click-sündmust.



Lisasin preventDefault(), et leht ei laadiks vormi saatmisel uuesti.



Vormi andmed loen nii:



Object.fromEntries(new FormData(searchForm))



Samuti kasutasin checkValidity() ja reportValidity(), et kontrollida, kas vormi väljad on õigesti täidetud.



Sain ka teada, et kui märkeruut ei ole valitud, siis selle väärtust FormData sees ei ole.

Otsing 250 ms viivitusega

Otsinguväljale lisasin input-kuulaja.



Kui kasutaja kirjutab, ei käivitu otsing kohe iga tähe järel. Programm ootab 250 ms pärast viimast sisestust.



Kasutasin selleks setTimeout() ja clearTimeout().



Lisasin ka nupu Tühjenda, millega saab otsinguvälja tühjaks teha.





Kokkuvõte

Selles ülesandes sain paremini aru, kuidas sündmused veebilehel töötavad ja miks ei ole vaja igale nupule eraldi kuulajat lisada.



Harjutasin ka vormi andmete lugemist, kontrollimist ja otsingu viivitusega käivitamist.

