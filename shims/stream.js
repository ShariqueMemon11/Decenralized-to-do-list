// Stream shim for web - minimal stream implementation
const EventEmitter = require('./events');

class Stream extends EventEmitter {
  pipe(dest, options) {
    return dest;
  }
}

class Readable extends Stream {
  read() {
    return null;
  }
}

class Writable extends Stream {
  write(chunk, encoding, cb) {
    return true;
  }
}

class Duplex extends Stream {
  read() {
    return null;
  }
  write(chunk, encoding, cb) {
    return true;
  }
}

module.exports = {
  Stream,
  Readable,
  Writable,
  Duplex,
  Transform: Duplex,
  PassThrough: Duplex,
};

