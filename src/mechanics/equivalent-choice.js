(function () {
  window.BP = window.BP || {};
  BP.Mechanics = BP.Mechanics || {};

  BP.Mechanics["equivalent-choice"] = {
    render: render,
    mount: mount
  };

  function render(question, roundState) {
    var feedbackClass = "";
    var feedbackText = BP.I18n.text("Pop de bubble met dezelfde waarde.");
    if (roundState.lastAnswer) {
      feedbackClass = roundState.lastAnswer.correct ? "good" : "bad";
      feedbackText = roundState.lastAnswer.correct ? BP.I18n.text("Plop! Zelfde waarde.") : BP.I18n.text("Nog niet. Vergelijk hoeveel gevuld is.");
    }

    return '' +
      '<section class="question-card equivalent-card coherent-card bubblepop-card">' +
        '<h2 class="question-title">' + BP.Fraction.escapeHtml(BP.I18n.text(question.prompt)) + '</h2>' +
        '<div class="equivalent-target-shell">' +
          '<span class="mini-label">' + BP.I18n.t('targetBubble') + '</span>' +
          '<div class="equivalent-target bubble-target-card choice-bubble visual-choice-bubble target-visual-bubble">' +
            BP.Bubble.skinLayer(null, 'normal') +
            '<span class="choice-bubble-shine"></span>' +
            '<span class="choice-bubble-content">' + BP.VisualFraction.html(question.targetVisual, { caption: true, large: false }) + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="equivalent-grid equivalent-bubble-grid">' + question.choices.map(function (choice, index) {
          var answerState = "";
          if (roundState.lastAnswer && roundState.lastAnswer.choiceIndex === index) {
            answerState = roundState.lastAnswer.correct ? " correct popped" : " wrong";
          }
          return '' +
            '<button class="equivalent-option choice-bubble visual-choice-bubble png-choice-bubble' + answerState + '" data-choice-index="' + index + '">' +
              BP.Bubble.skinLayer(null, 'normal') +
              '<span class="choice-bubble-shine"></span>' +
              '<span class="choice-bubble-content">' + BP.VisualFraction.html(choice.visual, { caption: true, large: false }) + '</span>' +
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
