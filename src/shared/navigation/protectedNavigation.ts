import type { NavigationAction } from '@react-navigation/native';
import {
  CommonActions,
  StackActions,
} from '@react-navigation/native';

import { useAuthStore, type PendingNavigation } from '@/auth/auth.store';
import { navigationRef } from '@/shared/navigation/navigationRef';
import type {
  AppLeafRouteName,
  LeafRouteParams,
  TabParamList,
} from '@/shared/navigation/types';

const TAB_ROUTE_NAMES = new Set<keyof TabParamList>([
  'Home',
  'Services',
  'Experiences',
  'Faqs',
  'Profile',
]);

export type { PendingNavigation };

type NavigateDispatchable = {
  dispatch: (action: NavigationAction) => void;
};

function isTabRouteName(name: string): name is keyof TabParamList {
  return TAB_ROUTE_NAMES.has(name as keyof TabParamList);
}

export function navigateToAppLeaf(
  navigation: NavigateDispatchable,
  name: AppLeafRouteName,
  params?: Record<string, unknown> | undefined,
): void {
  if (isTabRouteName(name)) {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'MainTabs',
        params: {
          screen: name,
          params,
        },
      }),
    );
    return;
  }

  navigation.dispatch(CommonActions.navigate({ name, params }));
}

function dispatchLogin(navigation: NavigateDispatchable): void {
  navigation.dispatch(CommonActions.navigate({ name: 'Login' }));
}

function queuePendingIfNeeded(name: AppLeafRouteName, params?: unknown): void {
  if (name === 'Login') {
    return;
  }
  useAuthStore.getState().setPendingNavigation({
    name,
    params:
      params && typeof params === 'object'
        ? (params as Record<string, unknown>)
        : undefined,
  });
}

/**
 * Core helper: navigate to a leaf route, or queue intent and open Login.
 */
export function protectedNavigate<N extends AppLeafRouteName>(
  navigation: NavigateDispatchable,
  name: N,
  params?: LeafRouteParams<N>,
): void {
  if (useAuthStore.getState().isAuthenticated) {
    navigateToAppLeaf(
      navigation,
      name,
      params as Record<string, unknown> | undefined,
    );
    return;
  }

  queuePendingIfNeeded(name, params);
  dispatchLogin(navigation);
}

/** Alias matching the spec naming. */
export const navigateProtected = protectedNavigate;

export function protectedPush<N extends AppLeafRouteName>(
  navigation: NavigateDispatchable & {
    push?: (screen: string, params?: object) => void;
  },
  name: N,
  params?: LeafRouteParams<N>,
): void {
  if (!useAuthStore.getState().isAuthenticated) {
    queuePendingIfNeeded(name, params);
    dispatchLogin(navigation);
    return;
  }

  if (typeof navigation.push === 'function') {
    navigation.push(
      name as string,
      (params ?? undefined) as object | undefined,
    );
    return;
  }

  navigateToAppLeaf(
    navigation,
    name,
    params as Record<string, unknown> | undefined,
  );
}

function pendingFromNavigateLikeAction(
  action: NavigationAction,
): PendingNavigation | null {
  if (
    action.type !== 'NAVIGATE' &&
    action.type !== 'NAVIGATE_DEPRECATED' &&
    action.type !== 'PUSH'
  ) {
    return null;
  }

  const payload = (action as { payload?: { name?: string; params?: object } })
    .payload;
  if (!payload?.name) {
    return null;
  }

  return {
    name: payload.name,
    params: payload.params as Record<string, unknown> | undefined,
  };
}

/**
 * If unauthenticated, intercepts NAVIGATE / PUSH / NAVIGATE_DEPRECATED with a
 * storable target; other actions are passed through (call sites may still fail).
 */
export function protectedDispatch(
  navigation: NavigateDispatchable,
  action: NavigationAction,
): void {
  if (useAuthStore.getState().isAuthenticated) {
    navigation.dispatch(action);
    return;
  }

  const pending = pendingFromNavigateLikeAction(action);
  if (pending && pending.name !== 'Login') {
    useAuthStore.getState().setPendingNavigation(pending);
  }

  if (
    action.type === 'NAVIGATE' ||
    action.type === 'NAVIGATE_DEPRECATED' ||
    action.type === 'PUSH'
  ) {
    dispatchLogin(navigation);
    return;
  }

  navigation.dispatch(action);
}

/**
 * Call from the login success path: resume queued route or `Home` inside main tabs.
 */
export function completePendingAuthNavigation(): void {
  const nav = navigationRef.current;
  if (!nav) {
    return;
  }

  const run = () => {
    const pending = useAuthStore.getState().consumePendingNavigation();
    if (pending) {
      navigateToAppLeaf(
        nav,
        pending.name as AppLeafRouteName,
        pending.params,
      );
    } else {
      navigateToAppLeaf(nav, 'Home');
    }
  };

  if (nav.isReady()) {
    run();
  } else {
    const unsub = nav.addListener('state', () => {
      if (nav.isReady()) {
        unsub();
        run();
      }
    });
  }
}

export { StackActions };
