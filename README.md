# BubblePop2 MVP v19

Nieuw in deze versie:

- Level 13 toegevoegd: **Keer nemen**.
- Nieuwe mechanic: `multiply-bubble`.
- Geen aparte plop- of controleerknop.
- De speler sleept een maalbubble, zoals `×3`, op een breukbubble.
- De actie zelf controleert meteen of de doelbreuk gemaakt is.
- Stabiele slots: andere bubbles springen niet weg.
- Undo blijft beschikbaar.

Voorbeeld:

```text
Maak 3/4

[ 1/4 ] [ ×2 ] [ ×3 ] [ ×4 ]

Sleep ×3 op 1/4 → 3/4 → Plop!
```


## v20

Nieuw: Level 14 — Breuk keer. Dit gebruikt dezelfde multiply-bubble mechanic, maar nu met breuk-maalbubbles zoals ×1/2, ×1/3 en ×2/3. Er is geen Plop-knop of controleerknop: je sleept de breuk-maalbubble rechtstreeks op de gewone breukbubble.


## v21

- Level 15 toegevoegd: **Deel eerlijk**.
- Nieuwe mechanic: `divide-bubble`.
- Directe BubblePop-flow: sleep `÷2`, `÷3` of `÷4` op een breukbubble; geen controleerknop.
- Resultaat wordt vereenvoudigd weergegeven wanneer nodig, bijvoorbeeld `2/3 ÷2 → 1/3`.


## v21.1
- Levelscherm is nu scrollbaar, zodat lange leerlijnen onderaan bereikbaar blijven op kleine schermen.
- De header blijft staan; alleen de levellijst scrollt.


## v22

Toegevoegd: Level 16 — Deel door stukjes. Breuk-deelbubbles zoals ÷1/2, ÷1/3 en ÷1/4 werken in dezelfde directe sleepstijl als de gewone deelbubbles.


## v22.1

Operatorbubbles zijn visueel opgeschoond: min-, maal- en deeltekens staan nu compact vóór de breuk in dezelfde bubble, niet als badge erboven. De deeloperator wordt in schoolstijl als `:` weergegeven.


## v23

Toegevoegd: Level 17 — Kies slim. Dit is een mix-/baaslevel met gewone breukbubbles, minbubbles, maalbubbles en deelbubbles in één herbruikbare `operator-mix` mechanic.


## v24

- Level 18 toegevoegd: **Andere vormen**.
- Opdrachtvorm: **Maak 50%** of **Maak 0,5**.
- Speler kiest/popt de breukbubble met dezelfde waarde.
- Nieuwe mechanic: `value-form-choice`.
- Geen controleerknop of extra plopknop.


## v25

Level 18 “Andere vormen” is herwerkt van aanklikken naar echte bubble-fusion: sleep de breukbubble in de procent/komma-doelbubble. Geen controleerknop of losse plopknop.


## v27

Level 18 is herwerkt naar een echte fusion-level: bovenaan staat bijvoorbeeld “Maak 0,75” of “Maak 50%”, maar er is geen doelbubble/dropzone meer. De leerling sleept breukbubbles onderling in elkaar tot de gevormde breuk dezelfde waarde heeft als het procent of kommagetal.


## v28

Toegevoegd:
- Level 19 — Procent van hoeveelheid: losse bubbles kiezen voor bv. 50% van 12.
- Level 20 — Eindbaas: dynamische mix van fusion, min, maal, deel, procent/komma en hoeveelheid.
- Game screen ondersteunt nu per-vraag mechanics binnen één level.
