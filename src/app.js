(function () {
  window.BP = window.BP || {};

  document.addEventListener('DOMContentLoaded', function () {
    BP.AssetManager.preloadByFlag().finally(function () {
      BP.Router.init(document.getElementById('app'));
    });
  });
})();
