(function () {
  window.BP = window.BP || {};
  BP.CONTENT = BP.CONTENT || {};

  BP.CONTENT.fractions = {
    id: "fractions",
    title: "Breukenzee",
    backgroundAsset: "skill.fractions.bg.game",
    theme: {
      background: "skill.fractions.bg.game",
      bubbleSkin: "bubble.blue.idle",
      operatorBubbleSkin: "bubble.operator.idle",
      popEffect: "fx.pop.correct"
    },
    levels: [
      {
        id: "fractions.visual.01",
        title: "Zie de breuk",
        description: "Kijk naar de bubble en kies de breuk.",
        mechanic: "choose-representation",
        roundSize: 8,
        unlocksAfter: null,
        questions: [
          qVisual("Welke breuk zie je?", "bar", [1,2], [[1,2,true], [1,3,false], [2,2,false], [1,4,false]]),
          qVisual("Welke breuk zie je?", "bar", [1,4], [[1,4,true], [3,4,false], [1,2,false], [2,4,false]]),
          qVisual("Welke breuk zie je?", "bar", [3,4], [[3,4,true], [1,4,false], [2,4,false], [3,8,false]]),
          qVisual("Welke breuk zie je?", "circle", [2,3], [[2,3,true], [1,3,false], [3,2,false], [2,4,false]]),
          qVisual("Welke breuk zie je?", "circle", [3,5], [[3,5,true], [2,5,false], [3,4,false], [1,5,false]]),
          qVisual("Welke breuk zie je?", "bar", [5,8], [[5,8,true], [3,8,false], [5,6,false], [1,8,false]]),
          qVisual("Welke breuk zie je?", "circle", [2,5], [[2,5,true], [1,5,false], [3,5,false], [2,3,false]]),
          qVisual("Welke breuk zie je?", "bar", [7,10], [[7,10,true], [3,10,false], [7,8,false], [1,10,false]])
        ]
      },
      {
        id: "fractions.fill.01",
        title: "Maak de breuk",
        description: "Kleur de juiste delen in de bubble.",
        mechanic: "fill-fraction",
        roundSize: 8,
        unlocksAfter: null,
        questions: [
          qFill("Maak", [1,2], "bar"),
          qFill("Maak", [3,4], "bar"),
          qFill("Maak", [2,3], "circle"),
          qFill("Maak", [2,5], "bar"),
          qFill("Maak", [3,5], "circle"),
          qFill("Maak", [5,8], "bar"),
          qFill("Maak", [4,6], "bar"),
          qFill("Maak", [7,10], "bar")
        ]
      },
      {
        id: "fractions.parts.01",
        title: "Teller en noemer",
        description: "Ontdek totaal aantal delen en gekleurde delen.",
        mechanic: "parts-count",
        roundSize: 8,
        unlocksAfter: null,
        questions: [
          qParts("Wat is de noemer?", "bar", [1,2], 2, [2,1,3,4]),
          qParts("Wat is de teller?", "bar", [3,4], 3, [3,4,1,2]),
          qParts("Wat is de noemer?", "circle", [2,3], 3, [3,2,4,5]),
          qParts("Wat is de teller?", "circle", [3,5], 3, [3,5,2,4]),
          qParts("Wat is de noemer?", "bar", [5,8], 8, [8,5,6,10]),
          qParts("Wat is de teller?", "bar", [7,10], 7, [7,10,3,8]),
          qParts("Wat is de noemer?", "circle", [4,6], 6, [6,4,3,8]),
          qParts("Wat is de teller?", "bar", [2,5], 2, [2,5,3,1])
        ]
      },
      {
        id: "fractions.equivalent.01",
        title: "Zelfde waarde",
        description: "Kies de bubble die evenveel toont.",
        mechanic: "equivalent-choice",
        roundSize: 8,
        unlocksAfter: null,
        questions: [
          qEquivalent("Welke bubble toont evenveel?", "bar", [1,2], [[2,4,true], [1,3,false], [3,4,false], [1,4,false]]),
          qEquivalent("Welke bubble toont evenveel?", "circle", [2,3], [[4,6,true], [2,4,false], [3,6,false], [1,3,false]]),
          qEquivalent("Welke bubble toont evenveel?", "bar", [3,4], [[6,8,true], [2,4,false], [3,8,false], [1,4,false]]),
          qEquivalent("Welke bubble toont evenveel?", "bar", [1,3], [[2,6,true], [3,6,false], [1,2,false], [2,9,false]]),
          qEquivalent("Welke bubble toont evenveel?", "circle", [2,5], [[4,10,true], [5,10,false], [2,10,false], [3,5,false]]),
          qEquivalent("Welke bubble toont evenveel?", "bar", [3,5], [[6,10,true], [5,10,false], [3,10,false], [4,5,false]]),
          qEquivalent("Welke bubble toont evenveel?", "circle", [4,6], [[2,3,true], [1,3,false], [3,6,false], [4,8,false]]),
          qEquivalent("Welke bubble toont evenveel?", "bar", [5,10], [[1,2,true], [5,8,false], [2,5,false], [3,10,false]])
        ]
      },
      {
        id: "fractions.line.01",
        title: "Op de lijn",
        description: "Sleep één breukbubble letterlijk op de getallenas.",
        mechanic: "number-line-drag",
        roundSize: 8,
        unlocksAfter: null,
        questions: [
          qLine("Plaats", [1,2], 2),
          qLine("Plaats", [1,4], 4),
          qLine("Plaats", [3,4], 4),
          qLine("Plaats", [1,3], 3),
          qLine("Plaats", [2,3], 3),
          qLine("Plaats", [2,5], 5),
          qLine("Plaats", [3,5], 5),
          qLine("Plaats", [5,8], 8)
        ]
      },
      {
        id: "fractions.line.multi.01",
        title: "Bubbles op de lijn",
        description: "Sleep meerdere breukbubbles naar hun plaats.",
        mechanic: "number-line-drag",
        roundSize: 6,
        unlocksAfter: null,
        questions: [
          qLineMulti("Plaats de bubbles", [[1,4], [1,2], [3,4]], 4),
          qLineMulti("Plaats de bubbles", [[1,3], [2,3], [1,2]], 6),
          qLineMulti("Plaats de bubbles", [[1,5], [2,5], [4,5]], 5),
          qLineMulti("Plaats de bubbles", [[1,8], [3,8], [5,8]], 8),
          qLineMulti("Plaats de bubbles", [[2,6], [3,6], [5,6]], 6),
          qLineMulti("Plaats de bubbles", [[2,10], [5,10], [7,10]], 10)
        ]
      },
      {
        id: "fractions.add.like.01",
        title: "Maak samen",
        description: "Maak de doelbreuk door gelijknamige breukbubbles te versmelten.",
        mechanic: "bubble-fusion",
        roundSize: 8,
        unlocksAfter: null,
        questions: [
          qAddLike("Maak", [[1,4], [2,4]], [3,4], [[1,4], [2,4], [1,4], [4,4]]),
          qAddLike("Maak", [[1,5], [2,5]], [3,5], [[1,5], [2,5], [1,5], [4,5]]),
          qAddLike("Maak", [[2,6], [3,6]], [5,6], [[2,6], [3,6], [1,6], [4,6]]),
          qAddLike("Maak", [[1,8], [3,8]], [4,8], [[1,8], [3,8], [2,8], [5,8]]),
          qAddLike("Maak", [[2,10], [5,10]], [7,10], [[2,10], [5,10], [1,10], [3,10]]),
          qAddLike("Maak", [[3,7], [2,7]], [5,7], [[3,7], [2,7], [1,7], [4,7]]),
          qAddLike("Maak", [[1,6], [4,6]], [5,6], [[1,6], [4,6], [2,6], [3,6]]),
          qAddLike("Maak", [[2,9], [3,9]], [5,9], [[2,9], [3,9], [1,9], [4,9]])
        ]
      },
      {
        id: "fractions.subtract.like.01",
        title: "Neem weg",
        description: "Maak de doelbreuk door een wegneembubble op een gewone bubble te slepen.",
        mechanic: "subtract-bubble",
        roundSize: 8,
        unlocksAfter: null,
        questions: [
          qSubtractLike("Maak", [4,5], [[1,5], [2,5], [3,5]], [3,5]),
          qSubtractLike("Maak", [5,6], [[1,6], [2,6], [3,6]], [3,6]),
          qSubtractLike("Maak", [7,8], [[1,8], [2,8], [3,8]], [5,8]),
          qSubtractLike("Maak", [6,10], [[1,10], [2,10], [3,10]], [4,10]),
          qSubtractLike("Maak", [5,7], [[1,7], [2,7], [3,7]], [2,7]),
          qSubtractLike("Maak", [4,6], [[1,6], [2,6], [3,6]], [2,6]),
          qSubtractLike("Maak", [8,9], [[1,9], [2,9], [4,9]], [4,9]),
          qSubtractLike("Maak", [9,10], [[1,10], [3,10], [5,10]], [6,10])
        ]
      },
      {
        id: "fractions.add.unlike.01",
        title: "Andere stukjes",
        description: "Maak de doelbreuk met bubbles die nog niet dezelfde noemer hebben.",
        mechanic: "bubble-fusion",
        roundSize: 8,
        unlocksAfter: null,
        questions: [
          qAddUnlike("Maak", [[1,2], [1,4]], [3,4], [[1,2], [1,4], [1,8], [3,8]]),
          qAddUnlike("Maak", [[1,2], [1,3]], [5,6], [[1,2], [1,3], [1,6], [2,6]]),
          qAddUnlike("Maak", [[1,3], [1,6]], [3,6], [[1,3], [1,6], [1,2], [1,4]]),
          qAddUnlike("Maak", [[2,5], [1,10]], [5,10], [[2,5], [1,10], [1,5], [3,10]]),
          qAddUnlike("Maak", [[1,4], [1,8]], [3,8], [[1,4], [1,8], [1,2], [2,8]]),
          qAddUnlike("Maak", [[2,3], [1,6]], [5,6], [[2,3], [1,6], [1,3], [1,2]]),
          qAddUnlike("Maak", [[1,5], [1,10]], [3,10], [[1,5], [1,10], [2,10], [1,2]]),
          qAddUnlike("Maak", [[3,4], [1,8]], [7,8], [[3,4], [1,8], [1,4], [2,8]])
        ]
      },
      {
        id: "fractions.subtract.unlike.01",
        title: "Anders weg",
        description: "Neem weg met andere stukjes. Het spel maakt de stukjes kort gelijk.",
        mechanic: "subtract-bubble",
        roundSize: 8,
        unlocksAfter: null,
        questions: [
          qSubtractUnlike("Maak", [3,4], [[1,2], [1,4], [1,8]], [1,4]),
          qSubtractUnlike("Maak", [5,6], [[1,2], [1,3], [1,6]], [1,3]),
          qSubtractUnlike("Maak", [1,2], [[1,3], [1,6], [1,4]], [1,6]),
          qSubtractUnlike("Maak", [7,8], [[1,4], [1,2], [1,8]], [5,8]),
          qSubtractUnlike("Maak", [3,5], [[1,10], [1,5], [3,10]], [1,2]),
          qSubtractUnlike("Maak", [2,3], [[1,6], [1,3], [1,2]], [1,2]),
          qSubtractUnlike("Maak", [4,5], [[1,10], [1,5], [3,10]], [7,10]),
          qSubtractUnlike("Maak", [3,4], [[1,8], [1,4], [1,2]], [5,8])
        ]
      },
      {
        id: "fractions.more.01",
        title: "Meer dan één",
        description: "Maak een breuk groter dan 1 door gewone bubbles en min-bubbles te versmelten.",
        mechanic: "signed-fusion",
        roundSize: 8,
        unlocksAfter: null,
        questions: [
          qMoreThanOne("Maak", [5,4], [[3,4], [2,4], [-1,4], [1,4]]),
          qMoreThanOne("Maak", [3,2], [[2,2], [1,2], [-1,2], [1,2]]),
          qMoreThanOne("Maak", [7,4], [[5,4], [2,4], [-1,4], [3,4]]),
          qMoreThanOne("Maak", [4,3], [[5,3], [-1,3], [2,3], [1,3]]),
          qMoreThanOne("Maak", [8,3], [[6,3], [2,3], [-1,3], [3,3]]),
          qMoreThanOne("Maak", [6,5], [[7,5], [-1,5], [2,5], [4,5]]),
          qMoreThanOne("Maak", [9,5], [[6,5], [3,5], [-1,5], [2,5]]),
          qMoreThanOne("Maak", [7,6], [[8,6], [-1,6], [4,6], [3,6]])
        ]
      },
      {
        id: "fractions.quantity.01",
        title: "Van een hoeveelheid",
        description: "Pak een breuk van losse bubbles.",
        mechanic: "quantity-fraction",
        roundSize: 8,
        unlocksAfter: null,
        questions: [
          qQuantity("Pak", [1,2], 8),
          qQuantity("Pak", [3,4], 12),
          qQuantity("Pak", [2,3], 9),
          qQuantity("Pak", [4,5], 10),
          qQuantity("Pak", [3,6], 12),
          qQuantity("Pak", [2,5], 15),
          qQuantity("Pak", [5,8], 16),
          qQuantity("Pak", [3,10], 20)
        ]
      },
      {
        id: "fractions.multiply.integer.01",
        title: "Keer nemen",
        description: "Sleep een maalbubble op een breukbubble.",
        mechanic: "multiply-bubble",
        roundSize: 8,
        unlocksAfter: null,
        questions: [
          qMultiply("Maak", [1,4], [2,3,4], [3,4]),
          qMultiply("Maak", [2,5], [2,3,4], [4,5]),
          qMultiply("Maak", [1,3], [2,3,4], [2,3]),
          qMultiply("Maak", [1,6], [2,3,5], [5,6]),
          qMultiply("Maak", [2,7], [2,3,4], [6,7]),
          qMultiply("Maak", [3,4], [2,3,4], [6,4]),
          qMultiply("Maak", [2,3], [2,3,4], [4,3]),
          qMultiply("Maak", [3,5], [2,3,4], [9,5])
        ]
      },
      {
        id: "fractions.multiply.fraction.01",
        title: "Breuk keer",
        description: "Sleep een breuk-maalbubble op een gewone breukbubble.",
        mechanic: "multiply-bubble",
        roundSize: 8,
        unlocksAfter: null,
        questions: [
          qMultiply("Maak", [3,4], [[1,2], [1,3], [2,3]], [3,8]),
          qMultiply("Maak", [3,5], [[1,2], [1,3], [2,3]], [3,10]),
          qMultiply("Maak", [1,3], [[2,5], [1,2], [3,4]], [2,15]),
          qMultiply("Maak", [1,4], [[3,5], [1,2], [2,3]], [3,20]),
          qMultiply("Maak", [5,6], [[1,2], [1,3], [2,5]], [5,12]),
          qMultiply("Maak", [2,5], [[1,3], [1,2], [3,4]], [2,15]),
          qMultiply("Maak", [5,8], [[1,3], [1,2], [2,3]], [5,24]),
          qMultiply("Maak", [3,7], [[1,2], [1,3], [2,5]], [3,14])
        ]
      },
      {
        id: "fractions.divide.integer.01",
        title: "Deel eerlijk",
        description: "Sleep een deelbubble op een breukbubble.",
        mechanic: "divide-bubble",
        roundSize: 8,
        unlocksAfter: null,
        questions: [
          qDivide("Maak", [3,4], [2,3,4], [3,8]),
          qDivide("Maak", [1,2], [2,3,4], [1,4]),
          qDivide("Maak", [2,3], [2,3,4], [1,3]),
          qDivide("Maak", [3,5], [2,3,4], [1,5]),
          qDivide("Maak", [4,5], [2,3,4], [2,5]),
          qDivide("Maak", [1,2], [2,3,4], [1,6]),
          qDivide("Maak", [1,4], [2,3,4], [1,8]),
          qDivide("Maak", [3,5], [2,3,4], [3,20])
        ]
      },
      {
        id: "fractions.divide.fraction.01",
        title: "Deel door stukjes",
        description: "Sleep een breuk-deelbubble op een gewone breukbubble.",
        mechanic: "divide-bubble",
        roundSize: 8,
        unlocksAfter: null,
        questions: [
          qDivide("Maak", [1,2], [[1,2], [1,3], [1,4]], [1,1]),
          qDivide("Maak", [1,3], [[1,3], [1,2], [1,4]], [1,1]),
          qDivide("Maak", [3,4], [[1,2], [1,3], [1,4]], [3,2]),
          qDivide("Maak", [2,3], [[1,3], [1,2], [2,3]], [2,1]),
          qDivide("Maak", [3,5], [[1,5], [1,3], [1,2]], [3,1]),
          qDivide("Maak", [4,5], [[2,5], [1,2], [1,5]], [2,1]),
          qDivide("Maak", [3,8], [[1,4], [1,2], [3,4]], [3,2]),
          qDivide("Maak", [5,6], [[1,3], [1,2], [2,3]], [5,2])
        ]
      }
      ,{
        id: "fractions.operator.mix.01",
        title: "Kies slim",
        description: "Gebruik de juiste bubble-actie: samen, min, maal of deel.",
        mechanic: "operator-mix",
        roundSize: 8,
        unlocksAfter: null,
        questions: [
          qOperatorMix("Maak", [3,4], [["fraction", [1,4]], ["multiply", 3], ["divide", 2], ["subtract", [1,4]], ["multiply", 2]]),
          qOperatorMix("Maak", [1,4], [["fraction", [3,4]], ["subtract", [1,2]], ["multiply", 2], ["divide", [1,3]], ["subtract", [1,4]]]),
          qOperatorMix("Maak", [3,2], [["fraction", [3,4]], ["divide", [1,2]], ["multiply", 3], ["subtract", [1,4]], ["divide", 2]]),
          qOperatorMix("Maak", [3,8], [["fraction", [3,4]], ["divide", 2], ["multiply", 2], ["subtract", [1,4]], ["divide", [1,3]]]),
          qOperatorMix("Maak", [5,6], [["fraction", [1,2]], ["fraction", [1,3]], ["subtract", [1,6]], ["multiply", 2], ["divide", [1,2]]]),
          qOperatorMix("Maak", [1,2], [["fraction", [2,3]], ["subtract", [1,6]], ["multiply", 2], ["divide", 3], ["fraction", [1,6]]]),
          qOperatorMix("Maak", [7,8], [["fraction", [3,4]], ["fraction", [1,8]], ["subtract", [1,8]], ["multiply", 2], ["divide", 2]]),
          qOperatorMix("Maak", [2,1], [["fraction", [1,1]], ["divide", [1,2]], ["multiply", [1,2]], ["subtract", [1,2]], ["divide", 2]])
        ]
      }
      ,{
        id: "fractions.value.forms.01",
        title: "Andere vormen",
        description: "Maak procenten en kommagetallen door breukbubbles in elkaar te slepen.",
        mechanic: "bubble-fusion",
        roundSize: 8,
        unlocksAfter: null,
        questions: [
          qValueForm("Maak", "50%", [1,2], [[1,4], [1,4], [1,8], [1,5]]),
          qValueForm("Maak", "0,5", [1,2], [[1,8], [3,8], [1,5], [1,4]]),
          qValueForm("Maak", "25%", [1,4], [[1,8], [1,8], [1,10], [1,5]]),
          qValueForm("Maak", "0,25", [1,4], [[1,10], [3,20], [1,8], [1,5]]),
          qValueForm("Maak", "75%", [3,4], [[1,2], [1,4], [1,8], [1,5]]),
          qValueForm("Maak", "0,75", [3,4], [[3,8], [3,8], [1,4], [1,5]]),
          qValueForm("Maak", "20%", [1,5], [[1,10], [1,10], [1,8], [1,4]]),
          qValueForm("Maak", "0,4", [2,5], [[1,5], [1,5], [1,10], [1,4]])
        ]
      }
      ,{
        id: "fractions.percent.quantity.01",
        title: "Procent van hoeveelheid",
        description: "Pak een procent of kommagetal van losse bubbles.",
        mechanic: "quantity-fraction",
        roundSize: 8,
        unlocksAfter: null,
        questions: [
          qQuantityForm("Pak", "50%", [1,2], 12),
          qQuantityForm("Pak", "25%", [1,4], 16),
          qQuantityForm("Pak", "75%", [3,4], 12),
          qQuantityForm("Pak", "0,5", [1,2], 10),
          qQuantityForm("Pak", "0,25", [1,4], 20),
          qQuantityForm("Pak", "20%", [1,5], 15),
          qQuantityForm("Pak", "0,4", [2,5], 20),
          qQuantityForm("Pak", "10%", [1,10], 30)
        ]
      }
      ,{
        id: "fractions.final.mix.01",
        title: "Eindbaas",
        description: "Mix van breuken, procenten, kommagetallen en operatorbubbles.",
        mechanic: "operator-mix",
        roundSize: 8,
        unlocksAfter: null,
        questions: [
          withMechanic(qOperatorMix("Maak", [3,4], [["fraction", [1,4]], ["multiply", 3], ["divide", 2], ["subtract", [1,4]], ["multiply", 2]]), "operator-mix"),
          withMechanic(qAddUnlike("Maak", [[1,2], [1,3]], [5,6], [[1,2], [1,3], [1,6], [2,6]]), "bubble-fusion"),
          withMechanic(qSubtractUnlike("Maak", [3,4], [[1,2], [1,4], [1,8]], [1,4]), "subtract-bubble"),
          withMechanic(qMultiply("Maak", [3,4], [[1,2], [1,3], [2,3]], [3,8]), "multiply-bubble"),
          withMechanic(qDivide("Maak", [3,4], [[1,2], [1,3], [1,4]], [3,2]), "divide-bubble"),
          withMechanic(qValueForm("Maak", "0,75", [3,4], [[1,2], [1,4], [1,8], [1,5]]), "bubble-fusion"),
          withMechanic(qQuantityForm("Pak", "50%", [1,2], 12), "quantity-fraction"),
          withMechanic(qOperatorMix("Maak", [2,1], [["fraction", [1,1]], ["divide", [1,2]], ["multiply", [1,2]], ["subtract", [1,2]], ["divide", 2]]), "operator-mix")
        ]
      }

    ]
  };

  function qVisual(prompt, visualKind, target, rawChoices) {
    return {
      prompt: prompt,
      visual: {
        kind: visualKind,
        numerator: target[0],
        denominator: target[1]
      },
      choices: shuffle(rawChoices.map(function (item) {
        return {
          numerator: item[0],
          denominator: item[1],
          correct: item[2]
        };
      }))
    };
  }

  function qFill(prompt, target, visualKind) {
    return {
      prompt: prompt,
      target: {
        numerator: target[0],
        denominator: target[1]
      },
      visual: {
        kind: visualKind || "bar",
        numerator: 0,
        denominator: target[1]
      },
      answer: {
        type: "fraction-fill",
        numerator: target[0],
        denominator: target[1]
      }
    };
  }

  function qParts(prompt, visualKind, target, correctNumber, rawNumbers) {
    return {
      prompt: prompt,
      visual: {
        kind: visualKind,
        numerator: target[0],
        denominator: target[1]
      },
      choices: shuffle(rawNumbers.map(function (value) {
        return {
          label: String(value),
          correct: value === correctNumber
        };
      }))
    };
  }

  function qEquivalent(prompt, visualKind, target, rawChoices) {
    return {
      prompt: prompt,
      targetVisual: {
        kind: visualKind,
        numerator: target[0],
        denominator: target[1]
      },
      choices: shuffle(rawChoices.map(function (item) {
        return {
          visual: {
            kind: visualKind,
            numerator: item[0],
            denominator: item[1]
          },
          numerator: item[0],
          denominator: item[1],
          correct: item[2]
        };
      }))
    };
  }

  function qLine(prompt, target, tickDenominator) {
    return {
      prompt: prompt,
      target: {
        numerator: target[0],
        denominator: target[1]
      },
      tickDenominator: tickDenominator || target[1],
      tolerance: 0.065,
      answer: {
        type: "number-line-position",
        numerator: target[0],
        denominator: target[1]
      }
    };
  }

  function qLineMulti(prompt, rawFractions, tickDenominator) {
    return {
      prompt: prompt,
      mode: "multi",
      tickDenominator: tickDenominator || rawFractions.reduce(function (max, item) { return Math.max(max, item[1]); }, 1),
      tolerance: 0.055,
      items: shuffle(rawFractions.map(function (item, index) {
        return {
          id: "line-" + index + "-" + item[0] + "-" + item[1],
          numerator: item[0],
          denominator: item[1]
        };
      })),
      answer: {
        type: "number-line-multi",
        items: rawFractions.map(function (item) {
          return { numerator: item[0], denominator: item[1] };
        })
      }
    };
  }

  function qAddLike(prompt, operands, target, rawPieces) {
    return {
      prompt: prompt,
      operation: operands.map(function (item) {
        return { numerator: item[0], denominator: item[1] };
      }),
      target: {
        numerator: target[0],
        denominator: target[1]
      },
      answer: {
        type: "fraction-equals",
        numerator: target[0],
        denominator: target[1]
      },
      pieces: makePieces(rawPieces)
    };
  }

  function qAddUnlike(prompt, operands, target, rawPieces) {
    var q = qAddLike(prompt, operands, target, rawPieces);
    q.mode = "guided-unlike";
    q.guidedConversion = true;
    return q;
  }

  function qSubtractLike(prompt, start, rawRemovers, target) {
    return {
      prompt: prompt,
      start: {
        numerator: start[0],
        denominator: start[1]
      },
      target: {
        numerator: target[0],
        denominator: target[1]
      },
      answer: {
        type: "fraction-equals",
        numerator: target[0],
        denominator: target[1]
      },
      removers: makePieces(rawRemovers)
    };
  }


  function qSubtractUnlike(prompt, start, rawRemovers, target) {
    var q = qSubtractLike(prompt, start, rawRemovers, target);
    q.mode = "guided-unlike";
    q.guidedConversion = true;
    return q;
  }


  function qMoreThanOne(prompt, target, rawPieces) {
    return {
      prompt: prompt,
      target: {
        numerator: target[0],
        denominator: target[1]
      },
      answer: {
        type: "fraction-equals",
        numerator: target[0],
        denominator: target[1]
      },
      pieces: makePieces(rawPieces || [[target[0] - 1, target[1]], [1, target[1]], [-1, target[1]], [2, target[1]]]),
      allowNegativePieces: true
    };
  }

  function qMultiply(prompt, base, factors, target) {
    var basePiece = {
      id: "base-" + base[0] + "-" + base[1],
      kind: "fraction",
      numerator: base[0],
      denominator: base[1]
    };
    var pieces = [basePiece].concat((factors || []).map(function (rawFactor, index) {
      var factor = normalizeMultiplyFactor(rawFactor);
      return {
        id: "mul-" + index + "-" + multiplyFactorId(factor),
        kind: "operator",
        operator: "multiply",
        factor: factor
      };
    }));
    return {
      prompt: prompt,
      target: {
        numerator: target[0],
        denominator: target[1]
      },
      base: {
        numerator: base[0],
        denominator: base[1]
      },
      answer: {
        type: "fraction-equals",
        numerator: target[0],
        denominator: target[1]
      },
      pieces: shuffle(pieces)
    };
  }

  function normalizeMultiplyFactor(rawFactor) {
    if (Array.isArray(rawFactor)) {
      return {
        numerator: rawFactor[0],
        denominator: rawFactor[1]
      };
    }
    return rawFactor;
  }

  function multiplyFactorId(factor) {
    if (factor && typeof factor === "object") return "x" + factor.numerator + "-" + factor.denominator;
    return "x" + factor;
  }


  function qDivide(prompt, base, divisors, target) {
    var basePiece = {
      id: "base-div-" + base[0] + "-" + base[1],
      kind: "fraction",
      numerator: base[0],
      denominator: base[1]
    };
    var pieces = [basePiece].concat((divisors || []).map(function (rawDivisor, index) {
      var divisor = normalizeDivideDivisor(rawDivisor);
      return {
        id: "div-" + index + "-d" + divideDivisorId(divisor),
        kind: "operator",
        operator: "divide",
        divisor: divisor
      };
    }));
    return {
      prompt: prompt,
      target: {
        numerator: target[0],
        denominator: target[1]
      },
      base: {
        numerator: base[0],
        denominator: base[1]
      },
      answer: {
        type: "fraction-equals",
        numerator: target[0],
        denominator: target[1]
      },
      pieces: shuffle(pieces)
    };
  }

  function normalizeDivideDivisor(rawDivisor) {
    if (Array.isArray(rawDivisor)) {
      return {
        numerator: rawDivisor[0],
        denominator: rawDivisor[1]
      };
    }
    return rawDivisor;
  }

  function divideDivisorId(divisor) {
    if (divisor && typeof divisor === "object") return divisor.numerator + "-" + divisor.denominator;
    return String(divisor);
  }


  function qOperatorMix(prompt, target, rawPieces) {
    return {
      prompt: prompt,
      target: {
        numerator: target[0],
        denominator: target[1]
      },
      answer: {
        type: "fraction-equals",
        numerator: target[0],
        denominator: target[1]
      },
      pieces: shuffle((rawPieces || []).map(function (item, index) {
        var type = item[0];
        var value = item[1];
        if (type === "fraction") {
          return {
            id: "mix-f" + index + "-" + value[0] + "-" + value[1],
            kind: "fraction",
            numerator: value[0],
            denominator: value[1]
          };
        }
        if (type === "subtract") {
          return {
            id: "mix-sub" + index + "-" + value[0] + "-" + value[1],
            kind: "operator",
            operator: "subtract",
            value: {
              numerator: value[0],
              denominator: value[1]
            }
          };
        }
        if (type === "multiply") {
          return {
            id: "mix-mul" + index + "-" + operatorValueId(value),
            kind: "operator",
            operator: "multiply",
            factor: normalizeOperatorValue(value)
          };
        }
        if (type === "divide") {
          return {
            id: "mix-div" + index + "-" + operatorValueId(value),
            kind: "operator",
            operator: "divide",
            divisor: normalizeOperatorValue(value)
          };
        }
        return {
          id: "mix-empty" + index,
          kind: "fraction",
          numerator: 0,
          denominator: 1
        };
      }))
    };
  }

  function normalizeOperatorValue(value) {
    if (Array.isArray(value)) {
      return {
        numerator: value[0],
        denominator: value[1]
      };
    }
    return value;
  }

  function operatorValueId(value) {
    if (Array.isArray(value)) return value[0] + "-" + value[1];
    return String(value);
  }


  function qValueForm(prompt, targetLabel, target, rawPieces) {
    return {
      prompt: prompt,
      targetLabel: targetLabel,
      target: {
        numerator: target[0],
        denominator: target[1]
      },
      answer: {
        type: "fraction-equals",
        numerator: target[0],
        denominator: target[1]
      },
      guidedConversion: true,
      pieces: makePieces(rawPieces)
    };
  }

  function qQuantity(prompt, fraction, quantity) {
    var numerator = Number(fraction[0]);
    var denominator = Number(fraction[1]);
    var total = Number(quantity);
    var groupSize = total / denominator;
    var targetCount = groupSize * numerator;
    return {
      prompt: prompt,
      fraction: {
        numerator: numerator,
        denominator: denominator
      },
      quantity: total,
      groupSize: groupSize,
      targetCount: targetCount,
      answer: {
        type: "quantity-selection",
        groups: numerator,
        count: targetCount,
        quantity: total
      }
    };
  }

  function qQuantityForm(prompt, label, fraction, quantity) {
    var q = qQuantity(prompt, fraction, quantity);
    q.targetLabel = label;
    return q;
  }

  function withMechanic(question, mechanic) {
    question.mechanic = mechanic;
    return question;
  }
function makePieces(rawPieces) {
    return shuffle(rawPieces.map(function (item, index) {
      return {
        id: "p" + index + "-" + item[0] + "-" + item[1],
        numerator: item[0],
        denominator: item[1]
      };
    }));
  }

  function shuffle(list) {
    return list
      .map(function (value) { return { value: value, sort: Math.random() }; })
      .sort(function (a, b) { return a.sort - b.sort; })
      .map(function (item) { return item.value; });
  }
})();
