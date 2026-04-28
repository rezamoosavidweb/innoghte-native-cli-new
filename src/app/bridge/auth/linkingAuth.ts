import type { NavigationState, PartialState } from '@react-navigation/native';
import { getStateFromPath } from '@react-navigation/native';

import { AuthService } from '@/domains/auth';

/**
 * URL prefixes for `Navigation` `linking.prefixes`. Extend per environment.
 */
export const APP_LINKING_PREFIXES = ['innoghte://'] as const;

function findDeepestNamedRoute(
  state: NavigationState | PartialState<NavigationState>,
): { name: string; params?: Record<string, unknown> } | null {
  const routes = state.routes;
  if (!routes?.length) {
    return null;
  }

  const idx =
    typeof state.index === 'number' ? state.index : routes.length - 1;
  const route = routes[idx];
  if (!route) {
    return null;
  }

  if (route.state) {
    return findDeepestNamedRoute(route.state);
  }

  return {
    name: route.name,
    params: route.params as Record<string, unknown> | undefined,
  };
}

/**
 * Wraps React Navigation `getStateFromPath` so unauthenticated opens can be
 * redirected to Login with a preserved `pendingNavigation` (deep-link ready).
 *
 * Wire the returned function as `linking.getStateFromPath` when you enable linking.
 */
export function createAuthAwareGetStateFromPath(
  baseGetStateFromPath: typeof getStateFromPath,
  options?: Parameters<typeof getStateFromPath>[1],
): typeof getStateFromPath {
  return (path, config) => {
    const state = baseGetStateFromPath(path, config ?? options);

    if (!state || AuthService.isAuthenticated()) {
      return state;
    }

    const leaf = findDeepestNamedRoute(state);
    if (!leaf?.name || leaf.name === 'Login') {
      return state;
    }

    AuthService.setPendingNavigation({
      name: leaf.name,
      params: leaf.params,
    });

    return {
      routes: [{ name: 'Login' as const }],
      index: 0,
    };
  };
}
