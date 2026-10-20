# Ülesanne 4 - Päringu jälgimine DevToolsiga

Uuritud leht: https://ut.ee/et
Kuupäev: 20.10.2026
Päringuid kokku: 48
Ülekantud maht: 52.3 kB


| Kood | Arv         | Mida tähendab                                      |
|------|-------------|----------------------------------------------------|
| 200  | Vähemalt 2  | Päring õnnestus ja server tagastas vastuse.        |
| 304  | Vähemalt 1  | Ressurss ei muutunud, brauser kasutas vahemälu.    |


| Sisutüüp   | Päringuid | Maht                     |
|------------|-----------|--------------------------|
| HTML       | 2         | 46.9 kB                  |
| CSS        | 3         | 87.9 kB                  |
| JavaScript | 16        | 316 kB                   |
| Pildid     | 22        | 1523 kB                  |
| Fondid     | 3         | 297 kB                   |


Suurim üksikpäring: UndercliffCreative-6943.jpg, jpeg, 212 kB, 200 OK.

curl vs brauser: Valisin Google Chrome'i DevTools Network vahekaardil peamise HTML-päringu https://ut.ee/et ja kasutasin valikut Copy -> Copy as cURL (cmd). Brauseris oli päringu meetod GET ja HTTP staatus 200 OK. cURL-käsk kopeeriti, kuid selle käivitamise tulemust ei ole dokumenteeritud, seega ei saa vastuste kattumist kinnitada.

Kolm järeldust:

1. Veebilehe avamisel laadib brauser lisaks HTML-dokumendile ka CSS-faile, JavaScripti, pilte ja fonte.
2. Brauseri vahemälu vähendab võrguliiklust. Osa ressursse laaditi mälust ning ühe JPEG-pildi puhul oli näha HTTP staatus 304 Not Modified.
3. Kui lülitasin sisse Disable cache ja laadisin lehe uuesti, oli näha 51 päringut ning edastati umbes 2.3 MB andmeid. See näitab, et vahemälu mõjutab edastatavate andmete mahtu.