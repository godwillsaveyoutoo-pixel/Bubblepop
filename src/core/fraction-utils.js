(function () {
  window.BP = window.BP || {};

  BP.Fraction = {
    html: fractionHtml,
    text: fractionText,
    add: addFractions,
    equals: equalsFraction,
    simplify: simplify,
    escapeHtml: escapeHtml
  };

  function fractionHtml(numerator, denominator) {
    return '' +
      '<span class="fraction" aria-hidden="true">' +
        '<span>' + escapeHtml(numerator) + '</span>' +
        '<span class="fraction-line"></span>' +
        '<span>' + escapeHtml(denominator) + '</span>' +
      '</span>';
  }

  function fractionText(numerator, denominator) {
    return String(numerator) + '/' + String(denominator);
  }

  function addFractions(items) {
    var totalNumerator = 0;
    var totalDenominator = 1;
    (items || []).forEach(function (item) {
      if (!item || !item.denominator) return;
      totalNumerator = totalNumerator * item.denominator + item.numerator * totalDenominator;
      totalDenominator = totalDenominator * item.denominator;
      var reduced = simplify(totalNumerator, totalDenominator);
      totalNumerator = reduced.numerator;
      totalDenominator = reduced.denominator;
    });
    return simplify(totalNumerator, totalDenominator);
  }

  function equalsFraction(a, b) {
    if (!a || !b || !a.denominator || !b.denominator) return false;
    var left = simplify(a.numerator, a.denominator);
    var right = simplify(b.numerator, b.denominator);
    return left.numerator === right.numerator && left.denominator === right.denominator;
  }

  function simplify(numerator, denominator) {
    numerator = Number(numerator);
    denominator = Number(denominator);
    if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) {
      return { numerator: 0, denominator: 1 };
    }
    var sign = denominator < 0 ? -1 : 1;
    numerator *= sign;
    denominator = Math.abs(denominator);
    var divisor = gcd(Math.abs(numerator), denominator) || 1;
    return {
      numerator: numerator / divisor,
      denominator: denominator / divisor
    };
  }

  function gcd(a, b) {
    while (b) {
      var temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
})();
