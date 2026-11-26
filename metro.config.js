const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push("cjs");

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith("@firebase/") || moduleName === "firebase" || moduleName.startsWith("firebase/")) {
    return context.resolveRequest(
      { ...context, unstable_enablePackageExports: false },
      moduleName,
      platform
    );
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;