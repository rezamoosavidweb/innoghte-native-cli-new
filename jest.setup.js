/* eslint-env jest */
jest.mock('react-native-mmkv', () => ({
  createMMKV: jest.fn(() => ({
    set: jest.fn(),
    getString: jest.fn(),
    remove: jest.fn(),
  })),
}));
