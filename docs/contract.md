

\# Ülesanne 5 - OpenAPI kui leping



\## Lepingutest vaatab KAHTE suunda



&#x20;   puuduv nõutud väli   -> "puudub nõutud väli: price"

&#x20;   lepingus puuduv väli -> "lepingus puuduv väli: passwordHash"



Teine on tähtsam: just tema kaudu lekib serveri sisemus.



Lepingutest kontrollib, et vastuses oleksid kõik nõutud väljad ja et server ei saadaks välju, mida leping ei luba.



Kui vastusest puudub price, ei vasta see lepingule. Kui vastusesse lisatakse passwordHash, võib kliendile lekkida tundlikku teavet.



checkSchema() kontrollib ka andmetüüpe. Integer sobib number-väljale, kuid number ei sobi alati integer-väljale.



Nõutud väli ei tohi olla null. Valikuline väli võib selle lihtsustatud lepingu järgi olla null.



\## Murdvate muudatuste reegel on ASÜMMEETRILINE



| kus       | tegu                  | liik     |

|-----------|-----------------------|----------|

| vastuses  | välja lisamine        | ohutu    |

| vastuses  | välja eemaldamine     | MURDEV   |

| päringus  | valikulise välja lisamine | ohutu |

| päringus  | NÕUTUD välja lisamine | MURDEV   |

| päringus  | välja eemaldamine     | MURDEV   |

| kus tahes | tüübi muutmine        | MURDEV   |



Vastusesse välja lisamine on üldjuhul ohutu, sest klient saab jätkata tuttavate väljade lugemist.



Vastusest välja eemaldamine on murdev, sest olemasolev klient võib seda välja kasutada.



Päringusse nõutud välja lisamine on murdev, sest vana klient ei saada seda välja.



Päringust välja eemaldamine on samuti murdev, sest range sisendiskeem võib vana kliendi päringu tagasi lükata.



Tüübi muutmine on murdev, sest klient võib oodata näiteks arvu, kuid saada sõne.



\## HTTP-vastus ja nõutud päised



checkResponse() kontrollib päringu teed, meetodit, vastuse staatust, keha ja nõutud päiseid.



POST /orders eduka vastuse staatus on 201.



Kui vastusest puudub Location-päis, ei vasta vastus lepingule isegi siis, kui vastuse keha on õige.



Location näitab loodud ressursi asukohta.



\## Mock luuakse lepingust



createMock() kasutab lepingu kirjeldust ja näidisandmeid.



Mocki vastus peab ise läbima lepingutesti.



See võimaldab kliendil API vastu tööd alustada enne tegeliku serveri valmimist.



\## Kahe lepingu võrdlemine



compareContracts() leiab kahe lepingu skeemide erinevused.



Kontrollitakse väljade lisamist, eemaldamist ja tüübi muutmist.



Näites on neli murdvat muudatust:



\- NewOrder skeemi nõutud välja coupon lisamine.

\- List skeemist välja pages eemaldamine.

\- NewOrder skeemist välja note eemaldamine.

\- Event skeemis välja price tüübi muutmine.



Muudatused tuleb enne avaldamist üle vaadata, sest murdev muudatus võib rikkuda olemasoleva kliendi töö.



\## Proovijooks



Käivitatud käsk:



&#x20;   node materials\\check-contract.js



Tulemus:



&#x20;   32 kontrolli OK



Kõik 32 lepingutesti läbisid edukalt.



\## Kokkuvõte



OpenAPI-laadne leping on masinaga kontrollitav lubadus API käitumise kohta.



Lepingutestid aitavad vältida puuduvate väljade, liigsete andmete, valede tüüpide ja puuduvate HTTP-päistega vastuseid.



Lepingu võrdlemine aitab enne muudatuste avaldamist tuvastada, kas need võivad olemasolevaid kliente rikkuda.



