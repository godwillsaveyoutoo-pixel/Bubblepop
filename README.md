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


## v35 — geïntegreerde PNG-assets
- echte bubble PNG's gekoppeld aan de thema-laag
- aparte home/startachtergrond
- aparte menu/resultaatachtergrond
- aparte Breukenzee gameplay-achtergrond
- operatorbubbles en quantity pearls gebruiken nu eigen skins


## v36 — PNG fix en finetuning
- fix: CSS variabelen voor theme/assets stonden op .screen-bg en bereikten de bubble-elementen niet
- theme/background vars staan nu op de volledige .screen, zodat bubbles hun PNG-skin echt tonen
- bubble skins visueel versterkt met betere sizing en schaduw
- achtergronden duidelijker zichtbaar gemaakt


## v37 — file:// asset path hotfix
- asset URLs worden nu absoluut gemaakt t.o.v. `index.html` via `document.baseURI`
- dit voorkomt dat CSS custom properties PNG's relatief aan `/styles/game/` proberen te laden
- fullscreen gebruikt op `file://` een veilige CSS-fallback i.p.v. native fullscreen, om Chrome file-origin warnings te vermijden
- alle assets uit `src/data/assets.js` zijn in de ZIP aanwezig


## v38 — local file hotfix
- fixed `toDocumentUrl is not defined` in `asset-manager.js`
- asset URLs are now resolved relative to `index.html` using `document.baseURI`
- CSS URLs are quoted safely
- on `file://`, fullscreen uses only the CSS fallback and never calls native `requestFullscreen`
- added `scripts/check-assets.js` for quick local asset verification


## v40 — nieuwe bubbletypes
- gewone breukbubble = blauw
- plus/operatorbubble = groen
- minbubble = rood/roze
- maalbubble = amber/goud
- deelbubble = paars
- quantity bubble = groenblauw
- value/special bubble = paars-blauw


## v41 — PNG bubbles polish
- zie de breuk: keuze-bubbles krijgen expliciete PNG bubble-skin
- teller/noemer: keuze-bubbles krijgen expliciete PNG bubble-skin
- zelfde waarde: opgavebubble en keuze-bubbles zijn nu echte ronde PNG bubbles
- visualisaties in bubbles kleiner geschaald zodat ze niet horizontaal uitrekken
- op de lijn / bubbles op een lijn: draggable bubbles krijgen expliciete PNG bubble-skin
- lijn-titel "Plaats 1/2" beter uitgelijnd


## v42 — visual polish
- menu-, skill- en levelkaarten visueel meer in één glossy underwater stijl
- levelnummers en taalbadges krijgen bubble-achtige styling
- opgavebreuken krijgen een kleine ronde PNG-bubble look
- breuken in bubbles beter gecentreerd
- zelfde-waarde visualisaties verder verkleind zodat ze beter in ronde bubbles passen
- getallenas-stage en titel subtiel gepolijst


## v43 — cirkelvisualisatie beter passend
- circle fraction visuals hebben nu een inner grid zodat segmenten niet meer tegen de rand van de cirkel worden afgesneden
- werkt zowel in gewone oefening als in bubble/choice-context
- speciaal geschaald voor kleine smartphones


## v44 — PNG cleanup hotfix
- oude generische bubblelaag achter PNG-bubbles verwijderd
- pseudo-highlight (::after) verwijderd voor PNG-bubbles
- oude shine-layer verborgen voor PNG-bubbles
- enkel PNG bubble + inhoud + selectiering blijft zichtbaar


## v45 — opgavevisuals als echte bubbles
- de opgavevisual in level 1/visual prompt oefeningen zit nu ook in een echte PNG bubble
- visual wordt geschaald binnen de bubble
- circle/bar visuals passen beter in de opgavebubble
- dit vervangt de losse platte visual-card bovenaan


## v46 — opgavebubble centrering
- opgavevisual expliciet gecentreerd in het midden van de PNG bubble
- contentwrapper absoluut gecentreerd
- bar-visuals iets smaller gemaakt zodat ze optisch centraler zitten
- circle/bar visuals krijgen auto margins


## v47 — prompt square cleanup
- vierkante semitransparante laag boven de opgavebubble verwijderd
- fraction-visual achtergrond, border en shadow geforceerd uitgezet in prompt bubbles
- visual-piece-wrap in prompt bubbles transparant gemaakt
- alleen de eigenlijke visual blijft zichtbaar in de bubble


## v48 — prompt visual visibility restore
- alleen de grote vierkante wrapper blijft weg
- de eigenlijke bar/circle tray is terug zichtbaar
- opgavevisual opnieuw duidelijk zichtbaar in de bubble
- visuele grootte afgestemd op de opgavebubble


## v49 — fill level prompt bubble fix
- level 2/'maak de breuk' gebruikt nu een echte png-opgavebubble in de titel
- breuk staat opnieuw netjes gecentreerd in de bubble
- breukstreep is weer duidelijk zichtbaar
- de extra zin "Tik precies ... Geen controleknop nodig." is verwijderd


## v50 — equivalent value bubble fit
- in het spel "zelfde waarde" zijn de visuals binnen de oplossingsbubbels kleiner en beter gecentreerd
- de breuklabels/captions onderaan in de bubbles zijn donkerder en veel leesbaarder
- feedbacktekst onder het spel heeft meer contrast
