(function () {
  window.BP = window.BP || {};

  BP.Progress = {
    getLevelProgress: getLevelProgress,
    getSkillProgress: getSkillProgress,
    saveRoundResult: saveRoundResult
  };

  function getLevelProgress(levelId) {
    var state = BP.Store.get();
    return state.progress.levels[levelId] || {
      attempts: 0,
      bestScore: 0,
      bestCorrect: 0,
      stars: 0,
      completed: false
    };
  }

  function getSkillProgress(skillId) {
    var pack = BP.CONTENT[skillId];
    if (!pack || !pack.levels) return { percent: 0, stars: 0, completed: 0, total: 0 };
    var playableLevels = pack.levels.filter(function (level) { return !level.locked; });
    var total = playableLevels.length;
    var stars = 0;
    var completed = 0;
    playableLevels.forEach(function (level) {
      var p = getLevelProgress(level.id);
      stars += p.stars || 0;
      if (p.completed) completed += 1;
    });
    return {
      percent: total ? Math.round((completed / total) * 100) : 0,
      stars: stars,
      completed: completed,
      total: total
    };
  }

  function saveRoundResult(result) {
    BP.Store.update(function (state) {
      var current = state.progress.levels[result.levelId] || {};
      var stars = calculateStars(result.correct, result.total, result.maxStreak);
      state.progress.levels[result.levelId] = {
        attempts: (current.attempts || 0) + 1,
        bestScore: Math.max(current.bestScore || 0, result.score),
        bestCorrect: Math.max(current.bestCorrect || 0, result.correct),
        stars: Math.max(current.stars || 0, stars),
        completed: true
      };
      state.progress.currentSkillId = result.skillId;
      state.progress.currentLevelId = result.levelId;
      state.lastResult = result;
    });
  }

  function calculateStars(correct, total, maxStreak) {
    var ratio = total ? correct / total : 0;
    if (ratio === 1 && maxStreak >= 5) return 3;
    if (ratio >= 0.8) return 2;
    if (ratio >= 0.5) return 1;
    return 0;
  }
})();
