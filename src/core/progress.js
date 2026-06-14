(function () {
  window.BP = window.BP || {};

  BP.Progress = {
    getLevelProgress: getLevelProgress,
    getSkillProgress: getSkillProgress,
    saveRoundResult: saveRoundResult,
    isLevelUnlocked: isLevelUnlocked,
    getContinueLevel: getContinueLevel,
    getNextLevel: getNextLevel
  };

  function getLevelProgress(levelId) {
    var state = BP.Store.get();
    return getLevelProgressFromState(state, levelId);
  }

  function getLevelProgressFromState(state, levelId) {
    return (state.progress.levels && state.progress.levels[levelId]) || {
      attempts: 0,
      bestScore: 0,
      bestCorrect: 0,
      stars: 0,
      completed: false
    };
  }

  function getSkillProgress(skillId) {
    var pack = BP.CONTENT[skillId];
    if (!pack || !pack.levels) return { percent: 0, stars: 0, completed: 0, total: 0, unlocked: 0 };
    var state = BP.Store.get();
    var playableLevels = pack.levels.filter(function (level) { return !level.locked; });
    var total = playableLevels.length;
    var stars = 0;
    var completed = 0;
    var unlocked = 0;
    playableLevels.forEach(function (level) {
      var p = getLevelProgressFromState(state, level.id);
      stars += p.stars || 0;
      if (p.completed) completed += 1;
      if (isLevelUnlockedFromState(state, skillId, level.id)) unlocked += 1;
    });
    return {
      percent: total ? Math.round((completed / total) * 100) : 0,
      stars: stars,
      completed: completed,
      total: total,
      unlocked: unlocked
    };
  }

  function isLevelUnlocked(skillId, levelId) {
    return isLevelUnlockedFromState(BP.Store.get(), skillId, levelId);
  }

  function isLevelUnlockedFromState(state, skillId, levelId) {
    var pack = BP.CONTENT[skillId] || BP.CONTENT.fractions;
    var levels = pack && pack.levels ? pack.levels : [];
    var index = levels.findIndex(function (level) { return level.id === levelId; });
    if (index < 0) return false;
    var level = levels[index];
    if (level.locked) return false;
    if (index === 0) return true;
    var previous = levels[index - 1];
    if (!previous || previous.locked) return false;
    return !!getLevelProgressFromState(state, previous.id).completed;
  }

  function getContinueLevel(skillId) {
    var state = BP.Store.get();
    var pack = BP.CONTENT[skillId] || BP.CONTENT.fractions;
    var levels = pack && pack.levels ? pack.levels : [];

    for (var i = 0; i < levels.length; i += 1) {
      if (levels[i].locked) continue;
      if (!isLevelUnlockedFromState(state, pack.id, levels[i].id)) continue;
      if (!getLevelProgressFromState(state, levels[i].id).completed) return levels[i];
    }

    for (var j = levels.length - 1; j >= 0; j -= 1) {
      if (!levels[j].locked && isLevelUnlockedFromState(state, pack.id, levels[j].id)) return levels[j];
    }
    return levels[0] || null;
  }

  function getNextLevel(skillId, levelId) {
    var state = BP.Store.get();
    return getNextLevelFromState(state, skillId, levelId);
  }

  function getNextLevelFromState(state, skillId, levelId) {
    var pack = BP.CONTENT[skillId] || BP.CONTENT.fractions;
    var levels = pack && pack.levels ? pack.levels : [];
    var index = levels.findIndex(function (level) { return level.id === levelId; });
    if (index < 0) return null;
    for (var i = index + 1; i < levels.length; i += 1) {
      if (!levels[i].locked && isLevelUnlockedFromState(state, pack.id, levels[i].id)) return levels[i];
      if (!levels[i].locked) return null;
    }
    return null;
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
      var nextLevel = getNextLevelFromState(state, result.skillId, result.levelId);
      state.progress.currentLevelId = nextLevel ? nextLevel.id : result.levelId;
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
