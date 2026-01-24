// Crypto shim for web - uses browser's crypto API
// This shim provides Node.js crypto API for web environments

let webCrypto;
if (typeof window !== 'undefined' && window.crypto) {
  webCrypto = window.crypto;
} else if (typeof global !== 'undefined' && global.crypto) {
  webCrypto = global.crypto;
}

// randomUUID implementation
const randomUUID = () => {
  if (webCrypto && webCrypto.randomUUID) {
    return webCrypto.randomUUID();
  }
  // Fallback UUID v4 implementation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// getRandomValues implementation
const getRandomValues = (arr) => {
  if (webCrypto && webCrypto.getRandomValues) {
    return webCrypto.getRandomValues(arr);
  }
  // Fallback - fill with Math.random (not cryptographically secure but works)
  for (let i = 0; i < arr.length; i++) {
    arr[i] = Math.floor(Math.random() * 256);
  }
  return arr;
};

module.exports = {
  randomUUID,
  getRandomValues,
  createHash: (algorithm) => {
    const hash = {
      update: () => hash,
      digest: () => '',
    };
    return hash;
  },
  createHmac: (algorithm, key) => {
    const hmac = {
      update: () => hmac,
      digest: () => '',
    };
    return hmac;
  },
  randomBytes: (size) => {
    const arr = new Uint8Array(size);
    getRandomValues(arr);
    // Return Buffer-like object
    return {
      toString: (encoding) => {
        if (encoding === 'hex') {
          return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
        }
        return String.fromCharCode.apply(null, arr);
      },
      length: arr.length,
      [Symbol.iterator]: arr[Symbol.iterator].bind(arr),
    };
  },
};

