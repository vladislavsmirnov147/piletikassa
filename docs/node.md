

\# Ülesanne 1 - Node ja brauser kõrvuti



| Omadus | brauseris | Node-is |

|---|---|---|

| `document`, `window` | on | ei ole |

| `localStorage` | on | ei ole |

| `process`, `Buffer` | ei ole | on |

| `fetch`, `URL`, `JSON` | on | on |



\## \_\_dirname asendus



`path.dirname(fileURLToPath(import.meta.url))`



`new URL(...).pathname` EI OLE failitee: ta jätab tühikud `%20` kujule.



\## Semver



\- `^5.1.0` lubab `5.2.0` ja `5.1.9`, EI luba `6.0.0` ega `5.0.9`.

\- `\~5.1.0` lubab `5.1.9`, EI luba `5.2.0`.

\- `5.1.0` lubab ainult täpset versiooni `5.1.0`.

\- `^0.3.1` ei luba `0.4.0`.

\- `^0.0.4` ei luba `0.0.5`.



\## npm ci ja lukufail



`npm ci` paigaldab sõltuvused `package-lock.json` faili järgi. Ilma lukufaili arvestamata võivad eri masinad paigaldada erinevad sõltuvuste versioonid ja ehitus ei ole enam korratav.



\## Failide lugemine ja kirjutamine



`readEvents(file)` loeb sündmused `node:fs/promises` abil ja tagastab JSON-ist parsitud andmed.



`writeReport(target, rows)` kirjutab CSV-aruande ajutisse faili ja nimetab selle seejärel `rename()` abil lõplikuks failiks. Nii ei jää lugejale pooleli kirjutatud lõppfaili.



\## Protsess



`processInfo()` tagastab Node.js versiooni, protsessori tuumade arvu ja protsessi RSS-mälu kasutuse megabaitides.



\## Kontrollimine



Käsk:



&#x20;   node materials\\check-env.js



Tulemus:



&#x20;   29 kontrolli OK



