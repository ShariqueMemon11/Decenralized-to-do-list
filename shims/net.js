// Net shim for web - minimal net module
module.exports = {
  createServer: () => ({
    listen: () => {},
    close: () => {},
  }),
  createConnection: () => ({
    on: () => {},
    write: () => {},
    end: () => {},
  }),
  connect: () => ({
    on: () => {},
    write: () => {},
    end: () => {},
  }),
};

