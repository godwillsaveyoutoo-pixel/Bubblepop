(function () {
  window.BP = window.BP || {};
  BP.Screens = BP.Screens || {};

  BP.Screens.result = {
    render: function (params) {
      var result = params.result || BP.Store.get().lastResult;
      if (!result) {
        return { html: '<main class="screen" style="' + BP.Theme.styleForBackground('skill.fractions.bg.menu') + '"><div class="screen-bg"></div><div class="screen-inner"><h1>' + BP.I18n.t('noResult') + '</h1></div></main>' };
      }
      var stars = calculateStars(result.correct, result.total, result.maxStreak);
      var nextLevel = BP.Progress.getNextLevel(result.skillId, result.levelId);
      var primaryLabel = nextLevel ? BP.I18n.t('nextLevel') : BP.I18n.t('anotherRound');
      var primaryAction = nextLevel ? 'next-level' : 'again';
      var helperText = nextLevel ? BP.I18n.t('resultNextHelp', { title: BP.I18n.text(nextLevel.title) }) : BP.I18n.t('resultEndHelp');

      return {
        html: '' +
          '<main class="screen" style="' + BP.Theme.styleForBackground('skill.fractions.bg.menu') + '">' +
            BP.Theme.backgroundHtml('skill.fractions.bg.menu') +
            '<div class="screen-inner">' +
              '<div class="top-row">' +
                '<button class="icon-button" data-action="home">⌂</button>' +
                '<span class="pill">' + BP.I18n.t('result') + '</span>' +
              '</div>' +
              '<div class="spacer"></div>' +
              '<section class="card stack" style="text-align:center">' +
                '<p class="subtitle">' + BP.I18n.text(result.levelTitle) + '</p>' +
                '<div class="result-number">' + result.correct + '/' + result.total + '</div>' +
                '<div style="font-size:2rem">' + (stars ? '★'.repeat(stars) : '○') + '</div>' +
                '<p class="subtitle">' + BP.I18n.t('score') + ' ' + result.score + ' · ' + BP.I18n.t('bestStreak') + ' ' + result.maxStreak + ' · ' + result.seconds + BP.I18n.t('secondsShort') + '</p>' +
                '<p class="mechanic-note">' + escapeHtml(helperText) + '</p>' +
              '</section>' +
              '<button class="primary-button" data-action="' + primaryAction + '">' + primaryLabel + '</button>' +
              '<button class="ghost-button" data-action="again">' + BP.I18n.t('playAgain') + '</button>' +
              '<button class="ghost-button" data-action="levels">' + BP.I18n.t('chooseLevel') + '</button>' +
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
