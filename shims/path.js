module.exports = {
  join: (...args) => args.join('/'),
  resolve: (...args) => args.join('/'),
  dirname: (p) => p,
  basename: (p) => p,
  extname: (p) => ''
};
