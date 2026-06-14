(function () {
  window.BP = window.BP || {};

  var root = null;
  var currentCleanup = null;

  BP.Router = {
    init: init,
    go: go,
    current: function () { return BP.Router.state; },
    state: { name: "home", params: {} }
  };

  function init(rootElement) {
    root = rootElement;
    go("home");
  }

  function go(name, params) {
    if (!root) return;
    if (typeof currentCleanup === "function") currentCleanup();
    BP.Router.state = { name: name, params: params || {} };

    var screen = BP.Screens[name];
    if (!screen) {
      root.innerHTML = '<main class="screen"><div class="screen-inner"><h1>Scherm niet gevonden</h1></div></main>';
      currentCleanup = null;
      return;
    }

    var result = screen.render(params || {});
    root.innerHTML = result.html;
    currentCleanup = typeof result.mount === "function" ? result.mount(root, params || {}) : null;
  }
})();
