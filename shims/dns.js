// DNS shim for web
module.exports = {
  lookup: (hostname, options, callback) => {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    if (callback) {
      callback(null, '127.0.0.1', 4);
    }
  },
  resolve: (hostname, rrtype, callback) => {
    if (typeof rrtype === 'function') {
      callback = rrtype;
      rrtype = 'A';
    }
    if (callback) {
      callback(null, ['127.0.0.1']);
    }
  },
};

