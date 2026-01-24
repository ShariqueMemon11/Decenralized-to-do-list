module.exports = {
  platform: () => 'web',
  release: () => '1.0.0',
  type: () => 'Web',
  cpus: () => 1,
  freemem: () => 0,
  totalmem: () => 0,
  userInfo: () => ({ username: 'web' }),
  homedir: () => '/',
  tmpdir: () => '/tmp',
  endianness: () => 'LE',
  loadavg: () => [0, 0, 0],
  networkInterfaces: () => ({}),
  hostname: () => 'localhost'
};
