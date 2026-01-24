const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver = {
  ...config.resolver,
  extraNodeModules: {
    ...(config.resolver?.extraNodeModules || {}),
    // Assert
    assert: require.resolve("./shims/assert.js"),
    "node:assert": require.resolve("./shims/assert.js"),
    // Crypto
    crypto: require.resolve("./shims/crypto.js"),
    "node:crypto": require.resolve("./shims/crypto.js"),
    // Buffer
    buffer: require.resolve("./shims/buffer.js"),
    "node:buffer": require.resolve("./shims/buffer.js"),
    // Events
    events: require.resolve("./shims/events.js"),
    "node:events": require.resolve("./shims/events.js"),
    // Stream
    stream: require.resolve("./shims/stream.js"),
    "node:stream": require.resolve("./shims/stream.js"),
    // TLS
    tls: require.resolve("./shims/tls.js"),
    "node:tls": require.resolve("./shims/tls.js"),
    // TLS
    tls: require.resolve("./shims/tls.js"),
    "node:tls": require.resolve("./shims/tls.js"),
    // OS
    os: require.resolve("./shims/os.js"),
    "node:os": require.resolve("./shims/os.js"),
    // TTY
    tty: require.resolve("./shims/tty.js"),
    "node:tty": require.resolve("./shims/tty.js"),
    // Path
    path: require.resolve("./shims/path.js"),
    "node:path": require.resolve("./shims/path.js"),
    // FS
    fs: require.resolve("./shims/fs.js"),
    "node:fs": require.resolve("./shims/fs.js"),
    // Util (map to directory so subpath 'types' resolves)
    util: require.resolve("./shims/util"),
    "node:util": require.resolve("./shims/util"),
    // Util types explicit mapping
    "util/types": require.resolve("./shims/util/types.js"),
    "node:util/types": require.resolve("./shims/util/types.js"),
    // Querystring
    querystring: require.resolve("./shims/querystring.js"),
    "node:querystring": require.resolve("./shims/querystring.js"),
    // Querystring
    querystring: require.resolve("./shims/querystring.js"),
    "node:querystring": require.resolve("./shims/querystring.js"),
    // URL
    url: require.resolve("./shims/url.js"),
    "node:url": require.resolve("./shims/url.js"),
    // Net
    net: require.resolve("./shims/net.js"),
    "node:net": require.resolve("./shims/net.js"),
    // HTTP
    http: require.resolve("./shims/http.js"),
    "node:http": require.resolve("./shims/http.js"),
    // HTTPS
    https: require.resolve("./shims/https.js"),
    "node:https": require.resolve("./shims/https.js"),
    // DNS
    dns: require.resolve("./shims/dns.js"),
    "node:dns": require.resolve("./shims/dns.js"),
    // Diagnostics Channel
    diagnostics_channel: require.resolve("./shims/diagnostics_channel.js"),
    "node:diagnostics_channel": require.resolve("./shims/diagnostics_channel.js"),
    // Worker Threads
    "worker_threads": require.resolve("./shims/worker_threads.js"),
    "node:worker_threads": require.resolve("./shims/worker_threads.js"),
    // Zlib
    zlib: require.resolve("./shims/zlib.js"),
    "node:zlib": require.resolve("./shims/zlib.js"),
    // Async Hooks
    async_hooks: require.resolve("./shims/async_hooks.js"),
    "node:async_hooks": require.resolve("./shims/async_hooks.js"),
    // Console
    console: require.resolve("./shims/console.js"),
    "node:console": require.resolve("./shims/console.js"),
    // Perf hooks
    perf_hooks: require.resolve("./shims/perf_hooks.js"),
    "node:perf_hooks": require.resolve("./shims/perf_hooks.js"),
  },
};

module.exports = config;
