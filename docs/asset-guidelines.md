# BubblePop2 asset guidelines

## Golden rule
PNG files are visual skins only. Do not put numbers, fractions, text, operators, level titles or language-specific labels inside PNG files.

## Asset IDs
Use `src/data/assets.js` as the only registry for images. Gameplay code should refer to logical asset IDs, not raw file paths.

Examples:

```js
"bubble.blue.idle"
"bubble.operator.idle"
"skill.fractions.bg.game"
"fx.pop.correct"
```

## Recommended folders

```text
assets/
├─ bubbles/
│  ├─ bubble-blue-idle.png
│  ├─ bubble-blue-correct.png
│  ├─ bubble-operator-idle.png
│  └─ bubble-operator-wrong.png
├─ effects/
│  └─ fx-pop-correct.png
└─ skills/
   └─ fractions/
      ├─ bg-fractions-game.png
      └─ icon-fractions.png
```

## Size targets

- Mobile background: ideally under 1 MB.
- Bubble skin: ideally under 150 KB.
- UI icon: ideally under 100 KB.
- Effects/sprites: ideally under 300 KB.

## How themes work
Each content pack can define a `theme` block:

```js
theme: {
  background: "skill.fractions.bg.game",
  bubbleSkin: "bubble.blue.idle",
  operatorBubbleSkin: "bubble.operator.idle",
  popEffect: "fx.pop.correct"
}
```

The game then exposes these through CSS variables:

```css
--bp-bg-image
--bp-bubble-image
--bp-operator-bubble-image
--bp-pop-fx-image
```
