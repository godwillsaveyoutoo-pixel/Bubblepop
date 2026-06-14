(function () {
  window.BP = window.BP || {};
  BP.Mechanics = BP.Mechanics || {};

  BP.Mechanics["choose-representation"] = {
    render: render,
    mount: mount
  };

  function render(question, roundState) {
    var feedbackClass = "";
    var feedbackText = BP.I18n.text("Pop de breukbubble die erbij past.");
    if (roundState.lastAnswer) {
      feedbackClass = roundState.lastAnswer.correct ? "good" : "bad";
      feedbackText = roundState.lastAnswer.correct ? BP.I18n.text("Plop!") : BP.I18n.text("Nog niet. Kijk naar gekleurd tegenover totaal.");
    }

    return '' +
      '<section class="question-card visual-choice-card coherent-card bubblepop-card">' +
        '<h2 class="question-title">' + BP.Fraction.escapeHtml(BP.I18n.text(question.prompt)) + '</h2>' +
        '<div class="bubble-visual-wrap">' + BP.VisualFraction.html(question.visual, { caption: false, large: true }) + '</div>' +
        '<div class="representation-grid choice-bubble-grid">' + question.choices.map(function (choice, index) {
          var answerState = "";
          if (roundState.lastAnswer && roundState.lastAnswer.choiceIndex === index) {
            answerState = roundState.lastAnswer.correct ? " correct popped" : " wrong";
          }
          return '' +
            '<button class="representation-option choice-bubble png-choice-bubble' + answerState + '" data-choice-index="' + index + '" aria-label="' + BP.Fraction.escapeHtml(choice.numerator + '/' + choice.denominator) + '">' +
              BP.Bubble.skinLayer(null, 'normal') +
              '<span class="choice-bubble-shine"></span>' +
              '<span class="choice-bubble-content">' + BP.Fraction.html(choice.numerator, choice.denominator) + '</span>' +
            '</button>';
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
