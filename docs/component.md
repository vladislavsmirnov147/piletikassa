

\# Ülesanne 6 – veebikomponent, moodulid ja prototüübid



\## Veebikomponent



Lõin faili public/ticket-card.js ja klassi TicketCard, mis pärib HTMLElement klassist.



Komponent kasutab varjus-DOM-i ja õpetaja antud card-template.js malli.



connectedCallback() – lisab sündmusekuulaja.

disconnectedCallback() – eemaldab sündmusekuulaja.

attributeChangedCallback() – uuendab kaardi sisu.

observedAttributes – määrab jälgitavad atribuudid.



Kasutasin privaatseid välju märgiga #.



\## Varjus-DOM isoleerib



Lehele lisasin reegli h3 { color: red; }.



| Kus | Arvutatud värv |

|---|---|

| Lehel | Mõõtmata |

| Varjus-DOM-is | Mõõtmata |



getComputedStyle() kontroll jäi tegemata.



\## Kolm auku, mis on meelega jäetud



:host – element ise.

Pärimine – color, font ja var(--line) võivad tulla hostilt.

::part() – leht saab kujundada part="button" elementi.



Ilma nendeta oleks komponenti raske kujundada.



\## defer, async ja module



Lõin kolm faili:



defer-test.js

async-test.js

module-test.js



defer – käivitub pärast HTML-i parsimist ja säilitab järjekorra.

async – käivitub pärast laadimist, järjekord ei ole garanteeritud.

module – käitub vaikimisi nagu defer.



Tegelikku käivitamise järjekorda brauseris ei mõõtnud.



\## Import map



Lisasin import map'i, kus nimi piletikaart viitab failile ticket-card.js.



Moodulis on muutuja moduleMessage.



Tavaline skript proovib seda kasutada. Oodatav tulemus on ReferenceError, sest mooduli muutujad ei ole globaalsed.



Tulemust brauseris ei kontrollinud.



\## CustomEvent



Komponent saadab nupuvajutusel sündmuse ticket-select.



Kasutasin bubbles: true ja composed: true.



Leht kuulab sündmust ja kuvab valitud ürituse nime.



\## Dünaamiline import



Fail seatmap.js laaditakse käsuga await import('./seatmap.js') alles pärast nupuvajutust.



Funktsioon drawSeatmap() loob 12 rida ja igasse ritta 18 kohta.



Network-paneelis laadimist ei kontrollinud.



\## Kokkuvõte



Lõin veebikomponendi ja kasutasin varjus-DOM-i, privaatseid välju, import map'i, CustomEvent-i ja dünaamilist importi.



Brauseri mõõtmised ja kontrollid jäid tegemata.



