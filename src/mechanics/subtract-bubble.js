(function () {
  window.BP = window.BP || {};
  BP.Mechanics = BP.Mechanics || {};

  BP.Mechanics["subtract-bubble"] = {
    render: render,
    mount: mount,
    supportsUndo: true,
    selfManagedFeedback: true
  };

  function render(question) {
    return '' +
      '<section class="question-card subtract-card">' +
        '<h2 class="question-title fusion-title">' + BP.Fraction.escapeHtml(question.prompt || 'Maak') + ' ' + BP.Fraction.html(question.target.numerator, question.target.denominator) + '</h2>' +
        '<div class="subtract-arena" data-subtract-arena>' +
          '<div class="subtract-main-zone" data-main-zone></div>' +
          '<div class="subtract-remover-pool" data-remover-pool></div>' +
        '</div>' +
        '<div class="fusion-conversion-note subtract-conversion-note" data-subtract-conversion-note></div>' +
        '<p class="fusion-instruction" data-subtract-instruction>' + buildInstruction(question) + '</p>' +
      '</section>' +
      '<div class="feedback" data-subtract-feedback></div>';
  }

  function buildInstruction(question) {
    if (question && question.guidedConversion) {
      return 'Sleep een wegneembubble op de grote bubble. Als de stukjes anders zijn, maakt het spel ze kort gelijk.';
    }
    return 'Sleep een wegneembubble op de grote bubble. Tikken mag ook.';
  }

  function mount(container, onAnswer, question, roundState, context) {
    var mainZone = container.querySelector('[data-main-zone]');
    var pool = container.querySelector('[data-remover-pool]');
    var feedback = container.querySelector('[data-subtract-feedback]');
    var conversionNote = container.querySelector('[data-subtract-conversion-note]');
    var undoButton = context && context.root ? context.root.querySelector('[data-action="undo"]') : null;

    var current = cloneFraction(question.start);
    var removers = clonePieces(question.removers || []);
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
      renderMainBubble();
      renderRemovers();
      setUndoState();
    }

    function renderMainBubble() {
      mainZone.innerHTML = '' +
        '<div class="subtract-main-bubble" data-main-bubble>' +
          BP.AssetManager.image("bubble.blue.idle", "") +
          BP.Fraction.html(current.numerator, current.denominator) +
        '</div>';
    }

    function renderRemovers() {
      pool.innerHTML = removers.map(function (piece, slotIndex) {
        if (!piece) {
          return '<div class="fusion-slot subtract-slot empty" data-remover-slot="' + slotIndex + '"></div>';
        }
        return '' +
          '<div class="fusion-slot subtract-slot" data-remover-slot="' + slotIndex + '">' +
            '<button class="fusion-piece subtract-piece" data-remover-id="' + BP.Fraction.escapeHtml(piece.id) + '" aria-label="neem ' + piece.numerator + ' op ' + piece.denominator + ' weg">' +
              BP.AssetManager.image("bubble.blue.idle", "") +
              '<span class="operator-inline-label subtract-inline-label">' +
                '<span class="operator-symbol minus-inline">−</span>' +
                BP.Fraction.html(piece.numerator, piece.denominator) +
              '</span>' +
            '</button>' +
          '</div>';
      }).join('');

      pool.querySelectorAll('[data-remover-id]').forEach(function (button) {
        var id = button.getAttribute('data-remover-id');
        button.addEventListener('click', function () { handleTap(id); });
        installPointerDrag(button, id);
      });
    }

    function handleTap(id) {
      if (solved || recentlyDragged) return;
      applyRemover(id);
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
          applyRemover(id);
        } else {
          setFeedback('', 'Laat de wegneembubble los boven de grote bubble.');
        }
      });

      button.addEventListener('pointercancel', function () {
        drag = null;
        button.classList.remove('dragging');
        resetDragStyle(button);
      });
    }

    function applyRemover(id) {
      if (solved) return;
      var index = findRemoverIndex(id);
      if (index < 0) return;
      var remover = removers[index];
      if (!remover) return;

      var subtraction = subtractFractionsForQuestion(current, remover, question);
      if (!subtraction.ok) {
        setFeedback('bad', subtraction.message || 'Dat kan hier nog niet.');
        recordMistake(remover);
        return;
      }

      history.push({ current: cloneFraction(current), removers: clonePieces(removers) });
      current = subtraction.result;
      removers[index] = null;
      renderAll();
      pulseMainBubble();
      showConversion(subtraction);
      evaluateCurrent(remover);
    }

    function evaluateCurrent(remover) {
      var target = question.target;
      if (BP.Fraction.equals(current, target)) {
        solved = true;
        setFeedback('good', 'Plop! Je maakte de doelbreuk.');
        if (undoButton) undoButton.disabled = true;
        window.setTimeout(function () {
          onAnswer({ fraction: current });
        }, 360);
        return;
      }

      if (isLessThan(current, target)) {
        setFeedback('bad', 'Te klein. Tik ↶ om die wegneemactie terug te nemen.');
        recordMistake(remover || current);
        return;
      }

      setFeedback('', 'Nu heb je ' + current.numerator + '/' + current.denominator + '. Neem nog iets weg of gebruik ↶.');
    }

    function undoLastMove() {
      if (solved || !history.length) return;
      var previous = history.pop();
      current = previous.current;
      removers = previous.removers;
      renderAll();
      clearConversion();
      setFeedback('', 'Zet ongedaan. Probeer een andere wegneembubble.');
    }

    function isPointInMainZone(x, y) {
      var rect = mainZone.getBoundingClientRect();
      return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    }

    function findRemoverIndex(id) {
      for (var i = 0; i < removers.length; i += 1) {
        if (removers[i] && removers[i].id === id) return i;
      }
      return -1;
    }

    function pulseMainBubble() {
      var bubble = mainZone.querySelector('[data-main-bubble]');
      if (!bubble) return;
      bubble.classList.add('just-subtracted');
      window.setTimeout(function () { bubble.classList.remove('just-subtracted'); }, 420);
    }

    function showConversion(subtraction) {
      if (!conversionNote) return;
      if (!subtraction || !subtraction.converted) {
        clearConversion();
        return;
      }
      conversionNote.innerHTML = '' +
        '<span>Stukjes gelijk:</span>' +
        '<span class="fusion-arrow">−</span>' +
        BP.Fraction.html(subtraction.removerBefore.numerator, subtraction.removerBefore.denominator) +
        '<span class="fusion-arrow">→</span>' +
        BP.Fraction.html(subtraction.removerAfter.numerator, subtraction.removerAfter.denominator);
      conversionNote.classList.add('visible');
    }

    function clearConversion() {
      if (!conversionNote) return;
      conversionNote.classList.remove('visible');
      conversionNote.innerHTML = '';
    }

    function setFeedback(className, text) {
      if (!feedback) return;
      feedback.className = 'feedback ' + className;
      feedback.textContent = text;
    }

    function setUndoState() {
      if (undoButton) undoButton.disabled = !history.length || solved;
    }

    function recordMistake(piece) {
      var key = (piece ? piece.numerator + '/' + piece.denominator : 'mistake');
      if (key === lastMistakeKey) return;
      lastMistakeKey = key;
      if (context && typeof context.recordMistake === 'function') {
        context.recordMistake({ fraction: piece });
      }
    }
  }


  function subtractFractionsForQuestion(current, remover, question) {
    var currentFraction = cloneFraction(current);
    var removerFraction = cloneFraction(remover);

    if (!question || !question.guidedConversion) {
      if (Number(removerFraction.denominator) !== Number(currentFraction.denominator)) {
        return { ok: false, message: 'Nog niet: in deze level trek je alleen weg met dezelfde noemer.' };
      }
      var likeNumerator = Number(currentFraction.numerator) - Number(removerFraction.numerator);
      if (likeNumerator < 0) return { ok: false, message: 'Dat is te veel weggenomen.' };
      return {
        ok: true,
        converted: false,
        result: { numerator: likeNumerator, denominator: Number(currentFraction.denominator) }
      };
    }

    var commonDenominator = lcm(Number(currentFraction.denominator), Number(removerFraction.denominator));
    if (!commonDenominator) return { ok: false, message: 'Deze bubbles passen niet goed samen.' };

    var currentEquivalent = {
      numerator: Number(currentFraction.numerator) * (commonDenominator / Number(currentFraction.denominator)),
      denominator: commonDenominator
    };
    var removerEquivalent = {
      numerator: Number(removerFraction.numerator) * (commonDenominator / Number(removerFraction.denominator)),
      denominator: commonDenominator
    };
    var nextNumerator = currentEquivalent.numerator - removerEquivalent.numerator;
    if (nextNumerator < 0) return { ok: false, message: 'Dat is te veel weggenomen.' };

    return {
      ok: true,
      converted: Number(currentFraction.denominator) !== Number(removerFraction.denominator),
      currentBefore: currentFraction,
      currentAfter: currentEquivalent,
      removerBefore: removerFraction,
      removerAfter: removerEquivalent,
      result: BP.Fraction.simplify(nextNumerator, commonDenominator)
    };
  }

  function gcd(a, b) {
    a = Math.abs(Number(a));
    b = Math.abs(Number(b));
    while (b) {
      var temp = b;
      b = a % b;
      a = temp;
    }
    return a || 1;
  }

  function lcm(a, b) {
    if (!a || !b) return 0;
    return Math.abs(a * b) / gcd(a, b);
  }

  function cloneFraction(fraction) {
    return {
      numerator: Number(fraction && fraction.numerator),
      denominator: Number(fraction && fraction.denominator)
    };
  }

  function clonePieces(list) {
    return JSON.parse(JSON.stringify(list || []));
  }

  function resetDragStyle(button) {
    button.style.transform = '';
    button.style.zIndex = '';
  }

  function isLessThan(a, b) {
    if (!a || !b) return false;
    return a.numerator * b.denominator < b.numerator * a.denominator;
  }
})();
