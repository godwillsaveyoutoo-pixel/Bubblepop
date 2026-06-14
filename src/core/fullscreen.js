(function () {
  window.BP = window.BP || {};

  BP.Fullscreen = {
    isActive: isActive,
    toggle: toggle,
    bindButton: bindButton,
    bindMenuDoubleTap: bindMenuDoubleTap
  };

  function isActive() {
    return !!document.fullscreenElement || document.body.classList.contains('app-fullscreen-fallback');
  }

  function toggle() {
    if (isLocalFile()) {
      document.body.classList.toggle('app-fullscreen-fallback');
      return Promise.resolve();
    }
    if (document.fullscreenElement) {
      return document.exitFullscreen().catch(function () {
        document.body.classList.remove('app-fullscreen-fallback');
      });
    }
    if (canUseNativeFullscreen()) {
      return document.documentElement.requestFullscreen().catch(function () {
        document.body.classList.toggle('app-fullscreen-fallback');
      });
    }
    document.body.classList.toggle('app-fullscreen-fallback');
    return Promise.resolve();
  }


  function canUseNativeFullscreen() {
    return !isLocalFile() && !!document.documentElement.requestFullscreen;
  }

  function isLocalFile() {
    return window.location && window.location.protocol === 'file:';
  }

  function bindMenuDoubleTap(element) {
    if (!element) return;
    var lastTouchTap = 0;
    var maxDelay = 340;

    element.addEventListener('dblclick', function (event) {
      if (!isMenuScreen() || isInteractive(event.target)) return;
      event.preventDefault();
      toggle();
    });

    element.addEventListener('pointerup', function (event) {
      if (event.pointerType !== 'touch') return;
      if (!isMenuScreen() || isInteractive(event.target)) return;
      var now = Date.now();
      if (now - lastTouchTap > 0 && now - lastTouchTap < maxDelay) {
        event.preventDefault();
        lastTouchTap = 0;
        toggle();
        return;
      }
      lastTouchTap = now;
    }, { passive: false });
  }

  function isMenuScreen() {
    var state = BP.Router && BP.Router.current ? BP.Router.current() : null;
    if (!state || !state.name) return false;
    return state.name === 'home' || state.name === 'skills' || state.name === 'levels' || state.name === 'result';
  }

  function isInteractive(target) {
    return !!(target && target.closest && target.closest('button, a, input, textarea, select, label, [role="button"]'));
  }


  function bindButton(button) {
    if (!button) return;
    function update() {
      button.textContent = isActive() ? '×' : '⛶';
      button.setAttribute('aria-label', isActive() ? 'Fullscreen afsluiten' : 'Fullscreen');
      button.title = button.getAttribute('aria-label');
    }
    button.addEventListener('click', function () {
      toggle().finally(update);
    });
    document.addEventListener('fullscreenchange', update);
    update();
  }
})();
