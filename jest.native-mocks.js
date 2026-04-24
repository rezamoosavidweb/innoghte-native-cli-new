/* eslint-env jest */
// Reanimated's published mock imports the real `index` (loads native worklets). Use worklets' mock instead.
jest.mock('react-native-worklets', () =>
  require('react-native-worklets/lib/module/mock.js'),
);
