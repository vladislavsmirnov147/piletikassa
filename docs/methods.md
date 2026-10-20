

\# Ülesanne 2 - meetodid ja olekukoodid



\## Idempotentsus mõõdetuna



&#x20;   POST /api/orders  sama kehaga kaks korda

&#x20;       -> oste kokku: 2



&#x20;   PUT /api/events/4 {"price":9} 2x

&#x20;       -> 200, siis 412



POST lõi KAKS ostu - just seepärast tekib topeltost.



PUT kasutab If-Match päist. Teise päringu ajaks

on märgis aegunud ja server vastab 412.



\## Ohutu ja idempotentne



&#x20;   GET     ohutu: jah   idempotentne: jah

&#x20;   HEAD    ohutu: jah   idempotentne: jah

&#x20;   OPTIONS ohutu: jah   idempotentne: jah

&#x20;   PUT     ohutu: ei    idempotentne: jah

&#x20;   DELETE  ohutu: ei    idempotentne: jah

&#x20;   POST    ohutu: ei    idempotentne: ei

&#x20;   PATCH   ohutu: ei    idempotentne: mitte alati



GET /api/cancellation on ohtlik, sest GET peab

olema ohutu ega tohi serveri olekut muuta.



\## Koodid koos oma päistega - jooksutatud



&#x20;   301 -> Location: /api/events

&#x20;   401 -> WWW-Authenticate: Bearer realm="piletikassa"

&#x20;   405 -> Allow: GET, HEAD, OPTIONS

&#x20;   429 -> Retry-After: 5



\## Vali olukorrale õige kood



&#x20;   aegunud märgis                  -> 412

&#x20;   teine korraldaja muudab sündmust -> 403

&#x20;   nimekirja muutmiskatse          -> 405

&#x20;   ei ole sisse logitud            -> 401

&#x20;   viimane koht müüdi vahepeal ära -> 409

&#x20;   liiga palju päringuid           -> 429

&#x20;   andmebaas ei vasta              -> 503



\## Kas tohib korrata - kood JA meetod



&#x20;   503 + GET   -> jah

&#x20;   503 + POST  -> EI: ost võis tekkida

&#x20;   429 + PUT   -> jah, pärast Retry-After

&#x20;   400 + GET   -> ei aita



\## 301 ja 302



301 tähendab püsivat ümbersuunamist.

302 tähendab ajutist ümbersuunamist.



301 võib olla ohtlikum, sest brauser võib

püsiva ümbersuunamise vahemällu jätta.



