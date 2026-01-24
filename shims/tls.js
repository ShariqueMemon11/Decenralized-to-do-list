// TLS shim for web - minimal implementation for undici
const net = require("./net");

module.exports = {
  // For HTTPS connections, undici checks for tls.connect
  connect: (options, callback) => {
    const socket = net.connect(options);
    if (callback) callback();
    return socket;
  },
  createSecureContext: () => ({}),
  TLSSocket: function (socket, options) {
    this.socket = socket;
    this.encrypted = true;
    this.authorized = true;
  },
};
