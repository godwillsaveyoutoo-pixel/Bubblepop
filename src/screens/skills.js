(function () {
  window.BP = window.BP || {};
  BP.Screens = BP.Screens || {};

  BP.Screens.skills = {
    render: function () {
      return {
        html: '' +
          '<main class="screen" style="' + BP.Theme.styleForBackground('skill.fractions.bg.menu') + '">' +
            BP.Theme.backgroundHtml('skill.fractions.bg.menu') +
            '<div class="screen-inner">' +
              '<div class="top-row">' +
                '<button class="icon-button" data-action="home">←</button>' +
                '<span class="pill">' + BP.I18n.t('skills') + '</span>' +
              '</div>' +
              '<div>' +
                '<h1 class="app-title">' + BP.I18n.t('chooseSkillTitle') + '</h1>' +
                '<p class="subtitle">' + BP.I18n.t('chooseSkillSubtitle') + '</p>' +
              '</div>' +
              '<div class="stack">' + BP.CONTENT.skills.map(skillCard).join('') + '</div>' +
            '</div>' +
          '</main>',
        mount: function (root) {
          root.querySelector('[data-action="home"]').addEventListener('click', function () {
            BP.Router.go('home');
          });
          root.querySelectorAll('[data-skill-id]').forEach(function (button) {
            button.addEventListener('click', function () {
              var skillId = button.getAttribute('data-skill-id');
              var skill = BP.CONTENT.skills.find(function (item) { return item.id === skillId; });
              if (skill.locked) return;
              BP.Router.go('levels', { skillId: skillId });
            });
          });
        }
      };
    }
  };

  function skillCard(skill) {
    var progress = BP.Progress.getSkillProgress(skill.id);
    var icon = skill.iconAsset ? BP.AssetManager.image(skill.iconAsset, BP.I18n.text(skill.title)) : '<span style="font-size:2rem;font-weight:900">' + skill.iconText + '</span>';
    return '' +
      '<button class="skill-card" data-skill-id="' + skill.id + '">' +
        '<span class="skill-icon">' + icon + '</span>' +
        '<span>' +
          '<span class="skill-title">' + BP.I18n.text(skill.title) + '</span>' +
          '<span class="skill-meta">' + (skill.locked ? BP.I18n.t('locked') : progress.percent + '% · ' + progress.stars + ' ' + BP.I18n.t('stars')) + '</span>' +
          '<span class="progress-track"><span class="progress-fill" style="width:' + progress.percent + '%"></span></span>' +
        '</span>' +
        '<span class="pill">' + (skill.locked ? '🔒' : '▶') + '</span>' +
      '</button>';
  }
})();
