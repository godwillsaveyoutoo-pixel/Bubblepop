(function () {
  window.BP = window.BP || {};
  BP.Mechanics = BP.Mechanics || {};

  BP.Mechanics["number-line-place"] = {
    render: render,
    mount: mount,
    selfManagedFeedback: true
  };

  function render(question, roundState) {
    var target = question.target;
    var feedbackClass = "";
    var feedbackText = "Sleep of tik op de breukenlijn.";
    if (roundState.lastAnswer) {
      feedbackClass = roundState.lastAnswer.correct ? "good" : "bad";
      feedbackText = roundState.lastAnswer.correct ? "Plop! Op de juiste plaats." : "Nog niet. Kijk naar 0 en 1.";
    }

    return '' +
      '<section class="question-card number-line-card coherent-card bubblepop-card">' +
        '<h2 class="question-title line-title">' + BP.Fraction.escapeHtml(question.prompt) + ' ' + BP.Fraction.html(target.numerator, target.denominator) + '</h2>' +
        '<div class="number-line-stage" data-line-stage>' +
          '<button class="line-fraction-bubble choice-bubble" type="button" data-line-bubble aria-label="sleep de breuk ' + BP.Fraction.escapeHtml(target.numerator + '/' + target.denominator) + '">' +
            '<span class="choice-bubble-shine"></span>' +
            '<span class="choice-bubble-content">' + BP.Fraction.html(target.numerator, target.denominator) + '</span>' +
          '</button>' +
          '<div class="number-line-track" data-line-track>' +
            ticksHtml(question) +
            '<span class="line-drop-marker" data-line-marker style="left:50%"></span>' +
          '</div>' +
          '<div class="number-line-labels"><span>0</span><span>1</span></div>' +
        '</div>' +
        '<p class="mechanic-note" data-line-note>Sleep de bubble naar haar plaats tussen 0 en 1.</p>' +
      '</section>' +
      '<div class="feedback ' + feedbackClass + '" data-line-feedback>' + feedbackText + '</div>';
  }

  function ticksHtml(question) {
    var d = Number(question.tickDenominator || (question.target && question.target.denominator) || 1);
    var ticks = [];
    for (var i = 0; i <= d; i += 1) {
      var pct = d === 0 ? 0 : (i / d) * 100;
      var major = (i === 0 || i === d || (d % 2 === 0 && i === d / 2)) ? ' major' : '';
      ticks.push('<span class="line-tick' + major + '" style="left:' + pct + '%"></span>');
    }
    return ticks.join('');
  }

  function mount(container, onAnswer, question, roundState, helpers) {
    var stage = container.querySelector('[data-line-stage]');
    var track = container.querySelector('[data-line-track]');
    var marker = container.querySelector('[data-line-marker]');
    var bubble = container.querySelector('[data-line-bubble]');
    var feedback = container.querySelector('[data-line-feedback]');
    var note = container.querySelector('[data-line-note]');
    var locked = false;
    var isDragging = false;
    var lastValue = 0.5;

    placeAt(0.5);

    bubble.addEventListener('pointerdown', startDrag);
    track.addEventListener('pointerdown', function (event) {
      if (locked) return;
      updateFromClientX(event.clientX);
      validateAttempt();
    });

    function startDrag(event) {
      if (locked) return;
      event.preventDefault();
      isDragging = true;
      bubble.classList.add('dragging-line-bubble');
      if (bubble.setPointerCapture) bubble.setPointerCapture(event.pointerId);
      updateFromClientX(event.clientX);
      bubble.addEventListener('pointermove', onMove);
      bubble.addEventListener('pointerup', onUp);
      bubble.addEventListener('pointercancel', onUp);
    }

    function onMove(event) {
      if (!isDragging || locked) return;
      updateFromClientX(event.clientX);
    }

    function onUp(event) {
      if (!isDragging) return;
      isDragging = false;
      bubble.classList.remove('dragging-line-bubble');
      bubble.removeEventListener('pointermove', onMove);
      bubble.removeEventListener('pointerup', onUp);
      bubble.removeEventListener('pointercancel', onUp);
      validateAttempt();
    }

    function updateFromClientX(clientX) {
      var rect = track.getBoundingClientRect();
      var value = (clientX - rect.left) / Math.max(1, rect.width);
      value = clamp(value, 0, 1);
      placeAt(value);
    }

    function placeAt(value) {
      lastValue = value;
      var pct = value * 100;
      marker.style.left = pct + '%';
      bubble.style.left = pct + '%';
      if (note) note.textContent = 'Gekozen plaats: ongeveer ' + Math.round(pct) + '% van de lijn.';
    }

    function validateAttempt() {
      if (locked) return;
      var targetValue = Number(question.target.numerator) / Number(question.target.denominator);
      var tolerance = Number(question.tolerance || 0.065);
      var correct = Math.abs(lastValue - targetValue) <= tolerance;
      if (correct) {
        locked = true;
        placeAt(targetValue);
        stage.classList.add('line-success', 'bubble-pop-success');
        bubble.classList.add('popping', 'correct');
        setFeedback('good', 'Plop! Juist op de lijn.');
        window.setTimeout(function () {
          onAnswer({
            type: 'number-line-position',
            position: targetValue,
            placed: lastValue,
            numerator: question.target.numerator,
            denominator: question.target.denominator
          });
        }, 180);
      } else {
        stage.classList.remove('line-wrong');
        void stage.offsetWidth;
        stage.classList.add('line-wrong');
        setFeedback('bad', hintText(lastValue, targetValue));
        if (helpers && typeof helpers.recordMistake === 'function') {
          helpers.recordMistake({ type: 'number-line-position', placed: lastValue });
        }
      }
    }

    function setFeedback(kind, text) {
      if (feedback) {
        feedback.className = 'feedback ' + kind;
        feedback.textContent = text;
      }
      if (note) note.textContent = text;
    }

    function hintText(placed, target) {
      if (placed < target) return 'Nog niet. Iets meer naar rechts.';
      return 'Nog niet. Iets meer naar links.';
    }
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }
})();
