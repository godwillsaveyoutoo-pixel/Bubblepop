(function () {
  window.BP = window.BP || {};

  var KEY = "bubblepop2.state.v4";
  var DEFAULT_STATE = {
    player: { name: "Gast" },
    settings: { sound: true, language: "nl" },
    progress: {
      currentSkillId: "fractions",
      currentLevelId: "fractions.visual.01",
      levels: {}
    },
    lastResult: null
  };

  BP.Store = {
    get: get,
    set: set,
    reset: reset,
    update: update
  };

  function get() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return clone(DEFAULT_STATE);
      return merge(clone(DEFAULT_STATE), JSON.parse(raw));
    } catch (error) {
      console.warn("Store reset because saved state could not be read.", error);
      return clone(DEFAULT_STATE);
    }
  }

  function set(nextState) {
    localStorage.setItem(KEY, JSON.stringify(nextState));
    return nextState;
  }

  function update(mutator) {
    var state = get();
    mutator(state);
    return set(state);
  }

  function reset() {
    localStorage.removeItem(KEY);
    return get();
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function merge(base, patch) {
    Object.keys(patch || {}).forEach(function (key) {
      if (patch[key] && typeof patch[key] === "object" && !Array.isArray(patch[key])) {
        base[key] = merge(base[key] || {}, patch[key]);
      } else {
        base[key] = patch[key];
      }
    });
    return base;
  }
})();
