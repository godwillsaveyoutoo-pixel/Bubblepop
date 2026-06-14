(function () {
  window.BP = window.BP || {};
  BP.Mechanics = BP.Mechanics || {};

  BP.Mechanics["quantity-fraction"] = {
    render: render,
    mount: mount,
    supportsUndo: true,
    selfManagedFeedback: true
  };

  function render(question) {
    var fraction = question.fraction || { numerator: 1, denominator: 2 };
    var quantity = Number(question.quantity || 0);
    var targetHtml = question.targetLabel
      ? '<span class="value-form-target plain-target-label">' + BP.Fraction.escapeHtml(question.targetLabel) + '</span>'
      : BP.Fraction.html(fraction.numerator, fraction.denominator);
    return '' +
      '<section class="question-card quantity-card coherent-card">' +
        '<h2 class="question-title quantity-title">' +
          BP.Fraction.escapeHtml(BP.I18n.text(question.prompt || 'Pak')) + ' ' + targetHtml +
          '<span class="quantity-of"> ' + BP.I18n.t('of') + ' ' + BP.Fraction.escapeHtml(quantity) + '</span>' +
        '</h2>' +
        '<button class="quantity-target-bubble" type="button" data-quantity-confirm aria-label="bevestig je gekozen bubbles">' +
          '<span class="quantity-target-main">' + BP.I18n.text('Plop!') + '</span>' +
        '</button>' +
        '<div class="quantity-stage loose-quantity-stage" data-quantity-stage>' +
          renderLooseBubbles(quantity) +
        '</div>' +
        '<p class="mechanic-note quantity-note" data-quantity-note>' + hintText(question) + '</p>' +
      '</section>' +
      '<div class="feedback" data-quantity-feedback></div>';
  }

  function renderLooseBubbles(quantity) {
    var html = [];
    for (var i = 0; i < quantity; i += 1) {
      html.push(
        '<button class="quantity-pearl" type="button" data-pearl-index="' + i + '" aria-label="bubble ' + (i + 1) + '">' +
          '<span class="quantity-pearl-shine" aria-hidden="true"></span>' +
        '</button>'
      );
    }
    return html.join('');
  }

  function mount(container, onAnswer, question, roundState, helpers) {
    var stage = container.querySelector('[data-quantity-stage]');
    var confirmButton = container.querySelector('[data-quantity-confirm]');
    var feedback = container.querySelector('[data-quantity-feedback]');
    var note = container.querySelector('[data-quantity-note]');
    var undoButton = helpers && helpers.root ? helpers.root.querySelector('[data-action="undo"]') : null;
    var selected = [];
    var locked = false;
    var targetCount = Number(question.targetCount || 0);
    var quantity = Number(question.quantity || 0);

    updateUndo();
    updateNote();

    stage.querySelectorAll('[data-pearl-index]').forEach(function (button) {
      button.addEventListener('click', function () {
        togglePearl(button);
      });
      button.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          togglePearl(button);
        }
      });
    });

    if (confirmButton) {
      confirmButton.addEventListener('click', confirmSelection);
      confirmButton.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          confirmSelection();
        }
      });
    }

    if (undoButton) {
      undoButton.addEventListener('click', function () {
        if (locked || !selected.length) return;
        var last = selected.pop();
        var button = stage.querySelector('[data-pearl-index="' + last + '"]');
        if (button) button.classList.remove('selected', 'just-selected');
        setFeedback('', BP.I18n.text('Zet ongedaan. Kies opnieuw.'));
        stage.classList.remove('quantity-too-many', 'quantity-too-few', 'quantity-success');
        if (confirmButton) confirmButton.classList.remove('quantity-target-wrong', 'quantity-target-ready');
        updateNote();
        updateUndo();
      });
    }

    function togglePearl(button) {
      if (locked) return;
      var index = Number(button.getAttribute('data-pearl-index'));
      var existing = selected.indexOf(index);
      if (existing >= 0) {
        selected.splice(existing, 1);
        button.classList.remove('selected', 'just-selected');
      } else {
        selected.push(index);
        button.classList.add('selected');
        button.classList.remove('just-selected');
        void button.offsetWidth;
        button.classList.add('just-selected');
      }
      setFeedback('', '');
      stage.classList.remove('quantity-too-many', 'quantity-too-few', 'quantity-success');
      if (confirmButton) confirmButton.classList.remove('quantity-target-wrong');
      updateNote();
      updateUndo();
    }

    function confirmSelection() {
      if (locked) return;
      var chosen = selected.length;
      if (chosen === targetCount) {
        locked = true;
        updateUndo();
        stage.classList.remove('quantity-too-many', 'quantity-too-few', 'quantity-success');
        void stage.offsetWidth;
        stage.classList.add('quantity-success');
        if (confirmButton) {
          confirmButton.classList.remove('quantity-target-wrong');
          confirmButton.classList.add('quantity-target-correct');
        }
        setFeedback('good', BP.I18n.text('Plop!'));
        window.setTimeout(function () {
          onAnswer({
            selectedCount: selected.length,
            targetCount: targetCount,
            quantity: quantity,
            selected: selected.slice()
          });
        }, 360);
        return;
      }

      if (helpers && typeof helpers.recordMistake === 'function') {
        helpers.recordMistake({
          selectedCount: chosen,
          targetCount: targetCount,
          quantity: quantity,
          reason: chosen < targetCount ? 'too-few' : 'too-many'
        });
      }

      stage.classList.remove('quantity-too-many', 'quantity-too-few');
      void stage.offsetWidth;
      stage.classList.add(chosen < targetCount ? 'quantity-too-few' : 'quantity-too-many');
      if (confirmButton) {
        confirmButton.classList.remove('quantity-target-ready');
        confirmButton.classList.add('quantity-target-wrong');
      }
      setFeedback('bad', chosen < targetCount ? BP.I18n.text('Nog te weinig.') : BP.I18n.text('Te veel. Tik terug of gebruik ↶.'));
      updateNote();
      updateUndo();
    }

    function updateNote() {
      if (!note) return;
      if (!selected.length) {
        note.textContent = BP.I18n.text('Pop hoeveel jij denkt. Tik daarna op de doelbubble.');
      } else {
        note.textContent = BP.I18n.text('Klaar? Tik op de grote doelbubble.');
      }
      if (confirmButton) confirmButton.classList.toggle('quantity-target-ready', selected.length > 0 && !locked);
    }

    function updateUndo() {
      if (undoButton) undoButton.disabled = locked || !selected.length;
    }

    function setFeedback(className, text) {
      if (!feedback) return;
      feedback.className = 'feedback ' + className;
      feedback.textContent = text;
    }
  }

  function hintText(question) {
    return BP.I18n.text('Pop losse bubbles. Tik daarna op de grote doelbubble.');
  }
})();
