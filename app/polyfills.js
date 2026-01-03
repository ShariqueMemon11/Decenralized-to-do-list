import 'react-native-get-random-values';
import 'fast-text-encoding';

import { Buffer } from 'buffer';
global.Buffer = Buffer;

// Crypto polyfill using Expo's built-in crypto (required for WalletConnect v2)
import * as ExpoCrypto from 'expo-crypto';
if (typeof global.crypto === 'undefined') {
  global.crypto = {
    getRandomValues: (arr) => {
      const randomBytes = ExpoCrypto.getRandomBytes(arr.length);
      arr.set(randomBytes);
      return arr;
    },
    subtle: {},
  };
}

// Polyfill for process
if (typeof global.process === 'undefined') {
  global.process = { env: {} };
}

if (typeof global.process.nextTick === 'undefined') {
  global.process.nextTick = setImmediate;
}