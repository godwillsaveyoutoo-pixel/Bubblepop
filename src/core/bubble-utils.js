(function () {
  window.BP = window.BP || {};

  BP.Bubble = {
    clonePieces: clonePieces,
    cssEscape: cssEscape,
    findPieceIndex: findPieceIndex,
    findButtonAt: findButtonAt,
    installDrag: installDrag,
    pulsePiece: pulsePiece,
    resetDragStyle: resetDragStyle,
    setFeedback: setFeedback,
    setUndoDisabled: setUndoDisabled,
    uid: uid
  };

  function clonePieces(list) {
    return JSON.parse(JSON.stringify(list || []));
  }

  function uid(prefix) {
    return String(prefix || 'p') + Date.now() + '-' + Math.random().toString(36).slice(2, 7);
  }

  function cssEscape(value) {
    if (window.CSS && typeof window.CSS.escape === 'function') return window.CSS.escape(value);
    return String(value).replace(/"/g, '\\"');
  }

  function findPieceIndex(pieces, id) {
    for (var i = 0; i < pieces.length; i += 1) {
      if (pieces[i] && pieces[i].id === id) return i;
    }
    return -1;
  }

  function findButtonAt(container, x, y, ignoreId, selector, idAttribute) {
    if (!container) return null;
    selector = selector || '[data-piece-id]';
    idAttribute = idAttribute || 'data-piece-id';
    var buttons = Array.prototype.slice.call(container.querySelectorAll(selector));
    return buttons.find(function (button) {
      var id = button.getAttribute(idAttribute);
      if (id === ignoreId) return false;
      var rect = button.getBoundingClientRect();
      return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    }) || null;
  }

  function resetDragStyle(button) {
    if (!button) return;
    button.style.transform = '';
    button.style.zIndex = '';
  }

  function pulsePiece(container, id, options) {
    options = options || {};
    if (!container || !id) return;
    var selector = (options.selector || '[data-piece-id="{id}"]').replace('{id}', cssEscape(id));
    var button = container.querySelector(selector);
    if (!button) return;
    var className = options.className || 'just-fused';
    button.classList.add(className);
    window.setTimeout(function () { button.classList.remove(className); }, options.duration || 420);
  }

  function setFeedback(element, className, text) {
    if (!element) return;
    element.className = 'feedback ' + (className || '');
    element.textContent = text || '';
  }

  function setUndoDisabled(button, disabled) {
    if (button) button.disabled = !!disabled;
  }

  function installDrag(button, id, options) {
    options = options || {};
    var drag = null;
    var threshold = Number(options.threshold || 6);
    var scale = Number(options.scale || 1.08);

    button.addEventListener('pointerdown', function (event) {
      if (options.disabled && options.disabled()) return;
      drag = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        moved: false
      };
      button.setPointerCapture(event.pointerId);
      button.classList.add(options.draggingClass || 'dragging');
      if (typeof options.onStart === 'function') options.onStart(event, id);
    });

    button.addEventListener('pointermove', function (event) {
      if (!drag || drag.pointerId !== event.pointerId) return;
      var dx = event.clientX - drag.startX;
      var dy = event.clientY - drag.startY;
      if (Math.abs(dx) + Math.abs(dy) > threshold) drag.moved = true;
      if (drag.moved) {
        button.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(' + scale + ')';
        button.style.zIndex = options.zIndex || 30;
      }
      if (typeof options.onMove === 'function') options.onMove(event, id, drag);
    });

    button.addEventListener('pointerup', function (event) {
      if (!drag || drag.pointerId !== event.pointerId) return;
      var wasMoved = drag.moved;
      drag = null;
      button.classList.remove(options.draggingClass || 'dragging');
      resetDragStyle(button);

      if (!wasMoved) return;
      var targetButton = null;
      var targetId = null;
      var hasTarget = false;

      if (typeof options.hitTest === 'function') {
        hasTarget = !!options.hitTest(event.clientX, event.clientY, id, event);
      } else {
        targetButton = findButtonAt(
          options.container,
          event.clientX,
          event.clientY,
          id,
          options.targetSelector || '[data-piece-id]',
          options.targetIdAttribute || 'data-piece-id'
        );
        hasTarget = !!targetButton;
        targetId = targetButton ? targetButton.getAttribute(options.targetIdAttribute || 'data-piece-id') : null;
      }

      if (hasTarget && typeof options.onDrop === 'function') {
        options.onDrop(id, targetId, event, targetButton);
      } else if (!hasTarget && typeof options.onMiss === 'function') {
        options.onMiss(id, event);
      }
    });

    button.addEventListener('pointercancel', function (event) {
      drag = null;
      button.classList.remove(options.draggingClass || 'dragging');
      resetDragStyle(button);
      if (typeof options.onCancel === 'function') options.onCancel(event, id);
    });
  }
})();
