(function () {
  window.BP = window.BP || {};
  BP.Mechanics = BP.Mechanics || {};

  BP.Mechanics["merge-to-target"] = {
    render: render,
    mount: mount,
    supportsUndo: true,
    selfManagedFeedback: true
  };

  function render(question, roundState) {
    var feedbackClass = "";
    var feedbackText = "Sleep bubbles in de grote bubble of tik ze aan.";
    if (roundState.lastAnswer) {
      feedbackClass = roundState.lastAnswer.correct ? "good" : "bad";
      feedbackText = roundState.lastAnswer.correct
        ? "Juist! De bubble is precies groot genoeg."
        : "Nog niet. Gebruik ↶ om je laatste zet terug te nemen.";
    }

    return '' +
      '<section class="question-card merge-card growth-card">' +
        '<h2 class="question-title merge-title">Maak ' + BP.Fraction.html(question.target.numerator, question.target.denominator) + '</h2>' +
        '<div class="growth-stage" data-growth-stage aria-label="Centrale groeibubble">' +
          '<div class="target-bubble" data-target-bubble>' +
            BP.AssetManager.image("bubble.blue.idle", "") +
            '<div class="target-bubble-label" data-target-label>sleep hier</div>' +
          '</div>' +
        '</div>' +
        '<div class="merge-sum" data-merge-sum>huidig: 0</div>' +
        '<div class="piece-pool growth-pool">' + question.pieces.map(function (piece, index) {
          return '' +
            '<button class="fraction-piece" data-piece-index="' + index + '" draggable="true" aria-label="' + piece.numerator + ' op ' + piece.denominator + '">' +
              BP.AssetManager.image("bubble.blue.idle", "") +
              BP.Fraction.html(piece.numerator, piece.denominator) +
            '</button>';
        }).join('') + '</div>' +
      '</section>' +
      '<div class="feedback ' + feedbackClass + '" data-merge-feedback>' + feedbackText + '</div>';
  }

  function mount(container, onAnswer, question, roundState, context) {
    var selected = [];
    var stage = container.querySelector('[data-growth-stage]');
    var targetBubble = container.querySelector('[data-target-bubble]');
    var targetLabel = container.querySelector('[data-target-label]');
    var sumLabel = container.querySelector('[data-merge-sum]');
    var feedback = container.querySelector('[data-merge-feedback]');
    var buttons = Array.prototype.slice.call(container.querySelectorAll('[data-piece-index]'));
    var undoButton = context && context.root ? context.root.querySelector('[data-action="undo"]') : null;
    var recentlyDragged = false;
    var solved = false;
    var lastMistakeKey = null;

    buttons.forEach(function (button) {
      var index = Number(button.getAttribute('data-piece-index'));

      button.addEventListener('click', function () {
        if (recentlyDragged) return;
        addPiece(index, button);
      });

      button.addEventListener('dragstart', function (event) {
        event.dataTransfer.setData('text/plain', String(index));
      });

      installPointerDrag(button, index);
    });

    if (stage) {
      stage.addEventListener('dragover', function (event) {
        event.preventDefault();
        stage.classList.add('drag-over');
      });

      stage.addEventListener('dragleave', function () {
        stage.classList.remove('drag-over');
      });

      stage.addEventListener('drop', function (event) {
        event.preventDefault();
        stage.classList.remove('drag-over');
        var index = Number(event.dataTransfer.getData('text/plain'));
        var button = container.querySelector('[data-piece-index="' + index + '"]');
        addPiece(index, button);
      });
    }

    if (undoButton) {
      undoButton.disabled = true;
      undoButton.addEventListener('click', undoLastMove);
    }

    updateGrowthView();

    function installPointerDrag(button, index) {
      var drag = null;

      button.addEventListener('pointerdown', function (event) {
        if (button.disabled || solved) return;
        drag = {
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          moved: false
        };
        button.setPointerCapture(event.pointerId);
        button.classList.add('dragging');
      });

      button.addEventListener('pointermove', function (event) {
        if (!drag || drag.pointerId !== event.pointerId) return;
        var dx = event.clientX - drag.startX;
        var dy = event.clientY - drag.startY;
        if (Math.abs(dx) + Math.abs(dy) > 6) drag.moved = true;
        if (drag.moved) {
          button.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(1.07)';
          button.style.zIndex = 20;
        }
      });

      button.addEventListener('pointerup', function (event) {
        if (!drag || drag.pointerId !== event.pointerId) return;
        var wasMoved = drag.moved;
        drag = null;
        button.classList.remove('dragging');

        if (wasMoved) {
          recentlyDragged = true;
          window.setTimeout(function () { recentlyDragged = false; }, 180);
          if (isInside(event.clientX, event.clientY, stage)) {
            addPiece(index, button);
          } else {
            resetDragStyle(button);
          }
        } else {
          resetDragStyle(button);
        }
      });

      button.addEventListener('pointercancel', function () {
        drag = null;
        button.classList.remove('dragging');
        resetDragStyle(button);
      });
    }

    function addPiece(index, button) {
      if (solved || !button || button.disabled) return;
      var piece = questionPiece(index);
      if (!piece) return;

      selected.push({ piece: piece, index: index, button: button });
      button.disabled = true;
      button.classList.add('selected');
      resetDragStyle(button);
      updateGrowthView();
      evaluateCurrentMove();
    }

    function undoLastMove() {
      if (solved || !selected.length) return;
      var move = selected.pop();
      if (move && move.button) {
        move.button.disabled = false;
        move.button.classList.remove('selected');
      }
      updateGrowthView();
      setFeedback('', selected.length ? 'Goed. Probeer een andere bubble erbij.' : 'Sleep bubbles in de grote bubble of tik ze aan.');
    }

    function evaluateCurrentMove() {
      var pieces = selected.map(function (move) { return move.piece; });
      var sum = BP.Fraction.add(pieces);
      var target = question.target;

      if (BP.Fraction.equals(sum, target)) {
        solved = true;
        setFeedback('good', 'Juist! De bubble is precies groot genoeg.');
        pulseTarget('correct');
        if (undoButton) undoButton.disabled = true;
        window.setTimeout(function () {
          onAnswer({ pieces: pieces });
        }, 320);
        return;
      }

      if (isGreaterThan(sum, target)) {
        setFeedback('bad', 'Te groot. Tik ↶ om je laatste zet terug te nemen.');
        recordCurrentMistake();
        pulseTarget('wrong');
        return;
      }

      if (question.answer && question.answer.count && selected.length >= question.answer.count) {
        setFeedback('bad', 'Nog niet. Tik ↶ en probeer een andere combinatie.');
        recordCurrentMistake();
        pulseTarget('wrong');
        return;
      }

      setFeedback('', 'Goed. Voeg nog een bubble toe.');
      pulseTarget('grow');
    }

    function recordCurrentMistake() {
      var key = selected.map(function (move) { return move.index; }).join(',');
      if (!key || key === lastMistakeKey) return;
      lastMistakeKey = key;
      if (context && typeof context.recordMistake === 'function') {
        context.recordMistake({
          pieces: selected.map(function (move) { return move.piece; })
        });
      }
    }

    function updateGrowthView() {
      var pieces = selected.map(function (move) { return move.piece; });
      var sum = BP.Fraction.add(pieces);
      var target = question.target;
      var ratio = pieces.length ? fractionValue(sum) / fractionValue(target) : 0;
      ratio = Math.max(0, Math.min(1, ratio));
      var scale = 0.82 + ratio * 0.34;

      if (targetBubble) {
        targetBubble.style.setProperty('--bubble-scale', String(scale));
        targetBubble.classList.toggle('has-value', selected.length > 0);
      }

      if (targetLabel) {
        targetLabel.innerHTML = selected.length
          ? BP.Fraction.html(sum.numerator, sum.denominator)
          : 'sleep hier';
      }

      if (sumLabel) {
        sumLabel.innerHTML = selected.length
          ? 'huidig: ' + BP.Fraction.html(sum.numerator, sum.denominator)
          : 'huidig: 0';
      }

      if (undoButton) undoButton.disabled = selected.length === 0 || solved;
    }

    function setFeedback(className, text) {
      if (!feedback) return;
      feedback.className = 'feedback ' + className;
      feedback.textContent = text;
    }

    function pulseTarget(type) {
      if (!targetBubble) return;
      targetBubble.classList.remove('pulse-correct', 'pulse-wrong', 'pulse-grow');
      void targetBubble.offsetWidth;
      targetBubble.classList.add('pulse-' + type);
    }

    function questionPiece(index) {
      return question && question.pieces ? question.pieces[index] : null;
    }
  }

  function isInside(x, y, element) {
    if (!element) return false;
    var rect = element.getBoundingClientRect();
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  }

  function resetDragStyle(button) {
    button.style.transform = '';
    button.style.zIndex = '';
  }

  function fractionValue(fraction) {
    if (!fraction || !fraction.denominator) return 0;
    return fraction.numerator / fraction.denominator;
  }

  function isGreaterThan(a, b) {
    if (!a || !b) return false;
    return a.numerator * b.denominator > b.numerator * a.denominator;
  }
})();
