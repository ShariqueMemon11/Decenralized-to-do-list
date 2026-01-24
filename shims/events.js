// Events shim for web - provides EventEmitter API
class EventEmitter {
  constructor() {
    this._events = {};
  }

  on(event, listener) {
    if (!this._events[event]) {
      this._events[event] = [];
    }
    this._events[event].push(listener);
    return this;
  }

  once(event, listener) {
    const onceWrapper = (...args) => {
      listener.apply(this, args);
      this.removeListener(event, onceWrapper);
    };
    this.on(event, onceWrapper);
    return this;
  }

  emit(event, ...args) {
    if (this._events[event]) {
      this._events[event].forEach(listener => {
        try {
          listener.apply(this, args);
        } catch (err) {
          // Ignore errors
        }
      });
    }
    return this;
  }

  removeListener(event, listener) {
    if (this._events[event]) {
      this._events[event] = this._events[event].filter(l => l !== listener);
    }
    return this;
  }

  removeAllListeners(event) {
    if (event) {
      delete this._events[event];
    } else {
      this._events = {};
    }
    return this;
  }

  listeners(event) {
    return this._events[event] || [];
  }

  listenerCount(event) {
    return (this._events[event] || []).length;
  }
}

module.exports = EventEmitter;
module.exports.EventEmitter = EventEmitter;

