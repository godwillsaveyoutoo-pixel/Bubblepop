(function () {
  window.BP = window.BP || {};
  BP.Screens = BP.Screens || {};

  BP.Screens.home = {
    render: function () {
      var state = BP.Store.get();
      var skill = findSkill(state.progress.currentSkillId) || BP.CONTENT.skills[0];
      var progress = BP.Progress.getSkillProgress(skill.id);
      var continueLevel = BP.Progress.getContinueLevel(skill.id);

      return {
        html: '' +
          '<main class="screen">' +
            '<div class="screen-bg" style="background-image:url(' + BP.AssetManager.resolve("skill.fractions.bg.game") + ')"></div>' +
            '<div class="screen-inner">' +
              '<div class="top-row">' +
                '<span class="pill">Gastmodus</span>' +
                '<button class="icon-button" data-action="settings" aria-label="Instellingen">⚙</button>' +
              '</div>' +
              '<div class="spacer"></div>' +
              '<div>' +
                '<h1 class="app-title">BubblePop<br>Wiskunde</h1>' +
                '<p class="subtitle">Korte rondes. Grote bubbles. Direct spelen.</p>' +
              '</div>' +
              '<section class="card">' +
                '<strong>Speel verder</strong>' +
                '<p class="subtitle">' + skill.title + ' · ' + progress.percent + '% · ' + progress.stars + ' sterren · ' + progress.unlocked + '/' + progress.total + ' open</p>' +
                '<div class="progress-track"><div class="progress-fill" style="width:' + progress.percent + '%"></div></div>' +
              '</section>' +
              '<button class="primary-button" data-action="continue">▶ Speel verder</button>' +
              '<div class="bottom-bar">' +
                '<button class="ghost-button" data-action="skills">Skills</button>' +
                '<button class="ghost-button" data-action="reset">Reset</button>' +
              '</div>' +
            '</div>' +
          '</main>',
        mount: function (root) {
          root.querySelector('[data-action="continue"]').addEventListener('click', function () {
            BP.Router.go('game', { skillId: skill.id, levelId: continueLevel ? continueLevel.id : skill.firstLevelId });
          });
          root.querySelector('[data-action="skills"]').addEventListener('click', function () {
            BP.Router.go('skills');
          });
          root.querySelector('[data-action="reset"]').addEventListener('click', function () {
            BP.Store.reset();
            BP.Router.go('home');
          });
        }
      };
    }
  };

  function findSkill(skillId) {
    return BP.CONTENT.skills.find(function (skill) { return skill.id === skillId; });
  }
})();
