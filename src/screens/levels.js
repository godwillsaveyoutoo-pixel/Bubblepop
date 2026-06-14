(function () {
  window.BP = window.BP || {};
  BP.Screens = BP.Screens || {};

  BP.Screens.levels = {
    render: function (params) {
      var pack = BP.CONTENT[params.skillId] || BP.CONTENT.fractions;
      return {
        html: '' +
          '<main class="screen levels-screen">' +
            '<div class="screen-bg" style="background-image:url(' + BP.AssetManager.resolve(pack.backgroundAsset || "skill.fractions.bg.game") + ')"></div>' +
            '<div class="screen-inner">' +
              '<div class="top-row">' +
                '<button class="icon-button" data-action="skills">←</button>' +
                '<span class="pill">Levels</span>' +
              '</div>' +
              '<div>' +
                '<h1 class="app-title">' + pack.title + '</h1>' +
                '<p class="subtitle">Korte levels. Eén duidelijke actie per ronde.</p>' +
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
              if (!level || level.locked) return;
              BP.Router.go('game', { skillId: pack.id, levelId: levelId });
            });
          });
        }
      };

      function levelCard(level, index) {
        var p = BP.Progress.getLevelProgress(level.id);
        return '' +
          '<button class="level-card" data-level-id="' + level.id + '">' +
            '<span class="skill-icon"><strong>' + (index + 1) + '</strong></span>' +
            '<span>' +
              '<span class="level-title">' + level.title + '</span>' +
              '<span class="level-meta">' + level.description + '</span>' +
            '</span>' +
            '<span class="pill">' + (level.locked ? '🔒' : (p.stars ? '★'.repeat(p.stars) : '▶')) + '</span>' +
          '</button>';
      }
    }
  };
})();
