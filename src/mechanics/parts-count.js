(function () {
  window.BP = window.BP || {};
  BP.Mechanics = BP.Mechanics || {};

  BP.Mechanics["parts-count"] = {
    render: render,
    mount: mount
  };

  function render(question, roundState) {
    var feedbackClass = "";
    var feedbackText = "Pop het juiste getal.";
    if (roundState.lastAnswer) {
      feedbackClass = roundState.lastAnswer.correct ? "good" : "bad";
      feedbackText = roundState.lastAnswer.correct ? "Plop!" : "Nog niet. Teller = gekleurd, noemer = totaal.";
    }

    return '' +
      '<section class="question-card parts-card coherent-card bubblepop-card">' +
        '<h2 class="question-title">' + BP.Fraction.escapeHtml(question.prompt) + '</h2>' +
        '<div class="bubble-visual-wrap">' + BP.VisualFraction.html(question.visual, { caption: false, large: true }) + '</div>' +
        '<div class="number-choice-grid number-bubble-grid">' + question.choices.map(function (choice, index) {
          var answerState = "";
          if (roundState.lastAnswer && roundState.lastAnswer.choiceIndex === index) {
            answerState = roundState.lastAnswer.correct ? " correct popped" : " wrong";
          }
          return '<button class="number-option choice-bubble number-bubble' + answerState + '" data-choice-index="' + index + '"><span class="choice-bubble-shine"></span><span class="choice-bubble-content">' + BP.Fraction.escapeHtml(choice.label) + '</span></button>';
        }).join('') + '</div>' +
      '</section>' +
      '<div class="feedback ' + feedbackClass + '">' + feedbackText + '</div>';
  }

  function mount(container, onAnswer) {
    container.querySelectorAll('[data-choice-index]').forEach(function (button) {
      button.addEventListener('click', function () {
        popThenAnswer(button, function () {
          onAnswer(Number(button.getAttribute('data-choice-index')));
        });
      });
    });
  }

  function popThenAnswer(button, callback) {
    if (button.disabled) return;
    button.disabled = true;
    button.classList.add('popping');
    window.setTimeout(callback, 120);
  }
})();
