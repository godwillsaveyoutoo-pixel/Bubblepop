(function () {
  window.BP = window.BP || {};

  var activeTheme = null;

  BP.Theme = {
    setActivePack: setActivePack,
    getActiveTheme: getActiveTheme,
    bubbleSkin: bubbleSkin,
    operatorSkin: operatorSkin,
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
      addBubbleSkin: theme.addBubbleSkin || theme.operatorBubbleSkin || 'bubble.add.green',
      subtractBubbleSkin: theme.subtractBubbleSkin || theme.operatorBubbleSkin || 'bubble.subtract.red',
      multiplyBubbleSkin: theme.multiplyBubbleSkin || theme.operatorBubbleSkin || 'bubble.multiply.amber',
      divideBubbleSkin: theme.divideBubbleSkin || theme.operatorBubbleSkin || 'bubble.divide.purple',
      quantityBubbleSkin: theme.quantityBubbleSkin || 'bubble.quantity.pearl',
      valueBubbleSkin: theme.valueBubbleSkin || theme.bubbleSkin || 'bubble.value.purple',
      successBubbleSkin: theme.successBubbleSkin || 'bubble.success.gold',
      popEffect: theme.popEffect || 'fx.pop.correct'
    };
  }

  function bubbleSkin(kind, subtype) {
    var theme = getActiveTheme();
    if (kind === 'operator') return operatorSkin(subtype);
    if (kind === 'quantity') return theme.quantityBubbleSkin;
    if (kind === 'value') return theme.valueBubbleSkin;
    if (kind === 'success') return theme.successBubbleSkin;
    return theme.bubbleSkin;
  }

  function operatorSkin(subtype) {
    var theme = getActiveTheme();
    if (subtype === 'add') return theme.addBubbleSkin;
    if (subtype === 'subtract') return theme.subtractBubbleSkin;
    if (subtype === 'multiply') return theme.multiplyBubbleSkin;
    if (subtype === 'divide') return theme.divideBubbleSkin;
    return theme.operatorBubbleSkin;
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
    return BP.AssetManager.preload([theme.background, theme.bubbleSkin, theme.operatorBubbleSkin, theme.addBubbleSkin, theme.subtractBubbleSkin, theme.multiplyBubbleSkin, theme.divideBubbleSkin, theme.quantityBubbleSkin, theme.valueBubbleSkin, theme.successBubbleSkin, theme.popEffect]);
  }

  function styleFromTheme(theme) {
    return [
      cssVar('--bp-bg-image', cssUrl(theme.background)),
      cssVar('--bp-bubble-image', cssUrl(theme.bubbleSkin)),
      cssVar('--bp-operator-bubble-image', cssUrl(theme.operatorBubbleSkin)),
      cssVar('--bp-add-bubble-image', cssUrl(theme.addBubbleSkin)),
      cssVar('--bp-subtract-bubble-image', cssUrl(theme.subtractBubbleSkin)),
      cssVar('--bp-multiply-bubble-image', cssUrl(theme.multiplyBubbleSkin)),
      cssVar('--bp-divide-bubble-image', cssUrl(theme.divideBubbleSkin)),
      cssVar('--bp-quantity-bubble-image', cssUrl(theme.quantityBubbleSkin)),
      cssVar('--bp-value-bubble-image', cssUrl(theme.valueBubbleSkin)),
      cssVar('--bp-success-bubble-image', cssUrl(theme.successBubbleSkin)),
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
