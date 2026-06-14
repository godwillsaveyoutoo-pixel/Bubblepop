(function () {
  window.BP = window.BP || {};
  BP.Screens = BP.Screens || {};

  BP.Screens.result = {
    render: function (params) {
      var result = params.result || BP.Store.get().lastResult;
      if (!result) {
        return { html: '<main class="screen"><div class="screen-inner"><h1>Nog geen resultaat</h1></div></main>' };
      }
      var stars = calculateStars(result.correct, result.total, result.maxStreak);
      var nextLevel = BP.Progress.getNextLevel(result.skillId, result.levelId);
      var primaryLabel = nextLevel ? '▶ Volgende level' : '▶ Nog een ronde';
      var primaryAction = nextLevel ? 'next-level' : 'again';
      var helperText = nextLevel ? 'Klaar? Ga door naar: ' + nextLevel.title : 'Je zit aan het einde van de huidige reeks.';

      return {
        html: '' +
          '<main class="screen">' +
            '<div class="screen-bg" style="background-image:url(' + BP.AssetManager.resolve("skill.fractions.bg.game") + ')"></div>' +
            '<div class="screen-inner">' +
              '<div class="top-row">' +
                '<button class="icon-button" data-action="home">⌂</button>' +
                '<span class="pill">Resultaat</span>' +
              '</div>' +
              '<div class="spacer"></div>' +
              '<section class="card stack" style="text-align:center">' +
                '<p class="subtitle">' + result.levelTitle + '</p>' +
                '<div class="result-number">' + result.correct + '/' + result.total + '</div>' +
                '<div style="font-size:2rem">' + (stars ? '★'.repeat(stars) : '○') + '</div>' +
                '<p class="subtitle">Score ' + result.score + ' · beste streak ' + result.maxStreak + ' · ' + result.seconds + 's</p>' +
                '<p class="mechanic-note">' + escapeHtml(helperText) + '</p>' +
              '</section>' +
              '<button class="primary-button" data-action="' + primaryAction + '">' + primaryLabel + '</button>' +
              '<button class="ghost-button" data-action="again">Speel opnieuw</button>' +
              '<button class="ghost-button" data-action="levels">Kies level</button>' +
              '<div class="spacer"></div>' +
            '</div>' +
          '</main>',
        mount: function (root) {
          root.querySelector('[data-action="home"]').addEventListener('click', function () { BP.Router.go('home'); });
          root.querySelector('[data-action="again"]').addEventListener('click', function () {
            BP.Router.go('game', { skillId: result.skillId, levelId: result.levelId });
          });
          root.querySelector('[data-action="levels"]').addEventListener('click', function () {
            BP.Router.go('levels', { skillId: result.skillId });
          });
          var nextButton = root.querySelector('[data-action="next-level"]');
          if (nextButton) {
            nextButton.addEventListener('click', function () {
              BP.Router.go('game', { skillId: result.skillId, levelId: nextLevel.id });
            });
          }
        }
      };
    }
  };

  function calculateStars(correct, total, maxStreak) {
    var ratio = total ? correct / total : 0;
    if (ratio === 1 && maxStreak >= 5) return 3;
    if (ratio >= 0.8) return 2;
    if (ratio >= 0.5) return 1;
    return 0;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
})();
