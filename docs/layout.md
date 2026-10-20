\# Ülesanne 4 — Paigutus, ühikud ja responsiivsus



\## clamp() arvutused



h1 { font-size: clamp(1.75rem, 1rem + 2.5vw, 3rem); }



h2 { font-size: clamp(1.35rem, 1rem + 1vw, 2rem); }



Arvutustes on 1rem = 16px.



| ekraan  | h1                 | h2                 |

|---------|--------------------|--------------------|

| 320 px  | 28,0 px (põhi)     | 21,6 px (põhi)     |

| 375 px  | 28,0 px (põhi)     | 21,6 px (põhi)     |

| 480 px  | 28,0 px (põhi)     | 21,8 px            |

| 768 px  | 35,2 px            | 23,7 px            |

| 1024 px | 41,6 px            | 26,2 px            |

| 1280 px | 48,0 px (lagi)     | 28,8 px            |

| 1440 px | 48,0 px (lagi)     | 30,4 px            |

| 1920 px | 48,0 px (lagi)     | 32,0 px (lagi)     |



h1 kasutab alumist piiri kuni 480 px ekraanilaiuseni ja ülemist piiri alates 1280 px.



h2 kasutab alumist piiri kuni 560 px ekraanilaiuseni ja ülemist piiri alates 1600 px.



\## Paigutus



Kasutasin `box-sizing: border-box`, et elementide suurusi oleks lihtsam arvestada.



Paigutuses kasutasin `rem`-ühikut ja tekstiga seotud vahede jaoks `em`-ühikut. Teksti rea pikkust piirasin `ch`-ühikuga.



Kaardid paiknevad CSS Gridi abil. `auto-fit` ja `minmax()` muudavad veergude arvu automaatselt vastavalt vabale ruumile.



Kasutasin ka `subgrid`-i ja `@container` reeglit, et kaartide paigutust oleks lihtsam kohandada.



Kaardid lähevad kitsal ekraanil üksteise alla ilma `@media` reeglita.

