const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add node-libs-react-native for WalletConnect compatibility
config.resolver.extraNodeModules = {
  ...require("node-libs-react-native"),
  ...config.resolver.extraNodeModules,
};

module.exports = config;