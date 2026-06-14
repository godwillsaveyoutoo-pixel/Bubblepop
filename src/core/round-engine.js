(function () {
  window.BP = window.BP || {};

  BP.RoundEngine = {
    create: createRound
  };

  function createRound(config) {
    var questions = (config.questions || []).slice(0, config.roundSize || 10);
    var state = {
      skillId: config.skillId,
      levelId: config.levelId,
      levelTitle: config.levelTitle,
      index: 0,
      total: questions.length,
      score: 0,
      streak: 0,
      maxStreak: 0,
      correct: 0,
      mistakes: 0,
      startTime: Date.now(),
      answered: false,
      lastAnswer: null
    };

    return {
      getState: function () { return clone(state); },
      getQuestion: function () { return questions[state.index] || null; },
      mistake: function (payload) {
        if (state.answered) return { locked: true, state: clone(state) };
        state.lastAnswer = {
          payload: clone(payload),
          correct: false
        };
        applyIncorrect(state);
        return { correct: false, state: clone(state) };
      },
      answer: function (payload) {
        if (state.answered) return { locked: true, state: clone(state) };
        var question = questions[state.index];
        var isCorrect = evaluateAnswer(question, payload);

        state.lastAnswer = {
          payload: clone(payload),
          correct: isCorrect
        };
        if (typeof payload === "number") {
          state.lastAnswer.choiceIndex = payload;
        }

        if (isCorrect) {
          state.answered = true;
          state.correct += 1;
          state.streak += 1;
          state.maxStreak = Math.max(state.maxStreak, state.streak);
          state.score += 10 + Math.min(state.streak - 1, 5) * 2;
        } else {
          applyIncorrect(state);
        }

        return { correct: isCorrect, done: false, state: clone(state) };
      },
      next: function () {
        state.index += 1;
        state.answered = false;
        state.lastAnswer = null;
        if (state.index >= state.total) {
          return { done: true, result: buildResult(state) };
        }
        return { done: false, state: clone(state) };
      }
    };
  }

  function applyIncorrect(state) {
    state.answered = false;
    state.mistakes += 1;
    state.streak = 0;
    state.score = Math.max(0, state.score - 3);
  }

  function evaluateAnswer(question, payload) {
    if (!question) return false;

    if (question.answer && question.answer.type === "fraction-sum") {
      var pieces = payload && payload.pieces ? payload.pieces : [];
      if (question.answer.count && pieces.length !== question.answer.count) return false;
      var sum = BP.Fraction.add(pieces);
      return BP.Fraction.equals(sum, question.answer);
    }

    if (question.answer && question.answer.type === "fraction-equals") {
      var fraction = payload && payload.fraction ? payload.fraction : null;
      return BP.Fraction.equals(fraction, question.answer);
    }

    if (question.answer && question.answer.type === "fraction-exact") {
      var exactFraction = payload && payload.fraction ? payload.fraction : null;
      return !!exactFraction &&
        Number(exactFraction.numerator) === Number(question.answer.numerator) &&
        Number(exactFraction.denominator) === Number(question.answer.denominator);
    }

    if (question.answer && question.answer.type === "fraction-fill") {
      return payload &&
        Number(payload.numerator) === Number(question.answer.numerator) &&
        Number(payload.denominator) === Number(question.answer.denominator);
    }

    if (question.answer && question.answer.type === "number-line-position") {
      var expected = Number(question.answer.numerator) / Number(question.answer.denominator);
      var placed = payload && typeof payload.placed === "number" ? payload.placed : (payload && typeof payload.position === "number" ? payload.position : NaN);
      var tolerance = Number(question.tolerance || 0.065);
      return Number.isFinite(placed) && Math.abs(placed - expected) <= tolerance;
    }

    if (question.answer && question.answer.type === "number-line-order") {
      var orderedPositions = payload && Array.isArray(payload.positions) ? payload.positions : [];
      var orderExpectedItems = Array.isArray(question.answer.items) ? question.answer.items : [];
      if (orderedPositions.length !== orderExpectedItems.length) return false;
      var containsAllItems = orderExpectedItems.every(function (expectedItem) {
        return orderedPositions.some(function (position) {
          return BP.Fraction.equals(position, expectedItem);
        });
      });
      if (!containsAllItems) return false;
      var leftToRight = orderedPositions.slice().sort(function (a, b) {
        return Number(a.placed) - Number(b.placed);
      });
      for (var oi = 1; oi < leftToRight.length; oi += 1) {
        var previousValue = Number(leftToRight[oi - 1].numerator) / Number(leftToRight[oi - 1].denominator);
        var currentValue = Number(leftToRight[oi].numerator) / Number(leftToRight[oi].denominator);
        if (previousValue > currentValue) return false;
      }
      return true;
    }

    if (question.answer && question.answer.type === "number-line-multi") {
      var positions = payload && Array.isArray(payload.positions) ? payload.positions : [];
      var expectedItems = Array.isArray(question.answer.items) ? question.answer.items : [];
      if (positions.length !== expectedItems.length) return false;
      var multiTolerance = Number(question.tolerance || 0.055);
      return expectedItems.every(function (expectedItem) {
        var expectedValue = Number(expectedItem.numerator) / Number(expectedItem.denominator);
        return positions.some(function (position) {
          if (!BP.Fraction.equals(position, expectedItem)) return false;
          var placedValue = typeof position.placed === "number" ? position.placed : NaN;
          return Number.isFinite(placedValue) && Math.abs(placedValue - expectedValue) <= multiTolerance;
        });
      });
    }

    if (question.answer && question.answer.type === "quantity-selection") {
      return payload &&
        Number(payload.selectedCount) === Number(question.answer.count) &&
        Number(payload.quantity) === Number(question.answer.quantity);
    }

    if (question.choices) {
      var choice = question.choices[payload];
      return !!(choice && choice.correct);
    }

    return false;
  }

  function buildResult(state) {
    return {
      skillId: state.skillId,
      levelId: state.levelId,
      levelTitle: state.levelTitle,
      correct: state.correct,
      total: state.total,
      score: state.score,
      maxStreak: state.maxStreak,
      mistakes: state.mistakes,
      seconds: Math.round((Date.now() - state.startTime) / 1000),
      completedAt: new Date().toISOString()
    };
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }
})();
