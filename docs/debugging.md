

\# Ülesanne 1 - keel, ulatus ja silumine



\## 1. Ulatus: var ja let sulundis



scopeDemo(3)



var\_: \[3, 3, 3]

let\_: \[0, 1, 2]



var puhul näevad kõik kolm funktsiooni ühte muutujat.

let puhul on igal tsükli kordusel oma muutuja.



hoisting()



var\_before: "undefined"

var\_after: 18

let\_before: ReferenceError

let\_after: 120



var on enne väärtuse määramist undefined.

let on enne deklaratsiooni ajalises surnud tsoonis.



\## 2. Võrdlemine



| avaldis            | tulemus |

|--------------------|---------|

| 0 == ""            | true    |

| 0 === ""           | false   |

| "6" == 6           | true    |

| null == undefined  | true    |

| null === undefined | false   |

| NaN === NaN        | false   |



== teisendab vajadusel andmetüüpe.

=== võrdleb väärtust ja tüüpi ilma teisendamiseta.



NaN ei võrdu iseendaga. Selle kontrollimiseks kasutatakse Number.isNaN().



Kaheksa väära väärtust: false, 0, -0, 0n, "", null, undefined, NaN.



\## 3. Sulund



createCart() kasutab sulundit, et hoida massiivi rows väljast peidetuna.



Kontrollitud tulemused:



cart.add("VIP")

cart.list() -> \["VIP"]

cart.rows -> undefined



Sulund võimaldab funktsioonil mäletada oma loomise ajal olemas olnud muutujaid.



\## 4. Prototüübiahel



prototypeChain()



| omadus           | tulemus   |

|------------------|-----------|

| chain            | true      |

| class\_type       | function  |

| this\_with\_object | VIP       |

| this\_detached    | TypeError |



chain: true näitab, et Child.prototype pärib Base.prototype objektilt.



class\_type: function näitab, et JavaScripti klass on tehniliselt funktsioon.



this\_with\_object: VIP näitab, et objekti kaudu kutsutud meetodis viitab this objektile card.



this\_detached: TypeError näitab, et objektist eraldatud meetod kaotab oma this-seose.



\## 5. Vormindusfunktsioonide kontroll



freeText(0) -> "välja müüdud"

freeText(5) -> "5 vaba"

seatLabel("A", 12) -> "A-12"

price("vip", 2) -> 70

price("unknown") -> RangeError



createCart() sisemine massiiv rows ei ole väljast otse nähtav.



\## 6. Silumine



Tingimuslik katkestuspunkt võimaldab peatada programmi ainult kindla tingimuse korral.



Funktsiooni price juures kasutatav tingimus:



tier === "vip"



See tingimus on tõene ainult siis, kui hinnaklass on vip.



