class AsyncResource {
  constructor() {}
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.apply(thisArg, args);
  }
  emitBefore() {}
  emitAfter() {}
}

module.exports = { AsyncResource };

