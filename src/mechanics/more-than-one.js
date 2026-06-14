(function () {
  window.BP = window.BP || {};
  BP.Mechanics = BP.Mechanics || {};

  BP.Mechanics["more-than-one"] = {
    render: render,
    mount: mount,
    supportsUndo: true,
    selfManagedFeedback: true
  };

  function render(question) {
    return '' +
      '<section class="question-card more-card bubblepop-card">' +
        '<h2 class="question-title fusion-title">' + BP.Fraction.escapeHtml(question.prompt || 'Maak') + ' ' + BP.Fraction.html(question.target.numerator, question.target.denominator) + '</h2>' +
        '<div class="more-arena" data-more-arena>' +
          '<div class="more-build-zone" data-more-build-zone>' +
            '<div class="more-build-empty">Sleep stukjes hierheen</div>' +
          '</div>' +
          '<div class="more-piece-pool" data-more-piece-pool></div>' +
        '</div>' +
        '<p class="fusion-instruction" data-more-instruction>Vul eerst een hele bubble. Het overschot komt ernaast. Tikken mag ook.</p>' +
      '</section>' +
      '<div class="feedback" data-more-feedback></div>';
  }

  function mount(container, onAnswer, question, roundState, context) {
    var buildZone = container.querySelector('[data-more-build-zone]');
    var pool = container.querySelector('[data-more-piece-pool]');
    var feedback = container.querySelector('[data-more-feedback]');
    var instruction = container.querySelector('[data-more-instruction]');
    var undoButton = context && context.root ? context.root.querySelector('[data-action="undo"]') : null;

    var denominator = Number(question.pieceDenominator || (question.target && question.target.denominator) || 1);
    var targetNumerator = Number(question.target && question.target.numerator || 0);
    var totalPieces = Number(question.availablePieces || Math.max(targetNumerator + 1, denominator + 2));
    var usedPieces = [];
    var pieces = makePieceList(totalPieces, denominator);
    var solved = false;
    var lastMistakeCount = null;
    var recentlyDragged = false;

    renderAll();
    updateUndo();

    if (undoButton) {
      undoButton.addEventListener('click', undoLast);
    }

    function renderAll() {
      renderBuild();
      renderPool();
      updateUndo();
      updateInstruction();
    }

    function renderBuild() {
      var count = usedPieces.length;
      if (!count) {
        buildZone.innerHTML = '<div class="more-build-empty">Sleep stukjes hierheen</div>';
        return;
      }
      var wholeCount = Math.floor(count / denominator);
      var remainder = count % denominator;
      var bubbles = [];
      for (var i = 0; i < wholeCount; i += 1) {
        bubbles.push(fullBubbleHtml(denominator));
      }
      if (remainder > 0) {
        bubbles.push(partBubbleHtml(remainder, denominator));
      }
      buildZone.innerHTML = bubbles.join('');
    }

    function renderPool() {
      pool.innerHTML = pieces.map(function (piece, slotIndex) {
        if (piece.used) {
          return '<div class="more-piece-slot empty" data-more-slot="' + slotIndex + '"></div>';
        }
        return '' +
          '<div class="more-piece-slot" data-more-slot="' + slotIndex + '">' +
            '<button class="more-piece" data-more-id="' + BP.Fraction.escapeHtml(piece.id) + '" aria-label="stukje 1 op ' + denominator + '">' +
              BP.AssetManager.image("bubble.blue.idle", "") +
              BP.Fraction.html(1, denominator) +
            '</button>' +
          '</div>';
      }).join('');

      pool.querySelectorAll('[data-more-id]').forEach(function (button) {
        var id = button.getAttribute('data-more-id');
        button.addEventListener('click', function () { handleTap(id); });
        installPointerDrag(button, id);
      });
    }

    function handleTap(id) {
      if (solved || recentlyDragged) return;
      addPiece(id);
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

        if (isPointInBuildZone(event.clientX, event.clientY)) {
          addPiece(id);
        } else {
          setFeedback('', 'Laat het stukje los boven de lege ruimte.');
        }
      });

      button.addEventListener('pointercancel', function () {
        drag = null;
        button.classList.remove('dragging');
        resetDragStyle(button);
      });
    }

    function addPiece(id) {
      if (solved) return;
      var piece = findPiece(id);
      if (!piece || piece.used) return;
      piece.used = true;
      usedPieces.push(id);
      renderAll();
      pulseLatestBubble();
      evaluateBuild();
    }

    function evaluateBuild() {
      var count = usedPieces.length;
      if (count === targetNumerator) {
        solved = true;
        setFeedback('good', 'Plop! Meer dan één geheel.');
        if (undoButton) undoButton.disabled = true;
        window.setTimeout(function () {
          onAnswer({
            fraction: {
              numerator: count,
              denominator: denominator
            }
          });
        }, 360);
        return;
      }
      if (count > targetNumerator) {
        setFeedback('bad', 'Te veel. Tik ↶ om het laatste stukje terug te nemen.');
        recordMistake(count);
        return;
      }
      setFeedback('', buildCountText(count));
    }

    function undoLast() {
      if (solved || !usedPieces.length) return;
      var id = usedPieces.pop();
      var piece = findPiece(id);
      if (piece) piece.used = false;
      renderAll();
      setFeedback('', usedPieces.length ? buildCountText(usedPieces.length) : 'Zet ongedaan. Probeer opnieuw.');
    }

    function updateInstruction() {
      if (!instruction) return;
      var count = usedPieces.length;
      if (!count) {
        instruction.textContent = 'Gebruik stukjes van 1/' + denominator + '. Na ' + denominator + ' stukjes is één bubble vol.';
        return;
      }
      var remaining = targetNumerator - count;
      if (remaining > 0) {
        instruction.textContent = 'Nog ' + remaining + ' ' + (remaining === 1 ? 'stukje' : 'stukjes') + ' tot ' + targetNumerator + '/' + denominator + '.';
      } else if (remaining === 0) {
        instruction.textContent = 'Mooi!';
      } else {
        instruction.textContent = 'Te veel stukjes. Gebruik ↶.';
      }
    }

    function buildCountText(count) {
      var wholeCount = Math.floor(count / denominator);
      var remainder = count % denominator;
      if (wholeCount > 0 && remainder > 0) {
        return 'Nu heb je ' + wholeCount + ' volle bubble' + (wholeCount > 1 ? 's' : '') + ' en ' + remainder + '/' + denominator + '.';
      }
      if (wholeCount > 0) {
        return 'Nu heb je ' + wholeCount + ' volle bubble' + (wholeCount > 1 ? 's' : '') + '.';
      }
      return 'Nu heb je ' + count + '/' + denominator + '.';
    }

    function fullBubbleHtml(denominator) {
      return '' +
        '<div class="more-built-bubble full" data-built-bubble>' +
          BP.AssetManager.image("bubble.blue.idle", "") +
          BP.Fraction.html(denominator, denominator) +
          '<span class="more-bubble-caption">vol</span>' +
        '</div>';
    }

    function partBubbleHtml(numerator, denominator) {
      return '' +
        '<div class="more-built-bubble rest" data-built-bubble>' +
          BP.AssetManager.image("bubble.blue.idle", "") +
          BP.Fraction.html(numerator, denominator) +
        '</div>';
    }

    function pulseLatestBubble() {
      var built = buildZone.querySelectorAll('[data-built-bubble]');
      if (!built.length) return;
      var last = built[built.length - 1];
      last.classList.add('just-built');
      window.setTimeout(function () { last.classList.remove('just-built'); }, 420);
    }

    function isPointInBuildZone(x, y) {
      var rect = buildZone.getBoundingClientRect();
      return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    }

    function findPiece(id) {
      return pieces.find(function (piece) { return piece.id === id; }) || null;
    }

    function updateUndo() {
      if (undoButton) undoButton.disabled = !usedPieces.length || solved;
    }

    function setFeedback(className, text) {
      if (!feedback) return;
      feedback.className = 'feedback ' + className;
      feedback.textContent = text;
    }

    function recordMistake(count) {
      if (lastMistakeCount === count) return;
      lastMistakeCount = count;
      if (context && typeof context.recordMistake === 'function') {
        context.recordMistake({ fraction: { numerator: count, denominator: denominator } });
      }
    }
  }

  function makePieceList(count, denominator) {
    var pieces = [];
    for (var i = 0; i < count; i += 1) {
      pieces.push({
        id: 'more-' + i + '-1-' + denominator,
        numerator: 1,
        denominator: denominator,
        used: false
      });
    }
    return pieces;
  }

  function resetDragStyle(button) {
    button.style.transform = '';
    button.style.zIndex = '';
  }
})();
