const perf = (typeof performance !== "undefined" && performance) || {
  now: () => Date.now(),
  timeOrigin: Date.now(),
};

module.exports = { performance: perf };
