(function () {
  window.BP = window.BP || {};

  BP.Fullscreen = {
    isActive: isActive,
    toggle: toggle,
    bindButton: bindButton
  };

  function isActive() {
    return !!document.fullscreenElement || document.body.classList.contains('app-fullscreen-fallback');
  }

  function toggle() {
    if (document.fullscreenElement) {
      return document.exitFullscreen().catch(function () {
        document.body.classList.remove('app-fullscreen-fallback');
      });
    }
    if (document.documentElement.requestFullscreen) {
      return document.documentElement.requestFullscreen().catch(function () {
        document.body.classList.toggle('app-fullscreen-fallback');
      });
    }
    document.body.classList.toggle('app-fullscreen-fallback');
    return Promise.resolve();
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
