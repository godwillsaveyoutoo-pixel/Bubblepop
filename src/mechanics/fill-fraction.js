(function () {
  window.BP = window.BP || {};
  BP.Mechanics = BP.Mechanics || {};

  BP.Mechanics["fill-fraction"] = {
    render: render,
    mount: mount,
    supportsUndo: true,
    selfManagedFeedback: true
  };

  var selected = [];

  function render(question, roundState) {
    selected = [];
    var target = question.target;
    var feedbackClass = "";
    var feedbackText = BP.I18n.text("Tik de delen die moeten oplichten.");
    if (roundState.lastAnswer) {
      feedbackClass = roundState.lastAnswer.correct ? "good" : "bad";
      feedbackText = roundState.lastAnswer.correct ? BP.I18n.text("Plop!") : BP.I18n.text("Probeer opnieuw.");
    }

    return '' +
      '<section class="question-card fill-card coherent-card bubblepop-card">' +
        '<h2 class="question-title fill-title">' + BP.Fraction.escapeHtml(question.prompt) + ' ' + promptBubbleHtml(target) + '</h2>' +
        '<div class="fill-stage bubble-action-stage" data-fill-stage>' +
          fillGridHtml(question.visual, target) +
        '</div>' +
      '</section>' +
      '<div class="feedback ' + feedbackClass + '" data-fill-feedback>' + feedbackText + '</div>';
  }


  function promptBubbleHtml(target) {
    return '' +
      '<span class="fill-target-bubble choice-bubble png-choice-bubble">' +
        BP.Bubble.skinLayer(null, 'normal') +
        '<span class="choice-bubble-content">' + BP.Fraction.html(target.numerator, target.denominator) + '</span>' +
      '</span>';
  }

  function fillGridHtml(visual, target) {
    var denominator = Number(target.denominator || (visual && visual.denominator) || 1);
    var kind = (visual && visual.kind) || "bar";
    var cols = columnsFor(denominator, kind);
    var cells = [];
    for (var i = 0; i < denominator; i += 1) {
      cells.push(
        '<button class="fill-cell bubble-fill-cell" type="button" data-fill-index="' + i + '" aria-label="' + BP.I18n.t('part') + ' ' + (i + 1) + ' ' + BP.I18n.t('of') + ' ' + denominator + '"></button>'
      );
    }
    return '' +
      '<div class="fill-grid fill-kind-' + BP.Fraction.escapeHtml(kind) + ' bubble-fill-grid" data-fill-grid style="--parts:' + denominator + '; --cols:' + cols + ';">' +
        cells.join('') +
      '</div>';
  }

  function columnsFor(denominator, kind) {
    if (kind === "bar") return denominator;
    if (denominator <= 3) return denominator;
    if (denominator === 4) return 2;
    if (denominator === 5) return 5;
    if (denominator === 6) return 3;
    if (denominator === 8) return 4;
    if (denominator === 10) return 5;
    return Math.ceil(Math.sqrt(denominator));
  }

  function mount(container, onAnswer, question, roundState, helpers) {
    var stage = container.querySelector('[data-fill-stage]');
    var undoButton = helpers.root.querySelector('[data-action="undo"]');
    var inputLocked = false;
    selected = [];
    updateUndo();

    stage.querySelectorAll('[data-fill-index]').forEach(function (piece) {
      piece.addEventListener('click', function () {
        togglePiece(piece);
      });
      piece.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          togglePiece(piece);
        }
      });
    });

    if (undoButton) {
      undoButton.addEventListener('click', function () {
        if (inputLocked) return;
        var last = selected.pop();
        if (last === undefined) return;
        var piece = stage.querySelector('[data-fill-index="' + last + '"]');
        if (piece) piece.classList.remove('filled-by-player', 'just-filled');
        updateUndo();
      });
    }

    function togglePiece(piece) {
      if (inputLocked) return;
      var idx = Number(piece.getAttribute('data-fill-index'));
      var existing = selected.indexOf(idx);
      if (existing >= 0) {
        selected.splice(existing, 1);
        piece.classList.remove('filled-by-player', 'just-filled');
      } else {
        selected.push(idx);
        piece.classList.add('filled-by-player');
        piece.classList.remove('just-filled');
        void piece.offsetWidth;
        piece.classList.add('just-filled');
      }
      updateUndo();
      maybeComplete();
    }

    function maybeComplete() {
      var target = question.target;
      if (selected.length !== Number(target.numerator)) return;
      inputLocked = true;
      updateUndo();
      stage.classList.remove('pulse-correct');
      void stage.offsetWidth;
      stage.classList.add('pulse-correct', 'bubble-pop-success');
      var feedback = container.querySelector('[data-fill-feedback]');
      if (feedback) {
        feedback.className = 'feedback good';
        feedback.textContent = BP.I18n.text('Plop!');
      }
      window.setTimeout(function () {
        onAnswer({
          type: "fraction-fill",
          numerator: selected.length,
          denominator: target.denominator,
          selected: selected.slice()
        });
      }, 180);
    }

    function updateUndo() {
      if (undoButton) undoButton.disabled = inputLocked || selected.length === 0;
    }

  }
})();
