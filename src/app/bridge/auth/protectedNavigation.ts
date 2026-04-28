import type { NavigationAction } from '@react-navigation/native';
import {
  CommonActions,
  StackActions,
} from '@react-navigation/native';

import { AuthService, type PendingNavigation } from '@/domains/auth';
import { navigationRef } from '@/shared/infra/navigation/navigationRef';
import type {
  AppLeafRouteName,
  LeafRouteParams,
  TabParamList,
} from '@/shared/contracts/navigationApp';

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
  AuthService.setPendingNavigation({
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
  if (AuthService.isAuthenticated()) {
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

export const navigateProtected = protectedNavigate;

export function protectedPush<N extends AppLeafRouteName>(
  navigation: NavigateDispatchable & {
    push?: (screen: string, params?: object) => void;
  },
  name: N,
  params?: LeafRouteParams<N>,
): void {
  if (!AuthService.isAuthenticated()) {
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

export function protectedDispatch(
  navigation: NavigateDispatchable,
  action: NavigationAction,
): void {
  if (AuthService.isAuthenticated()) {
    navigation.dispatch(action);
    return;
  }

  const pending = pendingFromNavigateLikeAction(action);
  if (pending && pending.name !== 'Login') {
    AuthService.setPendingNavigation(pending);
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

export function completePendingAuthNavigation(): void {
  const nav = navigationRef.current;
  if (!nav) {
    return;
  }

  const run = () => {
    const pending = AuthService.consumePendingNavigation();
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
    if (pendingAuthNavigationUnsubscribe) {
      return;
    }
    const unsub = nav.addListener('state', () => {
      if (!nav.isReady()) {
        return;
      }
      pendingAuthNavigationUnsubscribe = null;
      unsub();
      run();
    });
    pendingAuthNavigationUnsubscribe = unsub;
  }
}

let pendingAuthNavigationUnsubscribe: (() => void) | null = null;

export { StackActions };
