# BubblePop2 MVP v34 — PNG asset layer v19

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


## v29 code-review cleanup

Deze versie bevat geen nieuwe levels. Focus: stabiliteit en codehygiëne.

- Bug gefixt in `src/screens/game.js`: de Eindbaas-ronde gebruikt nu per vraag de juiste mechanic. In v28 werd in `bindMechanic` nog de level-mechanic gebruikt vóór de vraag was opgehaald.
- Ongebruikte prototype-mechanics uit de actieve package verwijderd: `tap-choice`, `merge-to-target`, `more-than-one`, `transform-fraction`, `value-form-choice`, `number-line-place`.
- Ongebruikte helperfuncties in `fractions.js` opgeschoond.
- Dubbele vraag in `Anders weg` vervangen door een unieke vraag.
- Alle actieve levels en question-level mechanics zijn opnieuw gevalideerd tegen de scripts in `index.html`.


v31 code review cleanup:
- Removed leftover local wrapper helpers after bubble-utils refactor.
- Removed unused qMerge helper from fractions content.
- Re-ran static validation for scripts, references, active mechanics, renders, and level data.


## v32 mobile/fullscreen polish

- Fullscreen-knop toegevoegd in de game-HUD.
- `bubble-utils.js` wordt nu expliciet geladen in `index.html`.
- `game.css` importeert opnieuw alle opgesplitste game-CSS-bestanden plus een nieuwe mobile-polish laag.
- Game screen gebruikt nu class `game-screen`, zodat de spelmodus op kleine schermen bijna edge-to-edge kan werken.
- Vroege breukvisuals, fill-grid en equivalentie-opties krijgen striktere max-width/overflow regels.
- Level 1 antwoordbubbles en getallenas-bubbles zijn rond gemaakt.
- Nummerkeuzes in teller/noemer krijgen op mobiel 2 kolommen i.p.v. een krappe rij.
- Getallenas krijgt meer horizontale ruimte binnen het spelvenster.


## v32.1 visible fullscreen

De fullscreenknop staat nu ook zichtbaar in de onderbalk als `⛶ Volledig scherm`. Op kleine smartphones wordt de kleine HUD-knop bovenaan verborgen, zodat de knop onderaan duidelijker is.


## v32.2 double-tap fullscreen

- De zichtbare fullscreenknoppen zijn verwijderd.
- Fullscreen werkt nu via dubbel tikken/dubbel klikken op menu-schermen: Home, Skills, Levels en Resultaat.
- Dubbel tikken op gewone knoppen wordt genegeerd, zodat navigatie niet per ongeluk fullscreen activeert.
- In het spel zelf staat geen extra fullscreenknop meer.


## v33 progress locking

Levels are now dynamically locked: level 1 is open, and each next level unlocks only after the previous level has been completed. The level screen, direct game routing, result screen next-level button, and home continue button all use the same central Progress rules.

## v34 — PNG asset integration layer

Deze versie voegt een visuele asset-laag toe zonder de spelinhoud te wijzigen:

- `src/core/theme.js` beheert achtergrond, bubble-skin, operatorbubble-skin en pop-effect per wereld/contentpack.
- `src/core/asset-manager.js` heeft nu `cssUrl(...)` zodat CSS-variabelen veilig uit het asset-manifest komen.
- `src/core/bubble-utils.js` heeft `skinImage(...)`, zodat fusion-mechanics niet langer rechtstreeks naar één vaste bubble-PNG verwijzen.
- `styles/game/09-asset-skins.css` laat HTML/CSS-bubbles een PNG-huid gebruiken, terwijl breuken/tekst HTML blijven.
- `fractions.js` bevat nu een `theme`-blok voor toekomstige wereldskins.

Belangrijke regel: PNG’s mogen geen breuken, tekst of getallen bevatten. De PNG is alleen de visuele huid; labels blijven dynamisch in HTML/CSS.
