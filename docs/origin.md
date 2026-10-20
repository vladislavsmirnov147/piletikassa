\# Ülesanne 4 - küpsised, päritolu ja CORS



\## HttpOnly - mõõdetud



&#x20;   document.cookie -> simple=1; same\_site=4; short=3; cross\_site=5

&#x20;   server näeb    -> simple=1; httponly=2; same\_site=4; ...



httponly=2 on serveri nimekirjas ja PUUDUB document.cookie-st.



\## Päring pordile 3005 (sama sait, teine päritolu)



| päring                  | tulemus                        |

|-------------------------|--------------------------------|

| tavaline fetch          | CORS BLOKEERIS                 |

| fetch ilma credentials | server ei saanud ühtki küpsist |

| fetch credentials-iga  | KÕIK viis, sh SameSite=Strict  |



CORS blokeeris selle, mille SameSite läbi lasi.



\## Päritolu ja port



&#x20;   http://localhost:3004 -> leht

&#x20;   http://localhost:3005 -> sama server, teine port



Päritolu = skeem + host + PORT.



3004 ja 3005 on ERI PÄRITOLU, sest port on erinev.



\## Küpsiste omadused



&#x20;   simple     -> tavaline küpsis

&#x20;   httponly   -> HttpOnly

&#x20;   short      -> Max-Age=10

&#x20;   same\_site  -> SameSite=Strict

&#x20;   cross\_site -> SameSite=None; Secure



HttpOnly peidab küpsise JavaScripti document.cookie eest,

kuid server näeb seda päringus.



Max-Age=10 tähendab, et küpsis aegub kümne sekundi pärast.

Lehe uuesti laadimine ei pikenda selle eluiga automaatselt.



\## CORS ja credentials



CORS määrab, kas brauser lubab JavaScriptil

teisest päritolust saadud vastust lugeda.



Server võib päringule vastata, kuigi brauser

blokeerib vastuse JavaScripti eest.



credentials: 'include' lubab fetch-päringul küpsiseid saata,

kui serveri CORS-seadistus ja küpsiste reeglid seda lubavad.



PUT-päring võib põhjustada OPTIONS preflight-päringu.

Network-paneelilt tuleb mõõta, mitu päringut brauser tegi.



\## SameSite=Strict



SameSite=Strict piirab küpsise saatmist

teise saidi kontekstis.



Teine port tähendab teist päritolu,

kuid mitte automaatselt teist saiti.



\## HTTPS



HTTPS-i sertifikaat aitab tõendada serveri identiteeti

ja kaitseb ühendust pealtkuulamise ning muutmise eest.



Sertifikaat ei tõenda, et veebileht ise on usaldusväärne.



HTTPS-ita on eriti riskantsed:

&#x20;   sisselogimine ja paroolide saatmine

&#x20;   maksete tegemine

&#x20;   isikuandmete edastamine



\## Kokkuvõte



HttpOnly peidab küpsise JavaScripti eest,

mitte serveri eest.



CORS ja SameSite on ERI mehhanismid.

CORS kontrollib vastuse lugemist brauseris.

SameSite mõjutab küpsise saatmist.



Sama sait ei tähenda sama päritolu.

