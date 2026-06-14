(function () {
  window.BP = window.BP || {};

  BP.VisualFraction = {
    html: visualHtml,
    interactive: interactiveHtml
  };

  function visualHtml(visual, options) {
    options = options || {};
    if (!visual) return '<div class="fraction-visual empty">?</div>';
    var n = Number(visual.numerator || 0);
    var d = Number(visual.denominator || 1);
    var kind = visual.kind || "bar";
    var large = options.large ? ' large' : '';
    var caption = options.caption ? '<span class="visual-caption">' + BP.Fraction.html(n, d) + '</span>' : '';

    return '' +
      '<div class="fraction-visual ' + BP.Fraction.escapeHtml(kind) + '-visual' + large + '" aria-label="breuk ' + BP.Fraction.escapeHtml(n + '/' + d) + '">' +
        '<div class="visual-piece-wrap visual-' + BP.Fraction.escapeHtml(kind) + '" style="--parts:' + d + '; --cols:' + columnsFor(d) + '; --filled:' + n + ';">' + pieces(d, n, false) + '</div>' +
        caption +
      '</div>';
  }

  function interactiveHtml(visual, options) {
    options = options || {};
    if (!visual) return '<div class="fraction-visual empty">?</div>';
    var d = Number(visual.denominator || 1);
    var kind = visual.kind || "bar";
    var large = options.large ? ' large' : '';
    return '' +
      '<div class="fraction-visual ' + BP.Fraction.escapeHtml(kind) + '-visual interactive-visual' + large + '" aria-label="vul breuk met ' + d + ' delen">' +
        '<div class="visual-piece-wrap visual-' + BP.Fraction.escapeHtml(kind) + '" style="--parts:' + d + '; --cols:' + columnsFor(d) + '; --filled:0;">' + pieces(d, 0, true) + '</div>' +
      '</div>';
  }

  function columnsFor(d) {
    if (d <= 3) return d;
    if (d === 4) return 2;
    if (d === 5) return 5;
    if (d === 6) return 3;
    if (d === 8) return 4;
    if (d === 10) return 5;
    return Math.ceil(Math.sqrt(d));
  }

  function pieces(d, n, interactive) {
    var output = [];
    for (var i = 0; i < d; i += 1) {
      output.push('<span class="visual-piece' + (i < n ? ' filled' : '') + '"' + (interactive ? ' data-fill-index="' + i + '" role="button" tabindex="0"' : '') + '></span>');
    }
    return output.join('');
  }
})();
