Ostuvormi valideerimine



\# message() kontrollitud juhtumid



tühi kohustuslik väli         -> "See väli on kohustuslik."

vale e-posti kuju             -> "Kontrolli sisestatud andmete kuju."

minlength=2                   -> "Vähemalt 2 tähemärki."

max=6                         -> "Suurim väärtus on 6."

min=1                         -> "Väikseim väärtus on 1."

step=1                        -> "Kasuta sammu 1."

vale telefoninumbri muster    -> "Kontrolli sisestatud andmete kuju."

e-posti aadressid ei ühti     -> "E-posti aadressid ei ühti."

tundmatu põhjus               -> brauseri oma teade

valueMissing + typeMismatch   -> kohustuslikkus võidab



&#x20;ja  võrdlus



| valija         | millal kehtib                           |

|----------------|-----------------------------------------|

| :invalid       | KOHE lehe avanemisel                    |

| :user-invalid  | alles pärast väljaga tegelemist         |



Veateadete kuvamine



Vormil on novalidate atribuut. Veateated kuvatakse JavaScripti abil.



Veateade ilmub väljast lahkumisel (blur) ja kaob pärast väärtuse parandamist (input).



Vigasele väljale lisatakse aria-invalid="true". Kui väli on parandatud, eemaldatakse see atribuut.



Vormi saatmisel kontrollitakse kõiki välju ja fookus liigub esimesele vigasele väljale.

