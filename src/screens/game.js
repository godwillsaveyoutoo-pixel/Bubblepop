(function () {
  window.BP = window.BP || {};
  BP.Screens = BP.Screens || {};

  BP.Screens.game = {
    render: function (params) {
      var setup = resolveLevel(params.skillId, params.levelId);
      if (!setup.level || !BP.Progress.isLevelUnlocked(setup.pack.id, setup.level.id)) {
        return {
          html: '<main class="screen"><div class="screen-inner"><h1>' + BP.I18n.t('unavailable') + '</h1><button class="primary-button" data-action="home">' + BP.I18n.t('back') + '</button></div></main>',
          mount: function (root) {
            root.querySelector('[data-action="home"]').addEventListener('click', function () { BP.Router.go('home'); });
          }
        };
      }

      BP.Theme.setActivePack(setup.pack);
      BP.Theme.preloadForPack(setup.pack);
      var round = BP.RoundEngine.create({
        skillId: setup.pack.id,
        levelId: setup.level.id,
        levelTitle: setup.level.title,
        roundSize: setup.level.roundSize || 10,
        questions: setup.level.questions
      });

      function makeHtml() {
        var roundState = round.getState();
        var question = round.getQuestion();
        var mechanic = resolveMechanic(setup.level, question);
        if (!mechanic || typeof mechanic.render !== "function") {
          return missingMechanicHtml(setup.level, question);
        }
        return '' +
          '<main class="screen game-screen" style="' + BP.Theme.styleForPack(setup.pack) + '">' +
            BP.Theme.backgroundHtml(setup.pack) +
            '<div class="screen-inner">' +
              '<header class="game-hud">' +
                '<button class="icon-button" data-action="levels">←</button>' +
                '<span class="pill" data-hud-score>' + BP.I18n.t('score') + ' ' + roundState.score + ' · ' + BP.I18n.t('streak') + ' ' + roundState.streak + '</span>' +
                '<span class="pill">' + (roundState.index + 1) + '/' + roundState.total + '</span>' +
              '</header>' +
              '<div id="mechanic-root">' + mechanic.render(question, roundState) + '</div>' +
              '<div class="spacer"></div>' +
              bottomBarHtml(mechanic) +
            '</div>' +
          '</main>';
      }

      return {
        html: makeHtml(),
        mount: function (root) {
          mountGame(root, round, setup, makeHtml);
        }
      };
    }
  };

  function resolveMechanic(level, question) {
    var mechanicName = (question && question.mechanic) || (level && level.mechanic);
    return BP.Mechanics[mechanicName];
  }

  function missingMechanicHtml(level, question) {
    var mechanicName = (question && question.mechanic) || (level && level.mechanic) || "onbekend";
    return '' +
      '<main class="screen game-screen" style="' + BP.Theme.styleForBackground('skill.fractions.bg.game') + '">' +
        '<div class="screen-inner">' +
          '<header class="game-hud">' +
            '<button class="icon-button" data-action="levels">←</button>' +
            '<span class="pill">' + BP.I18n.t('technicalError') + '</span>' +
          '</header>' +
          '<section class="question-card">' +
            '<h2>' + BP.I18n.t('mechanicNotLoaded') + '</h2>' +
            '<p class="subtitle">' + BP.I18n.t('mechanicMissing', { name: BP.Fraction.escapeHtml(mechanicName) }) + '</p>' +
            '<p class="mechanic-note">' + BP.I18n.t('checkScript') + '</p>' +
          '</section>' +
          '<div class="bottom-bar single"><button class="ghost-button" data-action="home">Home</button></div>' +
        '</div>' +
      '</main>';
  }

  function mountGame(root, round, setup, makeHtml) {
    bindNav(root, setup);
    bindMechanic(root, round, setup, makeHtml);
  }

  function bottomBarHtml(mechanic) {
    if (mechanic && mechanic.supportsUndo) {
      return '' +
        '<div class="bottom-bar">' +
          '<button class="ghost-button" data-action="home">' + BP.I18n.t('home') + '</button>' +
          '<button class="ghost-button undo-button" data-action="undo" disabled>' + BP.I18n.t('undo') + '</button>' +
        '</div>';
    }
    return '' +
      '<div class="bottom-bar single">' +
        '<button class="ghost-button" data-action="home">' + BP.I18n.t('home') + '</button>' +
      '</div>';
  }

  function bindNav(root, setup) {
    root.querySelector('[data-action="levels"]').addEventListener('click', function () {
      BP.Router.go('levels', { skillId: setup.pack.id });
    });
    root.querySelector('[data-action="home"]').addEventListener('click', function () {
      BP.Router.go('home');
    });
  }

  function bindMechanic(root, round, setup, makeHtml) {
    var mechanicRoot = root.querySelector('#mechanic-root');
    var question = round.getQuestion();
    var mechanic = resolveMechanic(setup.level, question);
    if (!mechanic || typeof mechanic.mount !== "function") return;
    mechanic.mount(mechanicRoot, function (payload) {
      var answer = round.answer(payload);
      if (answer.locked) return;
      if (!answer.correct) {
        rerender(root, round, setup, makeHtml);
        return;
      }
      if (!mechanic.selfManagedFeedback) {
        rerender(root, round, setup, makeHtml);
      }
      window.setTimeout(function () {
        var next = round.next();
        if (next.done) finish(next.result);
        else rerender(root, round, setup, makeHtml);
      }, 650);
    }, question, round.getState(), {
      root: root,
      recordMistake: function (payload) {
        var state = round.mistake(payload).state;
        var hud = root.querySelector('[data-hud-score]');
        if (hud) hud.textContent = BP.I18n.t('score') + ' ' + state.score + ' · ' + BP.I18n.t('streak') + ' ' + state.streak;
      }
    });
  }

  function rerender(root, round, setup, makeHtml) {
    root.innerHTML = makeHtml();
    mountGame(root, round, setup, makeHtml);
  }

  function finish(result) {
    BP.Progress.saveRoundResult(result);
    BP.Router.go('result', { result: result });
  }

  function resolveLevel(skillId, levelId) {
    var pack = BP.CONTENT[skillId] || BP.CONTENT.fractions;
    var level = (pack.levels || []).find(function (item) { return item.id === levelId; }) || pack.levels[0];
    return { pack: pack, level: level };
  }
})();
