# BubblePop 2.0 — Design Contract

## Productregel

De leerling moet binnen één tik kunnen verder spelen.

## Flow

Home → Speel verder → Ronde → Resultaat → Nog een ronde

De keuze-route mag bestaan, maar is secundair:

Home → Skills → Level → Ronde

## Architectuurregels

1. Geen grote wereldmap als hoofdmenu.
2. Eén centrale RoundEngine.
3. Mechanics regelen alleen interactie, niet score/progressie.
4. Content zit in data, niet in schermcode.
5. Assets worden via asset-ID's geladen.
6. Geen tekst in PNG's.
7. Geen losse override-scripts.
8. Geen permanente override-CSS als structurele oplossing.
9. Eerst één wereld goed, daarna uitbreiden.
10. MVP moet lokaal speelbaar blijven zonder server.

## Spelregels

- Geen gewone skip-knop in de standaardronde.
- Fout antwoord betekent: opnieuw proberen, niet automatisch naar de volgende vraag.
- Geen slot-vakjes als hoofdgevoel: Breukenzee bouwt rond een centrale groeibubble.
- Undo is toegestaan en wenselijk; skip niet.
- De kern van Breukenzee is combineren/bouwen, niet alleen quizzen.
- Tap-choice mag bestaan als intro, warm-up of debugmechaniek, maar niet als hoofdmechaniek.

## Mechanics-interface

Een mechanic heeft minimaal:

```js
render(question, roundState)
mount(container, onAnswer, question, roundState, context)
```

Later kan dat uitbreiden naar:

```js
init(config)
render(state)
handleInput(input)
validate()
cleanup()
```

## Assetstrategie

- UI via CSS/componenten.
- Spelobjecten via PNG of later WebP.
- Achtergronden via PNG/WebP.
- Tekst en breuken via HTML/CSS.
- Geen cijfers/woorden ingebakken in afbeeldingen.
