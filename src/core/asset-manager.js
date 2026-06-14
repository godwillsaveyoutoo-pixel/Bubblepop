(function () {
  window.BP = window.BP || {};

  var cache = {};

  BP.AssetManager = {
    resolve: resolve,
    image: image,
    preload: preload,
    preloadByFlag: preloadByFlag
  };

  function resolve(assetId) {
    var record = BP.ASSETS[assetId];
    if (!record) {
      console.warn("Unknown asset:", assetId);
      return "";
    }
    return record.src;
  }

  function image(assetId, alt) {
    var src = resolve(assetId);
    return '<img src="' + escapeAttr(src) + '" alt="' + escapeAttr(alt || "") + '" />';
  }

  function preload(assetIds) {
    return Promise.all((assetIds || []).map(function (assetId) {
      if (cache[assetId]) return cache[assetId];
      var src = resolve(assetId);
      cache[assetId] = new Promise(function (resolvePromise) {
        if (!src) return resolvePromise(false);
        var img = new Image();
        img.onload = function () { resolvePromise(true); };
        img.onerror = function () { resolvePromise(false); };
        img.src = src;
      });
      return cache[assetId];
    }));
  }

  function preloadByFlag() {
    var ids = Object.keys(BP.ASSETS).filter(function (assetId) {
      return BP.ASSETS[assetId].preload;
    });
    return preload(ids);
  }

  function escapeAttr(value) {
    return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  }
})();
