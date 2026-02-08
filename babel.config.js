module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      'babel-preset-expo',        // Expo preset
      'nativewind/babel',         // NativeWind support
    ],
    plugins: [
      'react-native-reanimated/plugin', // MUST be last for Reanimated 3+
    ],
  };
};
