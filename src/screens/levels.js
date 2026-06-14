(function () {
  window.BP = window.BP || {};
  BP.Screens = BP.Screens || {};

  BP.Screens.levels = {
    render: function (params) {
      var pack = BP.CONTENT[params.skillId] || BP.CONTENT.fractions;
      return {
        html: '' +
          '<main class="screen levels-screen" style="' + BP.Theme.styleForPack(pack) + '">' +
            BP.Theme.backgroundHtml(pack) +
            '<div class="screen-inner">' +
              '<div class="top-row">' +
                '<button class="icon-button" data-action="skills">←</button>' +
                '<span class="pill">' + BP.I18n.t('levels') + '</span>' +
              '</div>' +
              '<div>' +
                '<h1 class="app-title">' + BP.I18n.text(pack.title) + '</h1>' +
                '<p class="subtitle">' + BP.I18n.t('levelSubtitle') + '</p>' +
              '</div>' +
              '<div class="stack levels-list">' + pack.levels.map(levelCard).join('') + '</div>' +
            '</div>' +
          '</main>',
        mount: function (root) {
          root.querySelector('[data-action="skills"]').addEventListener('click', function () {
            BP.Router.go('skills');
          });
          root.querySelectorAll('[data-level-id]').forEach(function (button) {
            button.addEventListener('click', function () {
              var levelId = button.getAttribute('data-level-id');
              var level = pack.levels.find(function (item) { return item.id === levelId; });
              if (!level || !BP.Progress.isLevelUnlocked(pack.id, level.id)) return;
              BP.Router.go('game', { skillId: pack.id, levelId: levelId });
            });
          });
        }
      };

      function levelCard(level, index) {
        var p = BP.Progress.getLevelProgress(level.id);
        var unlocked = BP.Progress.isLevelUnlocked(pack.id, level.id);
        var completed = !!p.completed;
        var status = unlocked ? (p.stars ? '★'.repeat(p.stars) : (completed ? '✓' : '▶')) : '🔒';
        var meta = unlocked ? BP.I18n.text(level.description) : BP.I18n.t('playPrevious', { n: index });
        var classes = 'level-card' + (unlocked ? '' : ' is-locked') + (completed ? ' is-completed' : '');
        return '' +
          '<button class="' + classes + '" data-level-id="' + level.id + '"' + (unlocked ? '' : ' disabled aria-disabled="true"') + '>' +
            '<span class="skill-icon"><strong>' + (index + 1) + '</strong></span>' +
            '<span>' +
              '<span class="level-title">' + BP.I18n.text(level.title) + '</span>' +
              '<span class="level-meta">' + meta + '</span>' +
            '</span>' +
            '<span class="pill">' + status + '</span>' +
          '</button>';
      }
    }
  };
})();
