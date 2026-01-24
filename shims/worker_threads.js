// worker_threads shim for web - minimal MessagePort implementation
const EventEmitter = require("./events");

class MessagePort extends EventEmitter {
  constructor() {
    super();
    this.onmessage = null;
  }

  postMessage(message) {
    // In this shim, just emit 'message' synchronously
    const event = { data: message };
    if (typeof this.onmessage === "function") {
      this.onmessage(event);
    }
    this.emit("message", event);
  }

  close() {
    this.removeAllListeners();
  }

  start() {
    // No-op in this shim
  }
}

module.exports = {
  MessagePort,
};


