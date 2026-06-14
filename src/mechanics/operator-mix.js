(function () {
  window.BP = window.BP || {};
  BP.Mechanics = BP.Mechanics || {};

  BP.Mechanics["operator-mix"] = {
    render: render,
    mount: mount,
    supportsUndo: true,
    selfManagedFeedback: true
  };

  function render(question) {
    var target = question.target;
    return '' +
      '<section class="question-card fusion-card operator-mix-card add-card">' +
        '<h2 class="question-title fusion-title">' + BP.Fraction.escapeHtml(question.prompt || 'Maak') + ' ' + BP.Fraction.html(target.numerator, target.denominator) + '</h2>' +
        '<div class="fusion-arena operator-mix-arena" data-operator-mix-arena>' +
          '<div class="fusion-pool operator-mix-pool" data-operator-mix-pool></div>' +
          '<div class="fusion-conversion-note operator-mix-note" data-operator-mix-note></div>' +
        '</div>' +
        '<p class="fusion-instruction">Kies slim: versmelt twee breukbubbles, of sleep een operatorbubble op een breukbubble.</p>' +
      '</section>' +
      '<div class="feedback" data-operator-mix-feedback></div>';
  }

  function mount(container, onAnswer, question, roundState, context) {
    var pool = container.querySelector('[data-operator-mix-pool]');
    var feedback = container.querySelector('[data-operator-mix-feedback]');
    var note = container.querySelector('[data-operator-mix-note]');
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
        if (!piece) return '<div class="fusion-slot empty" data-operator-mix-slot="' + slotIndex + '"></div>';
        return '<div class="fusion-slot" data-operator-mix-slot="' + slotIndex + '">' + renderPiece(piece) + '</div>';
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
      var css = isOperator ? (' operator-mix-operator-piece operator-' + piece.operator) : ' operator-mix-fraction-piece';
      var label = isOperator ? operatorLabel(piece) : BP.Fraction.html(piece.numerator, piece.denominator);
      var aria = isOperator ? operatorAria(piece) : (piece.numerator + ' op ' + piece.denominator);
      return '' +
        '<button class="fusion-piece operator-mix-piece' + css + '" data-piece-id="' + BP.Fraction.escapeHtml(piece.id) + '" aria-label="' + BP.Fraction.escapeHtml(aria) + '">' +
          BP.Bubble.skinImage(null, '', isOperator ? 'operator' : 'normal') +
          '<span class="operator-mix-piece-label">' + label + '</span>' +
        '</button>';
    }

    function handleTap(id) {
      if (solved || recentlyDragged) return;
      if (!selectedId) {
        selectedId = id;
        setFeedback('', 'Kies nu een tweede bubble.');
        renderPool();
        return;
      }
      if (selectedId === id) {
        selectedId = null;
        setFeedback('', 'Selectie gewist. Kies twee verschillende bubbles.');
        renderPool();
        return;
      }
      applyPair(selectedId, id);
    }

    function installPointerDrag(button, id) {
      BP.Bubble.installDrag(button, id, {
        disabled: function () { return solved; },
        container: pool,
        onDrop: function (sourceId, targetId) {
          markRecentlyDragged();
          applyPair(sourceId, targetId);
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

    function applyPair(idA, idB) {
      if (solved || idA === idB) return;
      var indexA = findPieceIndex(idA);
      var indexB = findPieceIndex(idB);
      if (indexA < 0 || indexB < 0) return;
      var a = pieces[indexA];
      var b = pieces[indexB];
      if (!a || !b) return;

      var action = calculateAction(a, b);
      if (!action.ok) {
        selectedId = null;
        setFeedback('bad', action.message || 'Die combinatie kan hier niet.');
        recordMistake({ reason: action.reason || 'invalid-pair' });
        renderPool();
        return;
      }

      history.push(BP.Bubble.clonePieces(pieces));
      var result = {
        id: 'om' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
        kind: 'fraction',
        numerator: action.result.numerator,
        denominator: action.result.denominator,
        from: [idA, idB]
      };

      // Stable board: operator actions leave the result where the fraction was;
      // two-fraction fusion leaves the result where the second dragged-on bubble was.
      pieces[action.consumeIndex] = null;
      pieces[action.resultIndex] = result;
      selectedId = null;
      renderPool();
      pulseNewPiece(result.id);
      showNote(action, result);
      evaluateNewPiece(result, action);
    }

    function calculateAction(a, b) {
      var indexA = findPieceIndex(a.id);
      var indexB = findPieceIndex(b.id);
      var aIsOp = a.kind === 'operator';
      var bIsOp = b.kind === 'operator';
      var aIsFraction = !aIsOp;
      var bIsFraction = !bIsOp;

      if (aIsFraction && bIsFraction) {
        var sum = addFractions(a, b);
        return {
          ok: true,
          type: 'add',
          left: a,
          right: b,
          result: sum.result,
          changed: sum.changed,
          consumeIndex: indexA,
          resultIndex: indexB
        };
      }

      if (aIsOp && bIsOp) {
        return { ok: false, reason: 'two-operators', message: 'Gebruik een operatorbubble samen met een breukbubble.' };
      }

      var operator = aIsOp ? a : b;
      var fraction = aIsFraction ? a : b;
      var operatorIndex = aIsOp ? indexA : indexB;
      var fractionIndex = aIsFraction ? indexA : indexB;
      var result = applyOperator(operator, fraction);
      if (!result.ok) return result;
      return {
        ok: true,
        type: operator.operator,
        operator: operator,
        fraction: fraction,
        result: result.result,
        changed: result.changed,
        consumeIndex: operatorIndex,
        resultIndex: fractionIndex
      };
    }

    function applyOperator(operator, fraction) {
      var result;
      if (operator.operator === 'subtract') {
        result = subtractFractions(fraction, operator.value);
        if (result.numerator < 0) {
          return { ok: false, reason: 'negative-result', message: 'Dat gaat onder nul. Kies een andere bubble.' };
        }
        return { ok: true, result: result, changed: Number(fraction.denominator) !== Number(operator.value.denominator) };
      }
      if (operator.operator === 'multiply') {
        result = BP.Fraction.simplify(
          Number(fraction.numerator) * factorNumerator(operator.factor),
          Number(fraction.denominator) * factorDenominator(operator.factor)
        );
        return { ok: true, result: result, changed: true };
      }
      if (operator.operator === 'divide') {
        var num = divisorNumerator(operator.divisor);
        var den = divisorDenominator(operator.divisor);
        if (!num) return { ok: false, reason: 'zero-divisor', message: 'Delen door nul kan niet.' };
        result = BP.Fraction.simplify(
          Number(fraction.numerator) * den,
          Number(fraction.denominator) * num
        );
        return { ok: true, result: result, changed: true };
      }
      return { ok: false, reason: 'unknown-operator', message: 'Deze operator ken ik nog niet.' };
    }

    function evaluateNewPiece(piece, action) {
      var target = question.target;
      if (BP.Fraction.equals(piece, target)) {
        solved = true;
        setFeedback('good', 'Plop!');
        if (undoButton) undoButton.disabled = true;
        window.setTimeout(function () { onAnswer({ fraction: piece, action: action.type }); }, 360);
        return;
      }
      setFeedback('bad', 'Nog niet de doelbreuk. Gebruik ↶ of probeer verder.');
      recordMistake({ fraction: piece, target: target, action: action.type, reason: 'wrong-result' });
    }

    function undoLastMove() {
      if (solved || !history.length) return;
      pieces = history.pop();
      selectedId = null;
      renderPool();
      clearNote();
      setFeedback('', 'Zet ongedaan. Kies een andere actie.');
    }

    function showNote(action, result) {
      if (!note) return;
      note.className = 'fusion-conversion-note operator-mix-note visible';
      if (action.type === 'add') {
        note.innerHTML = fractionHtml(action.left) + '<span class="fusion-plus">+</span>' + fractionHtml(action.right) + '<span class="fusion-arrow">→</span>' + fractionHtml(result);
        return;
      }
      note.innerHTML = fractionHtml(action.fraction) + '<span class="operator-mix-symbol">' + operatorLabel(action.operator) + '</span><span class="fusion-arrow">→</span>' + fractionHtml(result);
    }

    function clearNote() {
      if (!note) return;
      note.textContent = '';
      note.className = 'fusion-conversion-note operator-mix-note';
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

  function operatorLabel(piece) {
    if (piece.operator === 'subtract') return '<span class="operator-inline-label subtract-inline-label"><span class="operator-symbol minus-inline">−</span>' + BP.Fraction.html(piece.value.numerator, piece.value.denominator) + '</span>';
    if (piece.operator === 'multiply') return '<span class="operator-inline-label multiply-inline-label"><span class="operator-symbol multiply-times">×</span>' + factorHtml(piece.factor) + '</span>';
    if (piece.operator === 'divide') return '<span class="operator-inline-label divide-inline-label"><span class="operator-symbol divide-symbol">:</span>' + factorHtml(piece.divisor) + '</span>';
    return '?';
  }

  function operatorAria(piece) {
    if (piece.operator === 'subtract') return 'min ' + piece.value.numerator + ' op ' + piece.value.denominator;
    if (piece.operator === 'multiply') return 'maal ' + factorText(piece.factor);
    if (piece.operator === 'divide') return 'gedeeld door ' + factorText(piece.divisor);
    return 'operator';
  }

  function factorHtml(value) {
    if (value && typeof value === 'object') return BP.Fraction.html(value.numerator, value.denominator);
    return '<span class="operator-number">' + BP.Fraction.escapeHtml(value) + '</span>';
  }

  function factorText(value) {
    if (value && typeof value === 'object') return value.numerator + '/' + value.denominator;
    return String(value);
  }

  function fractionHtml(piece) {
    return BP.Fraction.html(piece.numerator, piece.denominator);
  }

  function addFractions(a, b) {
    var common = lcm(Number(a.denominator), Number(b.denominator));
    var left = Number(a.numerator) * (common / Number(a.denominator));
    var right = Number(b.numerator) * (common / Number(b.denominator));
    return {
      result: BP.Fraction.simplify(left + right, common),
      changed: Number(a.denominator) !== Number(b.denominator)
    };
  }

  function subtractFractions(a, b) {
    var common = lcm(Number(a.denominator), Number(b.denominator));
    var left = Number(a.numerator) * (common / Number(a.denominator));
    var right = Number(b.numerator) * (common / Number(b.denominator));
    return BP.Fraction.simplify(left - right, common);
  }

  function factorNumerator(factor) {
    if (factor && typeof factor === 'object') return Number(factor.numerator || 0);
    return Number(factor || 0);
  }

  function factorDenominator(factor) {
    if (factor && typeof factor === 'object') return Number(factor.denominator || 1);
    return 1;
  }

  function divisorNumerator(divisor) {
    if (divisor && typeof divisor === 'object') return Number(divisor.numerator || 0);
    return Number(divisor || 0);
  }

  function divisorDenominator(divisor) {
    if (divisor && typeof divisor === 'object') return Number(divisor.denominator || 1);
    return 1;
  }

  function lcm(a, b) {
    if (!a || !b) return 1;
    return Math.abs(a * b) / gcd(Math.abs(a), Math.abs(b));
  }

  function gcd(a, b) {
    while (b) {
      var temp = b;
      b = a % b;
      a = temp;
    }
    return a || 1;
  }
})();
