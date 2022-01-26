/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    sourceExts: ['native', 'android.jsx', 'native.jsx', 'jsx', 'android.js', 'native.js', 'js', 'android.ts', 'native.ts', 'ts', 'android.tsx', 'native.tsx', 'tsx', 'android.json', 'native.json', 'json']
  }
};
