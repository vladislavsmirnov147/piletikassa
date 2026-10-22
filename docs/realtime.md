

\# Ülesanne 1 - polling, SSE ja WebSocket kõrvuti



\## MÕÕDETUD: 3 s aken, 6 muutust, küsitlus iga 250 ms



| viis         | päringuid | baite | teateid | latents |

|--------------|-----------|-------|---------|---------|

| polling      | 14        | 5236  | 6       | 182 ms  |

| long polling | 7         | 2413  | 6       | 1 ms    |

| SSE          | 1         | 623   | 6       | 0 ms    |

| WebSocket    | 1         | 558   | 6       | 0 ms    |



Polling: 8,4 korda rohkem baite ja 182 korda suurem latents (võrreldes 1 ms võrdlusväärtusega).



WebSocket saatis VÄHEM baite kui SSE (558 vs 623) — raami päis on lühem kui SSE „data:“-rida.



\## Node ei saada päiseid enne esimest KIRJUTUST



&#x20;   ainult writeHead() -> fetch ei lahenda kunagi

&#x20;   retry: 3000        -> fetch lahendab



SSE server kutsub välja res.write('retry: 3000\\n\\n').



See saadab esimesed andmed kohe ja võimaldab kliendil vastust lugema hakata.



retry: 3000 ütleb EventSource kliendile, et ühenduse katkemisel tuleb enne uut ühendamiskatset oodata 3000 millisekundit.



SSE automaatne taasühendus on oluline eelis, sest ajutise võrgukatkestuse korral ei pea klient kogu taasühendamise loogikat ise kirjutama.



\## Polling ja SSE võrdlus



Polling teeb iga 250 ms järel uue HTTP-päringu, isegi kui vabade kohtade arv ei ole muutunud.



Selles katses tehti 14 päringut ja edastati 5236 baiti.



SSE puhul piisab ühest pikaajalisest HTTP-ühendusest. Server saadab teate kohe, kui vabade kohtade arv muutub.



SSE kasutas ainult 623 baiti ja ühte päringut.



Pollingu latents oli 182 ms, SSE latents ümardus 0 ms-ni.



See ei tähenda, et SSE oleks täiesti viivituseta, vaid mõõdetud keskmine jäi alla ühe millisekundi ümardamispiiri.



\## SSE ja WebSocketi baitide võrdlus



SSE edastas 623 baiti ja WebSocket 558 baiti.



WebSocket kasutas 65 baiti vähem.



WebSocketi sõnumiraam on kompaktne, kuid SSE kasutab tekstilist vormingut, näiteks data: ning sõnumi lõpus tühja rida.



SSE eelis ei ole tingimata väiksem baitide arv, vaid lihtne ühepoolne andmevoog ja automaatne taasühendus.



\## Nelja mudeli omadused



| viis         | suund                 | ühenduste arv | taasühendus             | puhverserver             | vahemälu                 |

|--------------|-----------------------|---------------|-------------------------|--------------------------|--------------------------|

| polling      | klient -> server      | korduvad HTTP-päringud | järgmine päring toimub taimeriga | tavaline HTTP | GET võib kasutada vahemälu, kuid värskus tuleb tagada |

| long polling | klient -> server, vastus hiljem | järjestikused pikad HTTP-päringud | klient teeb uue päringu | pikk päring võib aeguda | vastust ei tohiks aegunud kujul kasutada |

| SSE          | server -> klient      | üks pikaajaline HTTP-ühendus | EventSource ühendub automaatselt uuesti | puhverdus võib teateid viivitada | no-cache |

| WebSocket    | mõlemas suunas        | üks püsiühendus | klient peab ise rakendama | vajab Upgrade-toetust | tavaline HTTP-vahemälu ei sobi sõnumitele |



\## Piletikassa olukorrad



\### Sündmuste nimekiri



Valin tavalise pollingu või vajaduse korral ühe GET-päringu.



Sündmuste nimekiri ei muutu tavaliselt iga sekund ning lihtne HTTP-päring on piisav.



\### Vabade kohtade arvu muutumine



Valin SSE.



Server peab teavitama klienti kohe, kui vabade kohtade arv muutub. Klient ei pea selleks pidevalt uusi päringuid saatma.



\### Interaktiivne saaliplaan



Kui klient peab saatma serverile sageli istekohtade valikuid ja server peab samal ajal saatma muudatusi, valin WebSocketi.



WebSocket võimaldab kahesuunalist suhtlust ühe püsiühenduse kaudu.



\### Pileti ostmine



Valin tavalise HTTP POST-päringu.



Ostmine on üks konkreetne tegevus, mille puhul on oluline saada selge vastus tellimuse õnnestumise või vea kohta.



\## Kokkuvõte



Mõõtmine näitas, et polling tekitas rohkem HTTP-päringuid, kasutas rohkem baite ja oli aeglasem kui SSE või WebSocket.



Long polling vähendas viivitust, kuid vajas iga muudatuse järel uut päringut.



SSE sobib hästi Piletikassa vabade kohtade arvu uuendamiseks, sest server saadab teateid ühes suunas ja brauser oskab ühenduse automaatselt taastada.



WebSocket sobib olukordadesse, kus nii klient kui ka server peavad sageli sõnumeid saatma.



Kõige keerulisemat tehnoloogiat ei ole alati vaja kasutada. Valida tuleb kõige lihtsam lahendus, mis täidab rakenduse nõuded.



