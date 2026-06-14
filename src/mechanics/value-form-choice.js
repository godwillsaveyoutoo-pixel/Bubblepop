(function () {
  window.BP = window.BP || {};
  BP.Mechanics = BP.Mechanics || {};

  BP.Mechanics["value-form-choice"] = {
    render: render,
    mount: mount,
    supportsUndo: true,
    selfManagedFeedback: true
  };

  function render(question) {
    return '' +
      '<section class="question-card value-form-card coherent-card bubblepop-card value-fusion-card">' +
        '<h2 class="question-title value-form-title">' +
          BP.Fraction.escapeHtml(question.prompt || 'Maak') + ' <span class="value-form-target">' + BP.Fraction.escapeHtml(question.targetLabel || '') + '</span>' +
        '</h2>' +
        '<div class="value-fusion-arena value-bubble-field" data-value-fusion-arena>' +
          '<div class="value-target-zone value-field-target">' +
            '<button class="value-target-bubble" type="button" data-value-target aria-label="doelbubble ' + BP.Fraction.escapeHtml(question.targetLabel || '') + '">' +
              '<span class="choice-bubble-shine"></span>' +
              '<span class="value-target-label">' + BP.Fraction.escapeHtml(question.targetLabel || '') + '</span>' +
            '</button>' +
          '</div>' +
          '<div class="value-fusion-pool value-field-pool" data-value-fusion-pool>' + question.choices.map(function (choice, index) {
            return '' +
              '<div class="value-fusion-slot" data-value-slot="' + index + '">' +
                '<button class="value-choice-bubble value-fusion-piece" data-choice-index="' + index + '" aria-label="' + BP.Fraction.escapeHtml(choice.numerator + '/' + choice.denominator) + '">' +
                  '<span class="choice-bubble-shine"></span>' +
                  '<span class="choice-bubble-content">' + BP.Fraction.html(choice.numerator, choice.denominator) + '</span>' +
                '</button>' +
              '</div>';
          }).join('') + '</div>' +
          '<div class="value-fusion-note" data-value-note>Sleep de juiste breukbubble naar het doel.</div>' +
        '</div>' +
      '</section>' +
      '<div class="feedback" data-value-feedback></div>';
  }

  function mount(container, onAnswer, question, roundState, context) {
    var target = container.querySelector('[data-value-target]');
    var pool = container.querySelector('[data-value-fusion-pool]');
    var feedback = container.querySelector('[data-value-feedback]');
    var note = container.querySelector('[data-value-note]');
    var undoButton = context && context.root ? context.root.querySelector('[data-action="undo"]') : null;
    var selectedIndex = null;
    var locked = false;
    var lastWrongKey = null;

    setUndoState();

    if (undoButton) {
      undoButton.addEventListener('click', function () {
        if (locked) return;
        selectedIndex = null;
        lastWrongKey = null;
        clearStates();
        setFeedback('', 'Zet ongedaan. Sleep opnieuw.');
        if (note) note.textContent = 'Sleep de juiste breukbubble naar het doel.';
        setUndoState();
      });
    }

    container.querySelectorAll('[data-choice-index]').forEach(function (button) {
      var index = Number(button.getAttribute('data-choice-index'));
      button.addEventListener('click', function () {
        if (locked) return;
        handleTapChoice(index);
      });
      button.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          if (!locked) handleTapChoice(index);
        }
      });
      installPointerDrag(button, index, 'choice');
    });

    if (target) {
      target.addEventListener('click', function () {
        if (locked) return;
        if (selectedIndex === null) {
          target.classList.add('armed');
          setFeedback('', 'Sleep of kies nu de breukbubble die erbij hoort.');
          if (note) note.textContent = 'Kies een breukbubble met dezelfde waarde.';
          return;
        }
        evaluateChoice(selectedIndex);
      });
      target.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          if (selectedIndex !== null) evaluateChoice(selectedIndex);
        }
      });
      installPointerDrag(target, -1, 'target');
    }

    function handleTapChoice(index) {
      if (locked) return;
      selectedIndex = index;
      clearChoiceArmed();
      var button = container.querySelector('[data-choice-index="' + index + '"]');
      if (button) button.classList.add('armed');
      if (target) target.classList.add('armed');
      setFeedback('', 'Tik de doelbubble, of sleep deze bubble erin.');
      if (note) note.textContent = 'Laat de twee bubbles versmelten.';
      setUndoState();
    }

    function installPointerDrag(button, value, kind) {
      var drag = null;

      button.addEventListener('pointerdown', function (event) {
        if (locked) return;
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
          button.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(1.08)';
          button.style.zIndex = 50;
        }
      });

      button.addEventListener('pointerup', function (event) {
        if (!drag || drag.pointerId !== event.pointerId) return;
        var wasMoved = drag.moved;
        drag = null;
        button.classList.remove('dragging');
        resetDragStyle(button);
        if (!wasMoved) return;

        if (kind === 'choice') {
          if (isPointInsideTarget(event.clientX, event.clientY)) {
            evaluateChoice(value);
          } else {
            setFeedback('', 'Sleep de breukbubble op het doel.');
          }
          return;
        }

        var choiceButton = findChoiceButtonAt(event.clientX, event.clientY);
        if (choiceButton) {
          evaluateChoice(Number(choiceButton.getAttribute('data-choice-index')));
        } else {
          setFeedback('', 'Laat de doelbubble los boven een breukbubble.');
        }
      });

      button.addEventListener('pointercancel', function () {
        drag = null;
        button.classList.remove('dragging');
        resetDragStyle(button);
      });
    }

    function evaluateChoice(index) {
      if (locked) return;
      var choice = question.choices[index];
      if (!choice) return;
      clearStates();
      var choiceButton = container.querySelector('[data-choice-index="' + index + '"]');
      if (choice.correct) {
        locked = true;
        if (choiceButton) choiceButton.classList.add('correct', 'popping');
        if (target) target.classList.add('correct', 'popping');
        setFeedback('good', 'Plop!');
        if (note) note.textContent = 'Zelfde waarde.';
        setUndoState();
        window.setTimeout(function () {
          onAnswer(index);
        }, 360);
        return;
      }

      var wrongKey = index + '-' + (choice.numerator || 0) + '/' + (choice.denominator || 1);
      if (choiceButton) choiceButton.classList.add('wrong');
      if (target) target.classList.add('wrong');
      setFeedback('bad', 'Nog niet dezelfde waarde.');
      if (note) note.textContent = 'Gebruik ↶ of probeer een andere bubble.';
      if (context && typeof context.recordMistake === 'function' && wrongKey !== lastWrongKey) {
        context.recordMistake({ choiceIndex: index, targetLabel: question.targetLabel });
        lastWrongKey = wrongKey;
      }
      selectedIndex = index;
      setUndoState();
    }

    function isPointInsideTarget(x, y) {
      if (!target) return false;
      var rect = target.getBoundingClientRect();
      return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    }

    function findChoiceButtonAt(x, y) {
      var buttons = Array.prototype.slice.call(container.querySelectorAll('[data-choice-index]'));
      return buttons.find(function (button) {
        var rect = button.getBoundingClientRect();
        return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
      }) || null;
    }

    function clearStates() {
      if (target) target.classList.remove('armed', 'wrong', 'correct', 'popping');
      container.querySelectorAll('[data-choice-index]').forEach(function (button) {
        button.classList.remove('armed', 'wrong', 'correct', 'popping');
      });
    }

    function clearChoiceArmed() {
      container.querySelectorAll('[data-choice-index]').forEach(function (button) {
        button.classList.remove('armed', 'wrong', 'correct', 'popping');
      });
      if (target) target.classList.remove('wrong', 'correct', 'popping');
    }

    function setUndoState() {
      if (undoButton) undoButton.disabled = locked || selectedIndex === null;
    }

    function setFeedback(className, text) {
      if (!feedback) return;
      feedback.className = 'feedback ' + className;
      feedback.textContent = text;
    }
  }

  function resetDragStyle(button) {
    button.style.transform = '';
    button.style.zIndex = '';
  }
})();
