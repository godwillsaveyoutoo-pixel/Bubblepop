(function () {
  window.BP = window.BP || {};
  BP.Mechanics = BP.Mechanics || {};

  BP.Mechanics["signed-fusion"] = {
    render: render,
    mount: mount,
    supportsUndo: true,
    selfManagedFeedback: true
  };

  function render(question) {
    var target = question.target;
    return '' +
      '<section class="question-card fusion-card signed-card add-card">' +
        '<h2 class="question-title fusion-title">' + BP.Fraction.escapeHtml(question.prompt || 'Maak') + ' ' + BP.Fraction.html(target.numerator, target.denominator) + '</h2>' +
        '<div class="fusion-arena signed-arena" data-signed-arena>' +
          '<div class="fusion-pool signed-pool" data-signed-pool></div>' +
          '<div class="fusion-conversion-note signed-note" data-signed-note></div>' +
        '</div>' +
        '<p class="fusion-instruction" data-signed-instruction>Versmelt bubbles. Min-bubbles nemen een stukje weg.</p>' +
      '</section>' +
      '<div class="feedback" data-signed-feedback></div>';
  }

  function mount(container, onAnswer, question, roundState, context) {
    var pool = container.querySelector('[data-signed-pool]');
    var feedback = container.querySelector('[data-signed-feedback]');
    var note = container.querySelector('[data-signed-note]');
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
      pieces = pieces.map(function (piece) { return piece || null; });
      pool.innerHTML = pieces.map(function (piece, slotIndex) {
        if (!piece) return '<div class="fusion-slot empty" data-signed-slot="' + slotIndex + '"></div>';
        var negative = Number(piece.numerator) < 0;
        var absNum = Math.abs(Number(piece.numerator));
        return '' +
          '<div class="fusion-slot" data-signed-slot="' + slotIndex + '">' +
            '<button class="fusion-piece signed-piece' + (negative ? ' negative-piece' : '') + '" data-piece-id="' + BP.Fraction.escapeHtml(piece.id) + '" aria-label="' + signedAria(piece) + '">' +
              BP.Bubble.skinImage(null, '', negative ? 'operator' : 'normal') +
              '<span class="operator-inline-label signed-inline-label">' +
                (negative ? '<span class="operator-symbol minus-inline">−</span>' : '') +
                BP.Fraction.html(absNum, piece.denominator) +
              '</span>' +
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
        setFeedback('', 'Kies nu een tweede bubble om te versmelten.');
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
      var fusion = addSignedFractions(a, b);
      var result = fusion.result;
      var newPiece = {
        id: 'sf' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
        numerator: result.numerator,
        denominator: result.denominator,
        from: [idA, idB]
      };

      // Same stable board rule as Maak samen: other bubbles do not jump.
      pieces[indexA] = null;
      pieces[indexB] = newPiece;
      selectedId = null;
      renderPool();
      pulseNewPiece(newPiece.id);
      showSignedNote(a, b, newPiece, fusion);
      evaluateNewPiece(newPiece);
    }

    function evaluateNewPiece(piece) {
      var target = question.target;
      if (BP.Fraction.equals(piece, target)) {
        solved = true;
        setFeedback('good', 'Plop! Je maakte meer dan één.');
        if (undoButton) undoButton.disabled = true;
        window.setTimeout(function () { onAnswer({ fraction: piece }); }, 360);
        return;
      }
      setFeedback('', 'Nieuwe bubble: ' + BP.Fraction.text(piece.numerator, piece.denominator) + '. Maak verder of gebruik ↶.');
    }

    function undoLastMove() {
      if (solved || !history.length) return;
      pieces = history.pop();
      selectedId = null;
      renderPool();
      clearNote();
      setFeedback('', 'Zet ongedaan. Probeer een andere versmelting.');
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

    function showSignedNote(a, b, resultPiece, fusion) {
      if (!note) return;
      note.className = 'fusion-conversion-note signed-note visible';
      note.innerHTML = '' +
        signedFractionHtml(a) +
        '<span class="fusion-plus">+</span>' +
        signedFractionHtml(b) +
        '<span class="fusion-arrow">→</span>' +
        signedFractionHtml(resultPiece) +
        (fusion.changed ? '<span class="signed-small-note">stukjes gelijk</span>' : '');
    }

    function clearNote() {
      if (!note) return;
      note.textContent = '';
      note.className = 'fusion-conversion-note signed-note';
    }

    function setFeedback(className, text) {
      BP.Bubble.setFeedback(feedback, className, text);
    }

    function setUndoState() {
      if (undoButton) undoButton.disabled = !history.length || solved;
    }
  }

  function addSignedFractions(a, b) {
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
      result: BP.Fraction.simplify(left.numerator + right.numerator, common),
      changed: Number(a.denominator) !== Number(b.denominator),
      left: left,
      right: right
    };
  }

  function signedFractionHtml(piece) {
    var negative = Number(piece.numerator) < 0;
    var absNum = Math.abs(Number(piece.numerator));
    return '<span class="signed-inline-fraction' + (negative ? ' negative' : '') + '">' + (negative ? '−' : '') + BP.Fraction.html(absNum, piece.denominator) + '</span>';
  }

  function signedAria(piece) {
    var negative = Number(piece.numerator) < 0;
    return (negative ? 'min ' : '') + Math.abs(Number(piece.numerator)) + ' op ' + piece.denominator;
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
