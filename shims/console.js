class Console {
  constructor(stdout, stderr) {
    this._stdout = stdout;
    this._stderr = stderr;
  }
  log(...args) { console.log(...args); }
  error(...args) { console.error(...args); }
  warn(...args) { console.warn(...args); }
  info(...args) { console.info(...args); }
  dir(...args) { console.dir(...args); }
}

module.exports = { Console };
