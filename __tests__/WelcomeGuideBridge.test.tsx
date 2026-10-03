import * as React from 'react';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';
import { WelcomeGuideBridge } from '@/app/bridge/WelcomeGuideBridge';
import { WelcomeGuide } from '@/domains/onboarding';

jest.mock('@/domains/onboarding', () => ({
  WelcomeGuide: jest.fn(() => null),
}));
jest.mock('@/shared/infra/navigation/navigationRef', () => ({
  navigationRef: {
    isReady: jest.fn(),
    getCurrentRoute: jest.fn(),
    addListener: jest.fn(),
  },
}));

const navigation = jest.requireMock(
  '@/shared/infra/navigation/navigationRef',
).navigationRef;
const listeners = new Map<string, () => void>();
let renderer: ReactTestRenderer;

beforeEach(() => {
  jest.clearAllMocks();
  listeners.clear();
  navigation.isReady.mockReturnValue(false);
  navigation.getCurrentRoute.mockReturnValue({ name: 'Splash' });
  navigation.addListener.mockImplementation(
    (event: string, listener: () => void) => {
      listeners.set(event, listener);
      return () => listeners.delete(event);
    },
  );
});

afterEach(() => {
  act(() => renderer.unmount());
});

test('does not read navigation before initialization; shows the guide only after Splash', () => {
  act(() => {
    renderer = create(<WelcomeGuideBridge />);
  });
  expect(navigation.getCurrentRoute).not.toHaveBeenCalled();
  expect(renderer.root.findByType(WelcomeGuide).props.ready).toBe(false);

  navigation.isReady.mockReturnValue(true);
  act(() => listeners.get('ready')?.());
  expect(renderer.root.findByType(WelcomeGuide).props.ready).toBe(false);

  navigation.getCurrentRoute.mockReturnValue({ name: 'AuthEntry' });
  act(() => listeners.get('state')?.());
  expect(renderer.root.findByType(WelcomeGuide).props.ready).toBe(true);
});

test('allows an initialized deep-link destination and removes subscriptions on unmount', () => {
  navigation.isReady.mockReturnValue(true);
  navigation.getCurrentRoute.mockReturnValue({ name: 'PublicCourseDetail' });
  act(() => {
    renderer = create(<WelcomeGuideBridge />);
  });
  expect(renderer.root.findByType(WelcomeGuide).props.ready).toBe(true);
  act(() => renderer.unmount());
  expect(listeners.size).toBe(0);
});
