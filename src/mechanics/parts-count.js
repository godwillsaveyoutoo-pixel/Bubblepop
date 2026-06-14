(function () {
  window.BP = window.BP || {};
  BP.Mechanics = BP.Mechanics || {};

  BP.Mechanics["parts-count"] = {
    render: render,
    mount: mount
  };

  function render(question, roundState) {
    var feedbackClass = "";
    var feedbackText = BP.I18n.text("Pop het juiste getal.");
    if (roundState.lastAnswer) {
      feedbackClass = roundState.lastAnswer.correct ? "good" : "bad";
      feedbackText = roundState.lastAnswer.correct ? BP.I18n.text("Plop!") : BP.I18n.text("Nog niet. Teller = gekleurd, noemer = totaal.");
    }

    return '' +
      '<section class="question-card parts-card coherent-card bubblepop-card">' +
        '<h2 class="question-title">' + BP.Fraction.escapeHtml(BP.I18n.text(question.prompt)) + '</h2>' +
        '<div class="bubble-visual-wrap"><div class="prompt-visual-bubble choice-bubble png-choice-bubble target-visual-bubble">' + BP.Bubble.skinLayer(null, 'normal') + '<span class="choice-bubble-content">' + BP.VisualFraction.html(question.visual, { caption: false, large: true }) + '</span></div></div>' +
        '<div class="number-choice-grid number-bubble-grid">' + question.choices.map(function (choice, index) {
          var answerState = "";
          if (roundState.lastAnswer && roundState.lastAnswer.choiceIndex === index) {
            answerState = roundState.lastAnswer.correct ? " correct popped" : " wrong";
          }
          return '<button class="number-option choice-bubble number-bubble png-choice-bubble' + answerState + '" data-choice-index="' + index + '">' + BP.Bubble.skinLayer(null, 'normal') + '<span class="choice-bubble-shine"></span><span class="choice-bubble-content">' + BP.Fraction.escapeHtml(choice.label) + '</span></button>';
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
