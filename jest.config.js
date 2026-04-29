module.exports = {
  preset: '@react-native/jest-preset',
  // Order: Reanimated mock before anything imports drawer/reanimated; RNGH before App.
  setupFiles: [
    '<rootDir>/jest.native-mocks.js',
    require.resolve('react-native-gesture-handler/jestSetup'),
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '\\.svg$': '<rootDir>/__mocks__/svgMock.js',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // Preset only transpiles react-native / @react-native*; @react-navigation ships ESM.
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|react-native-drawer-layout|react-native-reanimated|react-native-worklets|ky)/)',
  ],
};
