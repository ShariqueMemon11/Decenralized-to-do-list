// zlib shim for web - minimal stub implementation
// undici only checks for presence; we don't perform real compression here.

function passthrough(buffer) {
  return buffer;
}

module.exports = {
  deflateSync: passthrough,
  deflate: (buffer, cb) => {
    if (typeof cb === "function") cb(null, passthrough(buffer));
  },
  inflateSync: passthrough,
  inflate: (buffer, cb) => {
    if (typeof cb === "function") cb(null, passthrough(buffer));
  },
  gzipSync: passthrough,
  gzip: (buffer, cb) => {
    if (typeof cb === "function") cb(null, passthrough(buffer));
  },
  gunzipSync: passthrough,
  gunzip: (buffer, cb) => {
    if (typeof cb === "function") cb(null, passthrough(buffer));
  },
};


