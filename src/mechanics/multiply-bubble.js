(function () {
  window.BP = window.BP || {};
  BP.Mechanics = BP.Mechanics || {};

  BP.Mechanics["multiply-bubble"] = {
    render: render,
    mount: mount,
    supportsUndo: true,
    selfManagedFeedback: true
  };

  function render(question) {
    var target = question.target;
    return '' +
      '<section class="question-card fusion-card multiply-card add-card">' +
        '<h2 class="question-title fusion-title">' + BP.Fraction.escapeHtml(question.prompt || 'Maak') + ' ' + BP.Fraction.html(target.numerator, target.denominator) + '</h2>' +
        '<div class="fusion-arena multiply-arena" data-multiply-arena>' +
          '<div class="fusion-pool multiply-pool" data-multiply-pool></div>' +
          '<div class="fusion-conversion-note multiply-note" data-multiply-note></div>' +
        '</div>' +
        '<p class="fusion-instruction">Sleep een maalbubble op een breukbubble. Tikken mag ook: kies twee bubbles.</p>' +
      '</section>' +
      '<div class="feedback" data-multiply-feedback></div>';
  }

  function mount(container, onAnswer, question, roundState, context) {
    var pool = container.querySelector('[data-multiply-pool]');
    var feedback = container.querySelector('[data-multiply-feedback]');
    var note = container.querySelector('[data-multiply-note]');
    var undoButton = context && context.root ? context.root.querySelector('[data-action="undo"]') : null;
    var pieces = BP.Bubble.clonePieces(question.pieces || []);
    var history = [];
    var selectedId = null;
    var solved = false;
    var recentlyDragged = false;

    renderPool();
    setUndoState();
    if (undoButton) undoButton.addEventListener('click', undoLastMove);

    function renderPool() {
      pool.innerHTML = pieces.map(function (piece, slotIndex) {
        if (!piece) return '<div class="fusion-slot empty" data-multiply-slot="' + slotIndex + '"></div>';
        return '<div class="fusion-slot" data-multiply-slot="' + slotIndex + '">' + renderPiece(piece) + '</div>';
      }).join('');

      pool.querySelectorAll('[data-piece-id]').forEach(function (button) {
        var id = button.getAttribute('data-piece-id');
        if (id === selectedId) button.classList.add('armed');
        button.addEventListener('click', function () { handleTap(id); });
        installPointerDrag(button, id);
      });
      setUndoState();
    }

    function renderPiece(piece) {
      var isOperator = piece.kind === 'operator';
      var label = isOperator ? operatorLabel(piece.factor) : BP.Fraction.html(piece.numerator, piece.denominator);
      var aria = isOperator ? ('maal ' + operatorText(piece.factor)) : (piece.numerator + ' op ' + piece.denominator);
      return '' +
        '<button class="fusion-piece multiply-piece' + (isOperator ? ' multiply-operator-piece' : ' multiply-fraction-piece') + '" data-piece-id="' + BP.Fraction.escapeHtml(piece.id) + '" aria-label="' + BP.Fraction.escapeHtml(aria) + '">' +
          BP.Bubble.skinImage(null, '', isOperator ? 'operator' : 'normal') +
          '<span class="multiply-piece-label">' + label + '</span>' +
        '</button>';
    }

    function handleTap(id) {
      if (solved || recentlyDragged) return;
      if (!selectedId) {
        selectedId = id;
        setFeedback('', 'Kies nu de bubble waarmee je wil versmelten.');
        renderPool();
        return;
      }
      if (selectedId === id) {
        selectedId = null;
        setFeedback('', 'Selectie gewist. Kies twee verschillende bubbles.');
        renderPool();
        return;
      }
      multiplyFuse(selectedId, id);
    }

    function installPointerDrag(button, id) {
      BP.Bubble.installDrag(button, id, {
        disabled: function () { return solved; },
        container: pool,
        onDrop: function (sourceId, targetId) {
          markRecentlyDragged();
          multiplyFuse(sourceId, targetId);
        },
        onMiss: function () {
          markRecentlyDragged();
          setFeedback('', 'Laat een bubble los boven een andere bubble.');
        }
      });
    }

    function markRecentlyDragged() {
      recentlyDragged = true;
      window.setTimeout(function () { recentlyDragged = false; }, 180);
    }

    function multiplyFuse(idA, idB) {
      if (solved || idA === idB) return;
      var indexA = findPieceIndex(idA);
      var indexB = findPieceIndex(idB);
      if (indexA < 0 || indexB < 0) return;
      var a = pieces[indexA];
      var b = pieces[indexB];
      if (!a || !b) return;
      var operator = a.kind === 'operator' ? a : (b.kind === 'operator' ? b : null);
      var fraction = a.kind === 'fraction' ? a : (b.kind === 'fraction' ? b : null);
      if (!operator || !fraction) {
        setFeedback('bad', 'Gebruik één maalbubble en één breukbubble.');
        recordMistake({ reason: 'invalid-pair' });
        selectedId = null;
        renderPool();
        return;
      }

      history.push(BP.Bubble.clonePieces(pieces));
      var result = {
        id: 'mf' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
        kind: 'fraction',
        numerator: Number(fraction.numerator) * factorNumerator(operator.factor),
        denominator: Number(fraction.denominator) * factorDenominator(operator.factor),
        from: [idA, idB]
      };

      // Stable board: the result appears where the fraction bubble was.
      var fractionIndex = fraction.id === a.id ? indexA : indexB;
      var operatorIndex = operator.id === a.id ? indexA : indexB;
      pieces[operatorIndex] = null;
      pieces[fractionIndex] = result;
      selectedId = null;
      renderPool();
      pulseNewPiece(result.id);
      showNote(fraction, operator, result);
      evaluateNewPiece(result);
    }

    function evaluateNewPiece(piece) {
      var target = question.target;
      if (BP.Fraction.equals(piece, target)) {
        solved = true;
        setFeedback('good', 'Plop!');
        if (undoButton) undoButton.disabled = true;
        window.setTimeout(function () { onAnswer({ fraction: piece }); }, 360);
        return;
      }
      setFeedback('bad', 'Nog niet de doelbreuk. Gebruik ↶ of probeer verder.');
      recordMistake({ fraction: piece, target: target, reason: 'wrong-product' });
    }

    function undoLastMove() {
      if (solved || !history.length) return;
      pieces = history.pop();
      selectedId = null;
      renderPool();
      clearNote();
      setFeedback('', 'Zet ongedaan. Probeer een andere maalbubble.');
    }

    function showNote(fraction, operator, result) {
      if (!note) return;
      note.className = 'fusion-conversion-note multiply-note visible';
      note.innerHTML = BP.Fraction.html(fraction.numerator, fraction.denominator) +
        '<span class="multiply-symbol">' + operatorLabel(operator.factor) + '</span>' +
        '<span class="fusion-arrow">→</span>' +
        BP.Fraction.html(result.numerator, result.denominator);
    }

    function clearNote() {
      if (!note) return;
      note.textContent = '';
      note.className = 'fusion-conversion-note multiply-note';
    }

    function findPieceIndex(id) {
      for (var i = 0; i < pieces.length; i += 1) {
        if (pieces[i] && pieces[i].id === id) return i;
      }
      return -1;
    }
function pulseNewPiece(id) {
      BP.Bubble.pulsePiece(pool, id);
    }

    function setFeedback(className, text) {
      BP.Bubble.setFeedback(feedback, className, text);
    }

    function setUndoState() {
      if (undoButton) undoButton.disabled = !history.length || solved;
    }

    function recordMistake(payload) {
      if (context && typeof context.recordMistake === 'function') context.recordMistake(payload || {});
    }
  }


  function factorNumerator(factor) {
    if (factor && typeof factor === 'object') return Number(factor.numerator || 0);
    return Number(factor || 0);
  }

  function factorDenominator(factor) {
    if (factor && typeof factor === 'object') return Number(factor.denominator || 1);
    return 1;
  }

  function operatorLabel(factor) {
    if (factor && typeof factor === 'object') {
      return '<span class="operator-inline-label multiply-inline-label"><span class="operator-symbol multiply-times">×</span>' + BP.Fraction.html(factor.numerator, factor.denominator) + '</span>';
    }
    return '<span class="operator-inline-label multiply-inline-label"><span class="operator-symbol multiply-times">×</span><span class="operator-number">' + BP.Fraction.escapeHtml(factor) + '</span></span>';
  }

  function operatorText(factor) {
    if (factor && typeof factor === 'object') return BP.Fraction.text(factor.numerator, factor.denominator);
    return String(factor);
  }
})();
