(function () {
  window.BP = window.BP || {};
  BP.Screens = BP.Screens || {};

  BP.Screens.skills = {
    render: function () {
      return {
        html: '' +
          '<main class="screen">' +
            '<div class="screen-bg" style="background-image:url(' + BP.AssetManager.resolve("skill.fractions.bg.game") + ')"></div>' +
            '<div class="screen-inner">' +
              '<div class="top-row">' +
                '<button class="icon-button" data-action="home">←</button>' +
                '<span class="pill">Skills</span>' +
              '</div>' +
              '<div>' +
                '<h1 class="app-title">Kies<br>je skill</h1>' +
                '<p class="subtitle">Geen grote wereldkaart meer: direct naar wat je wil trainen.</p>' +
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
    var icon = skill.iconAsset ? BP.AssetManager.image(skill.iconAsset, skill.title) : '<span style="font-size:2rem;font-weight:900">' + skill.iconText + '</span>';
    return '' +
      '<button class="skill-card" data-skill-id="' + skill.id + '">' +
        '<span class="skill-icon">' + icon + '</span>' +
        '<span>' +
          '<span class="skill-title">' + skill.title + '</span>' +
          '<span class="skill-meta">' + (skill.locked ? 'Vergrendeld' : progress.percent + '% · ' + progress.stars + ' sterren') + '</span>' +
          '<span class="progress-track"><span class="progress-fill" style="width:' + progress.percent + '%"></span></span>' +
        '</span>' +
        '<span class="pill">' + (skill.locked ? '🔒' : '▶') + '</span>' +
      '</button>';
  }
})();
