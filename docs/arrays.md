

\# Ülesanne 2 - massiivid ja objektid deklaratiivselt



\## Tühi valik - MÕÕDETUD oma funktsioonis

&#x20;   allSoldOut(\[])                    -> false

&#x20;   allSoldOut(\[{seats: 2, sold: 2}])  -> true



Ainult every-ga oleks esimene rida true - every(\[]) on tõene.



\## sort - kaks lõksu ühes meetodis

&#x20;   \[10, 9, 1].sort()  -> \[1, 10, 9]     sordib SÕNEDENA

&#x20;   sort MUUDAB algset massiivi         -> tee koopia



\## ?? ei ole || uuem nimi

&#x20;   seatsText({seats: 0})  -> "0 kohta"   s.seats ?? "?" säilitab nulli

&#x20;   s.price || 18         -> tasuta sündmus läheb täishinda



JSON.stringify: null JÄÄB, undefined KAOB täielikult.



