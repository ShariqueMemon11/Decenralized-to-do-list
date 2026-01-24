// HTTP shim for web - minimal http module
const EventEmitter = require('./events');

class ClientRequest extends EventEmitter {
  write() {}
  end() {}
  abort() {}
}

class IncomingMessage extends EventEmitter {
  constructor() {
    super();
    this.headers = {};
    this.statusCode = 200;
  }
}

class ServerResponse extends EventEmitter {
  writeHead() { return this; }
  write() { return true; }
  end() { return this; }
}

class Server extends EventEmitter {
  listen() { return this; }
  close() { return this; }
}

module.exports = {
  request: () => new ClientRequest(),
  get: () => new ClientRequest(),
  createServer: () => new Server(),
  ClientRequest,
  IncomingMessage,
  ServerResponse,
  Server,
};

