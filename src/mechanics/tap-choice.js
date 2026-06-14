(function () {
  window.BP = window.BP || {};
  BP.Mechanics = BP.Mechanics || {};

  BP.Mechanics["tap-choice"] = {
    render: render,
    mount: mount
  };

  function render(question, roundState) {
    var feedbackClass = "";
    var feedbackText = "Kies een bubble";
    if (roundState.lastAnswer) {
      feedbackClass = roundState.lastAnswer.correct ? "good" : "bad";
      feedbackText = roundState.lastAnswer.correct ? "Juist! Combo groeit." : "Nog niet. Probeer opnieuw.";
    }

    return '' +
      '<section class="question-card">' +
        '<h2 class="question-title">' + BP.Fraction.escapeHtml(question.prompt) + '</h2>' +
        '<div class="bubble-grid">' + question.choices.map(function (choice, index) {
          var answerState = "";
          if (roundState.lastAnswer && roundState.lastAnswer.choiceIndex === index) {
            answerState = roundState.lastAnswer.correct ? " correct" : " wrong";
          }
          return '' +
            '<button class="bubble-option' + answerState + '" data-choice-index="' + index + '" aria-label="' + choice.numerator + ' op ' + choice.denominator + '">' +
              BP.AssetManager.image("bubble.blue.idle", "") +
              BP.Fraction.html(choice.numerator, choice.denominator) +
            '</button>';
        }).join('') + '</div>' +
      '</section>' +
      '<div class="feedback ' + feedbackClass + '">' + feedbackText + '</div>';
  }

  function mount(container, onAnswer) {
    container.querySelectorAll('[data-choice-index]').forEach(function (button) {
      button.addEventListener('click', function () {
        onAnswer(Number(button.getAttribute('data-choice-index')));
      });
    });
  }
})();
