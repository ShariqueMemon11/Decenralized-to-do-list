// Assert shim for web - minimal assert implementation
function assert(value, message) {
  if (!value) {
    throw new Error(message || 'Assertion failed');
  }
}

assert.ok = assert;
assert.equal = (actual, expected, message) => {
  if (actual != expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`);
  }
};
assert.strictEqual = (actual, expected, message) => {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`);
  }
};
assert.notEqual = (actual, expected, message) => {
  if (actual == expected) {
    throw new Error(message || `Expected not ${expected}, got ${actual}`);
  }
};
assert.notStrictEqual = (actual, expected, message) => {
  if (actual === expected) {
    throw new Error(message || `Expected not ${expected}, got ${actual}`);
  }
};
assert.deepEqual = (actual, expected, message) => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(message || `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
};
assert.deepStrictEqual = assert.deepEqual;
assert.ifError = (err) => {
  if (err) throw err;
};
assert.fail = (message) => {
  throw new Error(message || 'Assertion failed');
};
assert.doesNotThrow = (fn, message) => {
  try {
    fn();
  } catch (err) {
    throw new Error(message || `Function threw: ${err.message}`);
  }
};
assert.throws = (fn, message) => {
  try {
    fn();
    throw new Error(message || 'Expected function to throw');
  } catch (err) {
    return err;
  }
};

module.exports = assert;

