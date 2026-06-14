(function () {
  window.BP = window.BP || {};

  var activeTheme = null;

  BP.Theme = {
    setActivePack: setActivePack,
    getActiveTheme: getActiveTheme,
    bubbleSkin: bubbleSkin,
    popEffect: popEffect,
    styleForPack: styleForPack,
    styleForBackground: styleForBackground,
    backgroundHtml: backgroundHtml,
    preloadForPack: preloadForPack
  };

  function setActivePack(pack) {
    activeTheme = normalizeTheme(pack || {});
    return activeTheme;
  }

  function getActiveTheme() {
    if (!activeTheme) activeTheme = normalizeTheme({});
    return activeTheme;
  }

  function normalizeTheme(pack) {
    var theme = pack.theme || {};
    return {
      background: theme.background || pack.backgroundAsset || 'skill.fractions.bg.game',
      bubbleSkin: theme.bubbleSkin || 'bubble.blue.idle',
      operatorBubbleSkin: theme.operatorBubbleSkin || theme.bubbleSkin || 'bubble.blue.idle',
      popEffect: theme.popEffect || 'fx.pop.correct'
    };
  }

  function bubbleSkin(kind) {
    var theme = getActiveTheme();
    return kind === 'operator' ? theme.operatorBubbleSkin : theme.bubbleSkin;
  }

  function popEffect() {
    return getActiveTheme().popEffect;
  }

  function styleForPack(pack) {
    return styleFromTheme(normalizeTheme(pack || {}));
  }

  function styleForBackground(assetId) {
    return cssVar('--bp-bg-image', cssUrl(assetId || 'skill.fractions.bg.game'));
  }

  function backgroundHtml(packOrAssetId) {
    var style = typeof packOrAssetId === 'string'
      ? styleForBackground(packOrAssetId)
      : styleForPack(packOrAssetId || {});
    return '<div class="screen-bg" style="' + escapeAttr(style) + '"></div>';
  }

  function preloadForPack(pack) {
    var theme = normalizeTheme(pack || {});
    return BP.AssetManager.preload([theme.background, theme.bubbleSkin, theme.operatorBubbleSkin, theme.popEffect]);
  }

  function styleFromTheme(theme) {
    return [
      cssVar('--bp-bg-image', cssUrl(theme.background)),
      cssVar('--bp-bubble-image', cssUrl(theme.bubbleSkin)),
      cssVar('--bp-operator-bubble-image', cssUrl(theme.operatorBubbleSkin)),
      cssVar('--bp-pop-fx-image', cssUrl(theme.popEffect))
    ].join('');
  }

  function cssUrl(assetId) {
    if (!assetId || !BP.AssetManager) return 'none';
    return BP.AssetManager.cssUrl(assetId);
  }

  function cssVar(name, value) {
    return name + ':' + value + ';';
  }

  function escapeAttr(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;');
  }
})();
