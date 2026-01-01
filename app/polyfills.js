import 'react-native-get-random-values';
import 'fast-text-encoding';

import { Buffer } from 'buffer';
global.Buffer = Buffer;

// Polyfill for crypto
import crypto from 'react-native-crypto';
global.crypto = crypto;

// Polyfill for process
if (typeof global.process === 'undefined') {
  global.process = { env: {} };
}

if (typeof global.process.nextTick === 'undefined') {
  global.process.nextTick = setImmediate;
}