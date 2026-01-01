const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  crypto: require.resolve('react-native-crypto'),
  stream: require.resolve('readable-stream'),
  buffer: require.resolve('buffer'),
  'crypto-browserify': require.resolve('crypto-browserify'),
  'stream-browserify': require.resolve('stream-browserify'),
};

module.exports = config;