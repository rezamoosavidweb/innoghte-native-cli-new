/* eslint-env jest */
// Reanimated's published mock imports the real `index` (loads native worklets). Use worklets' mock instead.
jest.mock('react-native-worklets', () =>
  require('react-native-worklets/lib/module/mock.js'),
);

// The package entry is untranspiled ESM and its native view is irrelevant to
// the App smoke test. Represent it with a regular React Native View.
jest.mock('react-native-linear-gradient', () => {
  const { View } = require('react-native');
  return View;
});

jest.mock('react-native-webview', () => {
  const { View } = require('react-native');
  return { WebView: View, default: View };
});

jest.mock('react-native-image-picker', () => ({
  launchCamera: jest.fn(),
  launchImageLibrary: jest.fn(),
}));
