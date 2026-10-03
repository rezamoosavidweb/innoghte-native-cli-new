import * as React from 'react';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';
import { WelcomeGuideBridge } from '@/app/bridge/WelcomeGuideBridge';
import { WelcomeGuide } from '@/domains/onboarding';

jest.mock('@/domains/auth', () => ({
  useIsAuthenticated: jest.fn(),
  useCurrentUser: jest.fn(),
}));
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
const auth = jest.requireMock('@/domains/auth');
const listeners = new Map<string, () => void>();
let renderer: ReactTestRenderer;

beforeEach(() => {
  jest.clearAllMocks();
  listeners.clear();
  auth.useIsAuthenticated.mockReturnValue(false);
  auth.useCurrentUser.mockReturnValue({ data: undefined });
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

test('waits for initialization, successful login, and navigation away from login', () => {
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
  expect(renderer.root.findByType(WelcomeGuide).props.ready).toBe(false);

  navigation.getCurrentRoute.mockReturnValue({ name: 'Login' });
  act(() => listeners.get('state')?.());
  auth.useIsAuthenticated.mockReturnValue(true);
  auth.useCurrentUser.mockReturnValue({ data: { data: { id: 42 } } });
  act(() => renderer.update(<WelcomeGuideBridge />));
  expect(renderer.root.findByType(WelcomeGuide).props.ready).toBe(false);

  navigation.getCurrentRoute.mockReturnValue({ name: 'Home' });
  act(() => listeners.get('state')?.());
  expect(renderer.root.findByType(WelcomeGuide).props.ready).toBe(true);
  expect(renderer.root.findByType(WelcomeGuide).props.userId).toBe(42);
});

test('allows an authenticated deep-link destination and removes subscriptions on unmount', () => {
  auth.useIsAuthenticated.mockReturnValue(true);
  auth.useCurrentUser.mockReturnValue({ data: { data: { id: 42 } } });
  navigation.isReady.mockReturnValue(true);
  navigation.getCurrentRoute.mockReturnValue({ name: 'PublicCourseDetail' });
  act(() => {
    renderer = create(<WelcomeGuideBridge />);
  });
  expect(renderer.root.findByType(WelcomeGuide).props.ready).toBe(true);
  act(() => renderer.unmount());
  expect(listeners.size).toBe(0);
});

test.each(['Splash', 'AuthEntry', 'Login', 'Register', 'Verify', 'ForgetPassword'])(
  'does not show over %s even if a session exists',
  name => {
    auth.useIsAuthenticated.mockReturnValue(true);
    auth.useCurrentUser.mockReturnValue({ data: { data: { id: 42 } } });
    navigation.isReady.mockReturnValue(true);
    navigation.getCurrentRoute.mockReturnValue({ name });
    act(() => {
      renderer = create(<WelcomeGuideBridge />);
    });
    expect(renderer.root.findByType(WelcomeGuide).props.ready).toBe(false);
  },
);

test('reacts to login and logout even when the route does not change', () => {
  navigation.isReady.mockReturnValue(true);
  navigation.getCurrentRoute.mockReturnValue({ name: 'Home' });
  auth.useCurrentUser.mockReturnValue({ data: { data: { id: 42 } } });
  act(() => {
    renderer = create(<WelcomeGuideBridge />);
  });
  expect(renderer.root.findByType(WelcomeGuide).props.ready).toBe(false);
  expect(renderer.root.findByType(WelcomeGuide).props.userId).toBeNull();

  auth.useIsAuthenticated.mockReturnValue(true);
  act(() => renderer.update(<WelcomeGuideBridge />));
  expect(renderer.root.findByType(WelcomeGuide).props.ready).toBe(true);
  expect(renderer.root.findByType(WelcomeGuide).props.userId).toBe(42);

  auth.useIsAuthenticated.mockReturnValue(false);
  act(() => renderer.update(<WelcomeGuideBridge />));
  expect(renderer.root.findByType(WelcomeGuide).props.ready).toBe(false);
  expect(renderer.root.findByType(WelcomeGuide).props.userId).toBeNull();
});
