module.exports = {
  format: (...args) => args.join(" "),
  inspect: (obj) => JSON.stringify(obj),
  inherits: (ctor, superCtor) => {
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true,
      },
    });
  },
  types: {},
  promisify: (fn) => fn,
};
