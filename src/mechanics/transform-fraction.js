(function () {
  window.BP = window.BP || {};
  BP.Mechanics = BP.Mechanics || {};

  BP.Mechanics["transform-fraction"] = {
    render: render,
    mount: mount,
    supportsUndo: true,
    selfManagedFeedback: true
  };

  function render(question) {
    return '' +
      '<section class="question-card transform-card">' +
        '<h2 class="question-title fusion-title">' + BP.Fraction.escapeHtml(question.prompt || 'Maak') + ' ' + BP.Fraction.html(question.target.numerator, question.target.denominator) + '</h2>' +
        '<div class="transform-arena" data-transform-arena>' +
          '<div class="transform-main-zone" data-transform-main-zone></div>' +
          '<div class="transform-operator-pool" data-transform-operator-pool></div>' +
        '</div>' +
        '<p class="fusion-instruction">Kies hoe fijn je de bubble splitst. De waarde blijft hetzelfde.</p>' +
      '</section>' +
      '<div class="feedback" data-transform-feedback></div>';
  }

  function mount(container, onAnswer, question, roundState, context) {
    var mainZone = container.querySelector('[data-transform-main-zone]');
    var pool = container.querySelector('[data-transform-operator-pool]');
    var feedback = container.querySelector('[data-transform-feedback]');
    var undoButton = context && context.root ? context.root.querySelector('[data-action="undo"]') : null;

    var current = cloneFraction(question.start);
    var operators = cloneOperators(question.operators || []);
    var history = [];
    var solved = false;
    var lastMistakeKey = null;
    var recentlyDragged = false;

    renderAll();
    setUndoState();

    if (undoButton) {
      undoButton.addEventListener('click', undoLastMove);
    }

    function renderAll() {
      renderCurrentBubble();
      renderOperators();
      setUndoState();
    }

    function renderCurrentBubble() {
      mainZone.innerHTML = '' +
        '<div class="transform-current-wrap">' +
          '<div class="transform-current-bubble" data-current-bubble>' +
            BP.AssetManager.image("bubble.blue.idle", "") +
            BP.Fraction.html(current.numerator, current.denominator) +
          '</div>' +
        '</div>';
    }

    function renderOperators() {
      pool.innerHTML = operators.map(function (operator, slotIndex) {
        return '' +
          '<div class="fusion-slot transform-slot" data-transform-slot="' + slotIndex + '">' +
            '<button class="fusion-piece transform-operator" data-operator-id="' + BP.Fraction.escapeHtml(operator.id) + '" aria-label="split in ' + operator.factor + '">' +
              BP.AssetManager.image("bubble.blue.idle", "") +
              '<span class="split-badge">×' + BP.Fraction.escapeHtml(operator.factor) + '</span>' +
              '<span class="operator-label">split</span>' +
            '</button>' +
          '</div>';
      }).join('');

      pool.querySelectorAll('[data-operator-id]').forEach(function (button) {
        var id = button.getAttribute('data-operator-id');
        button.addEventListener('click', function () { handleTap(id); });
        installPointerDrag(button, id);
      });
    }

    function handleTap(id) {
      if (solved || recentlyDragged) return;
      applyOperator(id);
    }

    function installPointerDrag(button, id) {
      var drag = null;

      button.addEventListener('pointerdown', function (event) {
        if (solved) return;
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
          button.style.zIndex = 30;
        }
      });

      button.addEventListener('pointerup', function (event) {
        if (!drag || drag.pointerId !== event.pointerId) return;
        var wasMoved = drag.moved;
        drag = null;
        button.classList.remove('dragging');
        resetDragStyle(button);

        if (!wasMoved) return;
        recentlyDragged = true;
        window.setTimeout(function () { recentlyDragged = false; }, 180);

        if (isPointInMainZone(event.clientX, event.clientY)) {
          applyOperator(id);
        } else {
          setFeedback('', 'Laat de split-bubble los boven de gewone bubble.');
        }
      });

      button.addEventListener('pointercancel', function () {
        drag = null;
        button.classList.remove('dragging');
        resetDragStyle(button);
      });
    }

    function applyOperator(id) {
      if (solved) return;
      var operator = operators.find(function (item) { return item.id === id; });
      if (!operator) return;

      var next = {
        numerator: Number(current.numerator) * Number(operator.factor),
        denominator: Number(current.denominator) * Number(operator.factor)
      };

      history.push(cloneFraction(current));
      current = next;
      renderAll();
      pulseCurrentBubble();
      evaluateCurrent(operator);
    }

    function evaluateCurrent(operator) {
      var target = question.target;
      if (isExact(current, target)) {
        solved = true;
        setFeedback('good', 'Plop! Dezelfde waarde, juiste stukjes.');
        if (undoButton) undoButton.disabled = true;
        window.setTimeout(function () {
          onAnswer({ fraction: current });
        }, 360);
        return;
      }

      if (BP.Fraction.equals(current, target)) {
        setFeedback('bad', 'Zelfde waarde, maar niet de gevraagde stukjes. Tik ↶.');
        recordMistake(operator);
        return;
      }

      setFeedback('bad', 'Nog niet. Tik ↶ en kies een andere split-bubble.');
      recordMistake(operator);
    }

    function undoLastMove() {
      if (solved || !history.length) return;
      current = history.pop();
      renderAll();
      setFeedback('', 'Zet ongedaan. Probeer een andere split-bubble.');
    }

    function isPointInMainZone(x, y) {
      var rect = mainZone.getBoundingClientRect();
      return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    }

    function pulseCurrentBubble() {
      var bubble = mainZone.querySelector('[data-current-bubble]');
      if (!bubble) return;
      bubble.classList.add('just-transformed');
      window.setTimeout(function () { bubble.classList.remove('just-transformed'); }, 420);
    }

    function setFeedback(className, text) {
      if (!feedback) return;
      feedback.className = 'feedback ' + className;
      feedback.textContent = text;
    }

    function setUndoState() {
      if (undoButton) undoButton.disabled = !history.length || solved;
    }

    function recordMistake(operator) {
      var key = operator ? 'x' + operator.factor + '-' + current.numerator + '/' + current.denominator : 'mistake';
      if (key === lastMistakeKey) return;
      lastMistakeKey = key;
      if (context && typeof context.recordMistake === 'function') {
        context.recordMistake({ factor: operator && operator.factor, fraction: current });
      }
    }
  }

  function cloneFraction(fraction) {
    return {
      numerator: Number(fraction && fraction.numerator),
      denominator: Number(fraction && fraction.denominator)
    };
  }

  function cloneOperators(list) {
    return JSON.parse(JSON.stringify(list || []));
  }

  function resetDragStyle(button) {
    button.style.transform = '';
    button.style.zIndex = '';
  }

  function isExact(a, b) {
    return !!a && !!b && Number(a.numerator) === Number(b.numerator) && Number(a.denominator) === Number(b.denominator);
  }
})();
