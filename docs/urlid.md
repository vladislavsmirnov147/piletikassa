

# Ülesanne 3 – URL lahti võetud



## URL 1



`https://piletikassa.example.ee:8443/events/12?sort=date\&available=2#seats`



| Osa                 | Väärtus                  | Selgitus                                               |
|---------------------|--------------------------|--------------------------------------------------------|
| Skeem               | `https`                  | Kasutatakse turvalist HTTPS-ühendust.                  |
| Host                | `piletikassa.example.ee` | Serveri domeeninimi, mille poole pöördutakse.          |
| Port                | `8443`                   | Serveri pordinumber.                                   |
| Tee                 | `/events/12`             | Viitab sündmusele numbriga 12.                         |
| Päringuparameeter 1 | `sort=date`              | Tulemusi soovitakse sortida kuupäeva järgi.            |
| Päringuparameeter 2 | `available=2`            | Päringus antakse kaasa väärtus 2 vabade kohtade kohta. |
| Fragment            | `seats`                  | Viitab lehe osale, mille identifikaator on `seats`.    |



## URL 2



`http://localhost:3000/api/buyers`



| Osa                | Väärtus      | Selgitus                                                |
|--------------------|--------------|---------------------------------------------------------|
| Skeem              | `http`       | Kasutatakse HTTP-protokolli, mis ei krüpteeri ühendust. |
| Host               | `localhost`  | Viitab samale arvutile, kus rakendus töötab.            |
| Port               | `3000`       | Server kuulab pordil 3000.                              |
| Tee                | `/api/buyers`| Viitab ostjate API-aadressile.                          |
| Päringuparameetrid | Puuduvad     | URL-is ei ole küsimärgi järel päringuparameetreid.      |
| Fragment           | Puudub       | URL-is ei ole `#`-märgiga fragmenti.                    |




## URL 3



`https://www.ut.ee/et/oppimine?utm\_source=uudiskiri`



| Osa               | Väärtus                 | Selgitus                                     |
|-------------------|-------------------------|----------------------------------------------|
| Skeem             | `https`                 | Kasutatakse turvalist HTTPS-ühendust.        |
| Host              | `www.ut.ee`             | Tartu Ülikooli veebilehe domeeninimi.        |
| Port              | Pole eraldi määratud    | HTTPS-i vaikeport on 443.                    |
| Tee               | `/et/oppimine`          | Viitab eestikeelsele õppimise lehele.        |
| Päringuparameeter | `utm\_source=uudiskiri` | Näitab, et külastuse allikaks on uudiskiri.  |
| Fragment          | Puudub                  | URL-is ei ole `#`-märgiga fragmenti.         |





\## Fragmendi #test kontroll



Avasin Google Chrome'is lehe `https://ut.ee/et` ja seejärel lisasin aadressi lõppu fragmendi `#test`.



Uus aadress oli `https://ut.ee/et#test`.



Lehe nähtav sisu ei muutunud. DevTools oli avatud ja aadressiribal oli näha fragment `#test`.



Fragmenti kasutatakse veebilehe kindlale osale viitamiseks. Fragmenti ei saadeta HTTP-päringus serverile.

&#x20; 

