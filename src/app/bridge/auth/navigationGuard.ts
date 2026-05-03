import { CommonActions } from '@react-navigation/native';

import { authStore } from '@/domains/auth/store/authStore';
import { getFocusedLeafRouteFromNavigationRef } from '@/shared/infra/auth401/captureRoute';
import { navigationRef } from '@/shared/infra/navigation/navigationRef';

/**
 * Leaf route names that are reachable without a session.
 * Keep in sync with auth / marketing entry flows.
 */
export const PUBLIC_LEAF_ROUTE_NAMES = new Set<string>([
  'Splash',
  'AuthEntry',
  'Login',
  'Register',
  'Verify',
]);

let installed = false;
let enforcing = false;
let navListenerTeardown: (() => void) | null = null;
let authListenerTeardown: (() => void) | null = null;

function enforceUnauthenticatedOnPublicRoutesOnly(): void {
  if (enforcing) {
    return;
  }
  if (!navigationRef.isReady()) {
    return;
  }
  if (authStore.isSessionValid) {
    return;
  }

  const leaf = getFocusedLeafRouteFromNavigationRef();
  if (!leaf) {
    return;
  }
  if (PUBLIC_LEAF_ROUTE_NAMES.has(leaf.name)) {
    return;
  }

  enforcing = true;
  try {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'AuthEntry' }],
      }),
    );
  } finally {
    enforcing = false;
  }
}

function scheduleEnforce(): void {
  Promise.resolve()
    .then(enforceUnauthenticatedOnPublicRoutesOnly)
    .catch(() => {});
}

/**
 * Hard navigation gate: without a valid session, any non-public leaf route
 * forces a root reset to `AuthEntry`. Safe under React Strict Mode (teardown
 * clears listeners and the installed latch).
 *
 * @returns Teardown for tests / hot reload; optional to invoke.
 */
export function installNavigationGuard(): () => void {
  if (installed) {
    return () => undefined;
  }
  installed = true;

  navListenerTeardown = navigationRef.addListener('state', scheduleEnforce);

  authListenerTeardown = authStore.subscribe((next, prev) => {
    const validNow = Boolean(next.accessToken) && next.isAuthenticated;
    const validPrev = Boolean(prev.accessToken) && prev.isAuthenticated;
    if (validNow === validPrev) {
      return;
    }
    scheduleEnforce();
  });

  scheduleEnforce();

  return () => {
    navListenerTeardown?.();
    navListenerTeardown = null;
    authListenerTeardown?.();
    authListenerTeardown = null;
    installed = false;
  };
}
