import type { NavigationState, PartialState } from '@react-navigation/native';

import type { PendingNavigation } from '@/shared/contracts/pendingNavigation';
import { navigationRef } from '@/shared/infra/navigation/navigationRef';

const SKIP_RESUME_ROUTE_NAMES = new Set<string>(['Login', 'Startup']);

function focusedLeafRoute(
  state: NavigationState | PartialState<NavigationState> | undefined,
): { name: string; params?: Record<string, unknown> } | null {
  if (!state?.routes?.length) {
    return null;
  }
  const index = state.index ?? state.routes.length - 1;
  const route = state.routes[index];
  if (!route) {
    return null;
  }
  if (route.state) {
    return focusedLeafRoute(route.state as NavigationState);
  }
  return {
    name: route.name,
    params: route.params as Record<string, unknown> | undefined,
  };
}

/** Deepest focused route from the root navigator (when the container is ready). */
export function getFocusedLeafRouteFromNavigationRef(): {
  name: string;
  params?: Record<string, unknown>;
} | null {
  if (!navigationRef.isReady()) {
    return null;
  }
  return focusedLeafRoute(navigationRef.getRootState());
}

export function isOnLoginScreen(): boolean {
  const leaf = getFocusedLeafRouteFromNavigationRef();
  return leaf?.name === 'Login';
}

/** Small serializable snapshot — only route name + params. */
export function captureResumeRouteFromNavigationRef(): PendingNavigation | null {
  const leaf = getFocusedLeafRouteFromNavigationRef();
  if (!leaf) {
    return null;
  }
  if (SKIP_RESUME_ROUTE_NAMES.has(leaf.name)) {
    return null;
  }
  return {
    name: leaf.name,
    ...(leaf.params !== undefined ? { params: leaf.params } : {}),
  };
}
