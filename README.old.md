# BubblePop2 MVP v12

Nieuwe stap in Breukenzee:

- Level 9 toegevoegd: **Maak dezelfde stukjes**
- Nieuwe mechanic: `transform-fraction`
- Leerling splitst een bestaande breukbubble fijner zonder de waarde te veranderen
- Voorbeeld: `1/2 → 2/4`
- De opdracht blijft BubblePop-stijl: **Maak 2/4**
- Geen klassieke uitleg als “vermenigvuldig teller en noemer” in de hoofdflow
- Undo blijft beschikbaar
- `fraction-exact` toegevoegd aan de RoundEngine, zodat `2/4` niet zomaar als hetzelfde wordt beoordeeld als `3/6` wanneer de opdracht precies `2/4` vraagt

Huidige Breukenzee-reeks:

1. Zie de breuk
2. Maak de breuk
3. Teller en noemer
4. Zelfde waarde
5. Op de lijn
6. Bubbles op de lijn
7. Maak samen
8. Neem weg
9. Maak dezelfde stukjes

Technische checks:

- JS syntaxcheck uitgevoerd op alle bestanden
- `transform-fraction.js` staat geladen in `index.html`
- Level 9 heeft 8 vragen
- Elke vraag in Level 9 heeft minstens één correcte split-operator
