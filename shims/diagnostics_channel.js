// diagnostics_channel shim for web - minimal implementation
// undici uses diagnostics_channel for debug hooks; safe to no-op for web demos.

class Channel {
  constructor(name) {
    this.name = name;
    this._subscribers = new Set();
  }

  subscribe(fn) {
    if (typeof fn === "function") this._subscribers.add(fn);
  }

  unsubscribe(fn) {
    this._subscribers.delete(fn);
  }

  hasSubscribers() {
    return this._subscribers.size > 0;
  }

  publish(message) {
    for (const fn of this._subscribers) {
      try {
        fn(message);
      } catch (_) {
        // ignore subscriber errors
      }
    }
  }
}

function channel(name) {
  return new Channel(name);
}

module.exports = {
  channel,
};


