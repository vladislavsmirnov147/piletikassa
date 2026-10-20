\# Ülesanne 3 (CSS-i spetsiifilisus)



| 0-1-0          | .field                           | raamistikuvormi väli           |

| 0-1-0          | .field                           | meie vormiväli - SAMA          |

| 0-2-0          | .page .field                     | vana võte: lisa esivanem       |

| 0-0-0          | :where(h1, h2, h3)               | lähtestus                      |

| 0-0-1          | :is(h2, h3)                      | rühm                           |

| 0-1-2          | .cards > li :is(h2, h3)          | klass + :is()                  |

| 0-2-1          | .cards > li:not(...)             | :not() argument loeb           |

| 0-2-0          | .error:not(:empty)               | pseudoklass argumendina        |

| 0-2-0          | :root:not(\[data-theme="light"])  | atribuut argumendina           |

| 1-1-0          | #purchase .field                 | id võidab kõik klassid         |





Kiht ours võidab kihti framework 0-1-0 vastu 0-1-0 STRUKTUURSELT, mitte spetsiifilisusega.





\## Miks kiht asendab !important-i?



CSS-i kihtidega saab määrata, millised stiilid on tähtsamad.



Näiteks meil on .field nii framework kui ka ours kihis. Mõlemal on sama spetsiifilisus 0-1-0, aga ours võidab, sest see kiht on järjekorras hiljem.



Nii saame oma stiile muuta ilma !important kasutamata. Minu arvates on see lihtsam, sest CSS jääb selgemaks ja seda on hiljem kergem muuta.

