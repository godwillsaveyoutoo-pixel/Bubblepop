(function () {
  window.BP = window.BP || {};
  BP.Screens = BP.Screens || {};

  BP.Screens.home = {
    render: function () {
      var state = BP.Store.get();
      var skill = findSkill(state.progress.currentSkillId) || BP.CONTENT.skills[0];
      var progress = BP.Progress.getSkillProgress(skill.id);
      var continueLevel = BP.Progress.getContinueLevel(skill.id);
      var tr = BP.I18n.t;
      var tx = BP.I18n.text;

      return {
        html: '' +
          '<main class="screen" style="' + BP.Theme.styleForBackground('skill.fractions.bg.home') + '">' +
            BP.Theme.backgroundHtml('skill.fractions.bg.home') +
            '<div class="screen-inner">' +
              '<div class="top-row">' +
                '<span class="pill">' + tr('guestMode') + '</span>' +
                '<button class="icon-button language-button" data-action="language" aria-label="' + tr('language') + '">🌐 ' + BP.I18n.short() + '</button>' +
              '</div>' +
              languagePanelHtml() +
              '<div class="spacer"></div>' +
              '<div>' +
                '<h1 class="app-title">' + tr('appTitle') + '</h1>' +
                '<p class="subtitle">' + tr('homeSubtitle') + '</p>' +
              '</div>' +
              '<section class="card">' +
                '<strong>' + tr('continueTitle') + '</strong>' +
                '<p class="subtitle">' + tx(skill.title) + ' · ' + progress.percent + '% · ' + progress.stars + ' ' + tr('stars') + ' · ' + progress.unlocked + '/' + progress.total + ' ' + tr('open') + '</p>' +
                '<div class="progress-track"><div class="progress-fill" style="width:' + progress.percent + '%"></div></div>' +
              '</section>' +
              '<button class="primary-button" data-action="continue">' + tr('continueButton') + '</button>' +
              '<div class="bottom-bar">' +
                '<button class="ghost-button" data-action="skills">' + tr('skills') + '</button>' +
                '<button class="ghost-button" data-action="reset">' + tr('reset') + '</button>' +
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
          var langButton = root.querySelector('[data-action="language"]');
          var panel = root.querySelector('[data-language-panel]');
          langButton.addEventListener('click', function () {
            panel.hidden = !panel.hidden;
          });
          root.querySelectorAll('[data-lang]').forEach(function (button) {
            button.addEventListener('click', function () {
              BP.I18n.set(button.getAttribute('data-lang'));
              BP.Router.go('home');
            });
          });
          var closeButton = root.querySelector('[data-action="close-language"]');
          closeButton.addEventListener('click', function () { panel.hidden = true; });
        }
      };
    }
  };

  function languagePanelHtml() {
    return '' +
      '<section class="language-panel card" data-language-panel hidden>' +
        '<div class="language-panel-head">' +
          '<strong>' + BP.I18n.t('chooseLanguage') + '</strong>' +
          '<button class="mini-button" data-action="close-language">×</button>' +
        '</div>' +
        '<div class="language-grid">' + BP.I18n.langs.map(function (lang) {
          var active = BP.I18n.get() === lang.code ? ' active' : '';
          return '<button class="language-option' + active + '" data-lang="' + lang.code + '"><span>' + lang.short + '</span><strong>' + lang.label + '</strong></button>';
        }).join('') + '</div>' +
      '</section>';
  }

  function findSkill(skillId) {
    return BP.CONTENT.skills.find(function (skill) { return skill.id === skillId; });
  }
})();
