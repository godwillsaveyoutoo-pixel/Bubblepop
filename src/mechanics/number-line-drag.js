(function () {
  window.BP = window.BP || {};
  BP.Mechanics = BP.Mechanics || {};

  BP.Mechanics["number-line-drag"] = {
    render: render,
    mount: mount,
    selfManagedFeedback: true
  };

  function render(question, roundState) {
    var isOrder = question.mode === "order";
    var isMulti = isOrder || question.mode === "multi" || Array.isArray(question.items);
    var feedbackClass = "";
    var feedbackText = isOrder ? "Sleep de bubbles van klein naar groot op de as." : (isMulti ? "Sleep elke bubble van boven naar haar plaats op de as." : "Sleep de bubble van boven naar de as.");
    if (roundState.lastAnswer) {
      feedbackClass = roundState.lastAnswer.correct ? "good" : "bad";
      feedbackText = roundState.lastAnswer.correct ? "Plop! Juist op de lijn." : "Nog niet. Probeer opnieuw.";
    }

    return '' +
      '<section class="question-card number-line-card coherent-card bubblepop-card drag-line-card ' + (isMulti ? 'multi-line-card' : 'single-line-card') + ' ' + (isOrder ? 'order-line-card' : '') + '">' +
        '<h2 class="question-title line-title">' + titleHtml(question, isMulti) + '</h2>' +
        '<div class="number-line-stage drag-line-stage ' + (isMulti ? 'multi-line-stage' : 'single-line-stage') + '" data-line-stage>' +
          '<div class="drag-line-bank" data-line-bank>' + draggableBubblesHtml(question, isMulti) + '</div>' +
          '<div class="number-line-track drag-line-track" data-line-track>' +
            ticksHtml(question) +
          '</div>' +
          '<div class="number-line-labels"><span>0</span><span>1</span></div>' +
        '</div>' +
        '<p class="mechanic-note" data-line-note>' + (isOrder ? 'De bubbles starten boven de as. Sleep ze in de juiste volgorde op de lijn.' : (isMulti ? 'De bubbles starten boven de as. Sleep ze op de juiste plek.' : 'De bubble start boven de as. Sleep ze op de juiste plek.')) + '</p>' +
      '</section>' +
      '<div class="feedback ' + feedbackClass + '" data-line-feedback>' + feedbackText + '</div>';
  }

  function titleHtml(question, isMulti) {
    if (isMulti) return BP.Fraction.escapeHtml(question.prompt || "Plaats de bubbles");
    var target = question.target;
    return BP.Fraction.escapeHtml(question.prompt || "Plaats") + ' ' + BP.Fraction.html(target.numerator, target.denominator);
  }

  function draggableBubblesHtml(question, isMulti) {
    var items = isMulti ? question.items : [{
      id: "single",
      numerator: question.target.numerator,
      denominator: question.target.denominator
    }];
    return items.map(function (item, index) {
      return '' +
        '<button class="line-drag-bubble choice-bubble" type="button" data-line-item="' + BP.Fraction.escapeHtml(item.id || ('item-' + index)) + '" data-item-index="' + index + '" aria-label="sleep ' + BP.Fraction.escapeHtml(item.numerator + '/' + item.denominator) + '">' +
          '<span class="choice-bubble-shine"></span>' +
          '<span class="choice-bubble-content">' + BP.Fraction.html(item.numerator, item.denominator) + '</span>' +
        '</button>';
    }).join('');
  }

  function ticksHtml(question) {
    var d = Number(question.tickDenominator || maxDenominator(question) || 1);
    var ticks = [];
    for (var i = 0; i <= d; i += 1) {
      var pct = d === 0 ? 0 : (i / d) * 100;
      var major = (i === 0 || i === d || (d % 2 === 0 && i === d / 2)) ? ' major' : '';
      ticks.push('<span class="line-tick' + major + '" style="left:' + pct + '%"></span>');
    }
    return ticks.join('');
  }

  function maxDenominator(question) {
    if (Array.isArray(question.items)) {
      return question.items.reduce(function (max, item) { return Math.max(max, Number(item.denominator) || 1); }, 1);
    }
    return question.target && question.target.denominator;
  }

  function mount(container, onAnswer, question, roundState, helpers) {
    var stage = container.querySelector('[data-line-stage]');
    var bank = container.querySelector('[data-line-bank]');
    var track = container.querySelector('[data-line-track]');
    var feedback = container.querySelector('[data-line-feedback]');
    var note = container.querySelector('[data-line-note]');
    var isOrder = question.mode === "order";
    var isMulti = isOrder || question.mode === "multi" || Array.isArray(question.items);
    var items = isMulti ? question.items : [{
      id: "single",
      numerator: question.target.numerator,
      denominator: question.target.denominator
    }];
    var placed = {};
    var locked = false;

    var bubbles = Array.prototype.slice.call(container.querySelectorAll('[data-line-item]'));
    bubbles.forEach(function (bubble, index) {
      bubble.addEventListener('pointerdown', function (event) {
        if (locked || placed[itemKey(items[index], index)]) return;
        startDrag(event, bubble, items[index], index);
      });
    });

    function startDrag(event, bubble, item, index) {
      event.preventDefault();
      var key = itemKey(item, index);
      bubble.classList.add('dragging-line-bubble');
      bubble.setAttribute('aria-grabbed', 'true');
      moveBubbleToStage(bubble, event.clientX, event.clientY);
      if (bubble.setPointerCapture) bubble.setPointerCapture(event.pointerId);

      function onMove(moveEvent) {
        if (locked) return;
        moveBubbleToStage(bubble, moveEvent.clientX, moveEvent.clientY);
      }

      function onUp(upEvent) {
        bubble.classList.remove('dragging-line-bubble');
        bubble.removeEventListener('pointermove', onMove);
        bubble.removeEventListener('pointerup', onUp);
        bubble.removeEventListener('pointercancel', onUp);
        bubble.setAttribute('aria-grabbed', 'false');
        validateDrop(bubble, item, index, key, upEvent.clientX, upEvent.clientY);
      }

      bubble.addEventListener('pointermove', onMove);
      bubble.addEventListener('pointerup', onUp);
      bubble.addEventListener('pointercancel', onUp);
    }

    function validateDrop(bubble, item, index, key, clientX, clientY) {
      if (locked) return;
      var targetValue = Number(item.numerator) / Number(item.denominator);
      var placedValue = xToLineValue(clientX);
      var lineDistance = distanceToLine(clientY);
      var tolerance = Number(question.tolerance || (isMulti ? 0.055 : 0.065));
      var verticalTolerance = Number(question.verticalTolerance || (isMulti ? 58 : 68));
      var closeToLine = Number.isFinite(lineDistance) && lineDistance <= verticalTolerance;
      var correct = isOrder
        ? (closeToLine && Number.isFinite(placedValue))
        : (closeToLine && Number.isFinite(placedValue) && Math.abs(placedValue - targetValue) <= tolerance);

      if (correct) {
        placed[key] = {
          id: item.id || key,
          numerator: item.numerator,
          denominator: item.denominator,
          placed: isOrder ? placedValue : targetValue
        };
        snapToLine(bubble, isOrder ? placedValue : targetValue);
        bubble.classList.add('correct', 'popped');
        bubble.disabled = true;
        setFeedback('good', isOrder ? 'Plop! Nu de volgende bubble.' : (isMulti ? 'Plop! Die bubble ligt juist.' : 'Plop! Juist op de lijn.'));
        if (!isMulti || Object.keys(placed).length === items.length) {
          locked = true;
          stage.classList.add('line-success', 'bubble-pop-success');
          window.setTimeout(function () {
            onAnswer(answerPayload(isMulti, placed, items, isOrder));
          }, 220);
        }
      } else {
        bubble.classList.add('wrong');
        stage.classList.remove('line-wrong');
        void stage.offsetWidth;
        stage.classList.add('line-wrong');
        setFeedback('bad', closeToLine ? hintText(placedValue, targetValue) : 'Laat de bubble op de as los.');
        if (helpers && typeof helpers.recordMistake === 'function') {
          helpers.recordMistake({ type: isOrder ? 'number-line-order' : (isMulti ? 'number-line-multi' : 'number-line-position'), placed: placedValue });
        }
        window.setTimeout(function () {
          bubble.classList.remove('wrong');
          returnToBank(bubble);
        }, 360);
      }
    }

    function answerPayload(isMultiAnswer, placedMap, expectedItems, isOrderAnswer) {
      if (!isMultiAnswer) {
        var only = placed[Object.keys(placed)[0]];
        return {
          type: 'number-line-position',
          position: only.placed,
          placed: only.placed,
          numerator: only.numerator,
          denominator: only.denominator
        };
      }
      return {
        type: isOrderAnswer ? 'number-line-order' : 'number-line-multi',
        positions: expectedItems.map(function (item, index) {
          return placedMap[itemKey(item, index)];
        })
      };
    }

    function moveBubbleToStage(bubble, clientX, clientY) {
      ensureAbsoluteInStage(bubble);
      var stageRect = stage.getBoundingClientRect();
      var x = clamp(clientX - stageRect.left, 42, stageRect.width - 42);
      var y = clamp(clientY - stageRect.top, 30, stageRect.height - 46);
      bubble.style.left = x + 'px';
      bubble.style.top = y + 'px';
      bubble.style.transform = 'translate(-50%, -50%) scale(1.05)';
      bubble.style.zIndex = 8;
    }

    function snapToLine(bubble, value) {
      ensureAbsoluteInStage(bubble);
      var stageRect = stage.getBoundingClientRect();
      var trackRect = track.getBoundingClientRect();
      var x = (trackRect.left - stageRect.left) + value * trackRect.width;
      var y = (trackRect.top - stageRect.top) + (trackRect.height / 2);
      var finalScale = isMulti ? 0.78 : 0.86;
      bubble.style.left = x + 'px';
      bubble.style.top = y + 'px';
      bubble.style.transform = 'translate(-50%, -50%) scale(' + finalScale + ')';
      bubble.style.zIndex = 6;
    }

    function returnToBank(bubble) {
      bubble.removeAttribute('style');
      bubble.classList.remove('correct', 'popped');
      if (bank && bubble.parentNode !== bank) bank.appendChild(bubble);
    }

    function ensureAbsoluteInStage(bubble) {
      if (bubble.parentNode !== stage) stage.appendChild(bubble);
      bubble.style.position = 'absolute';
    }

    function xToLineValue(clientX) {
      var rect = track.getBoundingClientRect();
      return clamp((clientX - rect.left) / Math.max(1, rect.width), 0, 1);
    }

    function distanceToLine(clientY) {
      var rect = track.getBoundingClientRect();
      var lineY = rect.top + rect.height / 2;
      return Math.abs(clientY - lineY);
    }

    function setFeedback(kind, text) {
      if (feedback) {
        feedback.className = 'feedback ' + kind;
        feedback.textContent = text;
      }
      if (note) note.textContent = text;
    }

    function hintText(placedValue, targetValue) {
      if (!Number.isFinite(placedValue)) return 'Sleep de bubble naar de lijn.';
      if (placedValue < targetValue) return 'Nog niet. Iets meer naar rechts.';
      return 'Nog niet. Iets meer naar links.';
    }
  }

  function itemKey(item, index) {
    return item.id || ('item-' + index + '-' + item.numerator + '-' + item.denominator);
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }
})();
