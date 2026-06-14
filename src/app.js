(function () {
  window.BP = window.BP || {};

  document.addEventListener('DOMContentLoaded', function () {
    BP.AssetManager.preloadByFlag().finally(function () {
      var appRoot = document.getElementById('app');
      BP.Router.init(appRoot);
      if (BP.Fullscreen && BP.Fullscreen.bindMenuDoubleTap) {
        BP.Fullscreen.bindMenuDoubleTap(appRoot);
      }
    });
  });
})();
