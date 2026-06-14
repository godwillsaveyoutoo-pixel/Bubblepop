(function () {
  window.BP = window.BP || {};
  BP.Mechanics = BP.Mechanics || {};

  BP.Mechanics["bubble-fusion"] = {
    render: render,
    mount: mount,
    supportsUndo: true,
    selfManagedFeedback: true
  };

  function render(question, roundState) {
    var target = question.target;
    return '' +
      '<section class="question-card fusion-card add-card">' +
        '<h2 class="question-title fusion-title">' + buildTitleHtml(question, target) + '</h2>' +
        '<div class="fusion-arena" data-fusion-arena>' +
          '<div class="fusion-pool" data-fusion-pool></div>' +
          '<div class="fusion-conversion-note" data-fusion-conversion-note></div>' +
        '</div>' +
        '<p class="fusion-instruction" data-fusion-instruction>' + buildInstruction(question) + '</p>' +
      '</section>' +
      '<div class="feedback" data-fusion-feedback></div>';
  }

  function buildTitleHtml(question, target) {
    if (question && question.targetLabel) {
      return BP.Fraction.escapeHtml(question.prompt || 'Maak') + ' <span class="value-form-target plain-target-label">' + BP.Fraction.escapeHtml(question.targetLabel) + '</span>';
    }
    return BP.Fraction.escapeHtml(question.prompt || 'Maak') + ' ' + BP.Fraction.html(target.numerator, target.denominator);
  }

  function buildInstruction(question) {
    if (question && question.guidedConversion) {
      return 'Versmelt bubbles. Als de stukjes anders zijn, splitst het spel ze vanzelf even gelijk.';
    }
    return 'Versmelt bubbles tot je de doelbreuk maakt. Tikken mag ook: kies eerst de ene, dan de andere.';
  }

  function mount(container, onAnswer, question, roundState, context) {
    var pool = container.querySelector('[data-fusion-pool]');
    var feedback = container.querySelector('[data-fusion-feedback]');
    var conversionNote = container.querySelector('[data-fusion-conversion-note]');
    var undoButton = context && context.root ? context.root.querySelector('[data-action="undo"]') : null;
    var pieces = BP.Bubble.clonePieces(question.pieces || []);
    var history = [];
    var selectedId = null;
    var solved = false;
    var lastMistakeKey = null;
    var recentlyDragged = false;

    renderPool();
    setUndoState();

    if (undoButton) {
      undoButton.addEventListener('click', undoLastMove);
    }

    function renderPool() {
      ensureSlots();
      pool.innerHTML = pieces.map(function (piece, slotIndex) {
        if (!piece) {
          return '<div class="fusion-slot empty" data-fusion-slot="' + slotIndex + '"></div>';
        }
        return '' +
          '<div class="fusion-slot" data-fusion-slot="' + slotIndex + '">' +
            '<button class="fusion-piece" data-piece-id="' + BP.Fraction.escapeHtml(piece.id) + '" aria-label="' + piece.numerator + ' op ' + piece.denominator + '">' +
              BP.Bubble.skinImage() +
              BP.Fraction.html(piece.numerator, piece.denominator) +
            '</button>' +
          '</div>';
      }).join('');

      pool.querySelectorAll('[data-piece-id]').forEach(function (button) {
        var id = button.getAttribute('data-piece-id');
        if (id === selectedId) button.classList.add('armed');
        button.addEventListener('click', function () { handleTap(id); });
        installPointerDrag(button, id);
      });
      setUndoState();
    }

    function handleTap(id) {
      if (solved || recentlyDragged) return;
      if (!selectedId) {
        selectedId = id;
        setFeedback('', 'Kies nu de tweede bubble om te versmelten.');
        renderPool();
        return;
      }
      if (selectedId === id) {
        selectedId = null;
        setFeedback('', 'Selectie gewist. Kies twee verschillende bubbles.');
        renderPool();
        return;
      }
      fuse(selectedId, id);
    }

    function installPointerDrag(button, id) {
      BP.Bubble.installDrag(button, id, {
        disabled: function () { return solved; },
        container: pool,
        onDrop: function (sourceId, targetId) {
          markRecentlyDragged();
          fuse(sourceId, targetId);
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

    function fuse(idA, idB) {
      if (solved || idA === idB) return;
      var indexA = findPieceIndex(idA);
      var indexB = findPieceIndex(idB);
      if (indexA < 0 || indexB < 0) return;
      var a = pieces[indexA];
      var b = pieces[indexB];
      if (!a || !b) return;

      history.push(BP.Bubble.clonePieces(pieces));
      var fusion = fuseFractionsForQuestion(a, b, question);
      var sum = fusion.result;
      var newPiece = {
        id: 'f' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
        numerator: sum.numerator,
        denominator: sum.denominator,
        from: [idA, idB]
      };

      // Stable board: no reflow. The new bubble appears where the second bubble was.
      // The first bubble's old slot becomes empty, so other bubbles never jump around.
      pieces[indexA] = null;
      pieces[indexB] = newPiece;
      selectedId = null;
      renderPool();
      pulseNewPiece(newPiece.id);
      showConversion(fusion);
      evaluateNewPiece(newPiece);
    }

    function evaluateNewPiece(piece) {
      var target = question.target;
      if (BP.Fraction.equals(piece, target)) {
        solved = true;
        setFeedback('good', 'Plop! Je maakte de doelbreuk.');
        if (undoButton) undoButton.disabled = true;
        window.setTimeout(function () {
          onAnswer({ fraction: piece });
        }, 360);
        return;
      }

      if (isGreaterThan(piece, target)) {
        setFeedback('bad', 'Te groot. Tik ↶ om die versmelting terug te nemen.');
        recordMistake(piece);
        return;
      }

      setFeedback('', 'Nieuwe bubble: ' + piece.numerator + '/' + piece.denominator + '. Maak verder of gebruik ↶.');
    }

    function undoLastMove() {
      if (solved || !history.length) return;
      pieces = history.pop();
      selectedId = null;
      renderPool();
      setFeedback('', 'Zet ongedaan. Probeer een andere versmelting.');
      clearConversion();
    }
function findPieceIndex(id) {
      for (var i = 0; i < pieces.length; i += 1) {
        if (pieces[i] && pieces[i].id === id) return i;
      }
      return -1;
    }

    function ensureSlots() {
      pieces = pieces.map(function (piece) { return piece || null; });
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


    function showConversion(fusion) {
      if (!conversionNote) return;
      if (!question.guidedConversion || !fusion || !fusion.converted || !fusion.converted.changed) {
        conversionNote.textContent = '';
        conversionNote.className = 'fusion-conversion-note';
        return;
      }
      conversionNote.className = 'fusion-conversion-note visible';
      conversionNote.innerHTML = '' +
        '<span>stukjes gelijk:</span> ' +
        BP.Fraction.html(fusion.converted.left.numerator, fusion.converted.left.denominator) +
        '<span class="fusion-plus">+</span>' +
        BP.Fraction.html(fusion.converted.right.numerator, fusion.converted.right.denominator) +
        '<span class="fusion-arrow">→</span>' +
        BP.Fraction.html(fusion.result.numerator, fusion.result.denominator);
    }

    function clearConversion() {
      if (!conversionNote) return;
      conversionNote.textContent = '';
      conversionNote.className = 'fusion-conversion-note';
    }

    function recordMistake(piece) {
      var key = piece.numerator + '/' + piece.denominator;
      if (key === lastMistakeKey) return;
      lastMistakeKey = key;
      if (context && typeof context.recordMistake === 'function') {
        context.recordMistake({ fraction: piece });
      }
    }
  }


  function fuseFractionsForQuestion(a, b, question) {
    if (!question || !question.guidedConversion || Number(a.denominator) === Number(b.denominator)) {
      return {
        result: BP.Fraction.add([a, b]),
        converted: {
          changed: false,
          left: cloneFraction(a),
          right: cloneFraction(b)
        }
      };
    }
    var common = lcm(Number(a.denominator), Number(b.denominator));
    var left = {
      numerator: Number(a.numerator) * (common / Number(a.denominator)),
      denominator: common
    };
    var right = {
      numerator: Number(b.numerator) * (common / Number(b.denominator)),
      denominator: common
    };
    return {
      result: {
        numerator: left.numerator + right.numerator,
        denominator: common
      },
      converted: {
        changed: true,
        left: left,
        right: right
      }
    };
  }

  function cloneFraction(value) {
    return {
      numerator: Number(value.numerator),
      denominator: Number(value.denominator)
    };
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
function isGreaterThan(a, b) {
    if (!a || !b) return false;
    return a.numerator * b.denominator > b.numerator * a.denominator;
  }
})();
