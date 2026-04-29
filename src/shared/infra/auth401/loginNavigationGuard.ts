import { getAuth401AccessToken } from '@/shared/infra/auth401/configureBridge';
import { isOnLoginScreen } from '@/shared/infra/auth401/captureRoute';
import { navigationRef } from '@/shared/infra/navigation/navigationRef';

/**
 * Coalesces parallel 401 → Login redirects into a single `navigate('Login')`.
 * Module state only; no React subscriptions.
 */
let auth401LoginNavigationInFlight = false;
let whenReadyTeardown: (() => void) | null = null;
let loginArrivalTeardown: (() => void) | null = null;

function clearLoginArrivalListener(): void {
  if (loginArrivalTeardown) {
    loginArrivalTeardown();
    loginArrivalTeardown = null;
  }
}

export function resetAuth401LoginNavigationGuard(): void {
  auth401LoginNavigationInFlight = false;
  clearLoginArrivalListener();
  if (whenReadyTeardown) {
    whenReadyTeardown();
    whenReadyTeardown = null;
  }
}

function scheduleNavigateToLoginWhenNavReady(): void {
  if (whenReadyTeardown) {
    return;
  }
  const nav = navigationRef;
  const unsub = nav.addListener('state', () => {
    if (!nav.isReady()) {
      return;
    }
    whenReadyTeardown = null;
    unsub();
    safeNavigateToLoginFrom401();
  });
  whenReadyTeardown = () => {
    unsub();
  };
}

/**
 * Drop the "navigating" latch once Login is focused so guest users who leave Login
 * can receive a fresh 401 redirect later.
 */
function attachLoginArrivalLatch(): void {
  clearLoginArrivalListener();
  const nav = navigationRef;
  const unsub = nav.addListener('state', () => {
    if (!nav.isReady()) {
      return;
    }
    if (isOnLoginScreen()) {
      auth401LoginNavigationInFlight = false;
      clearLoginArrivalListener();
    }
  });
  loginArrivalTeardown = () => {
    unsub();
  };
}

/**
 * Single funnel for 401-driven Login navigation: handles parallel 401s, ref not ready,
 * and skips when already showing Login or session is valid again.
 */
export function safeNavigateToLoginFrom401(): void {
  if (getAuth401AccessToken()) {
    resetAuth401LoginNavigationGuard();
    return;
  }

  if (!navigationRef.isReady()) {
    scheduleNavigateToLoginWhenNavReady();
    return;
  }

  if (isOnLoginScreen()) {
    return;
  }

  if (auth401LoginNavigationInFlight) {
    return;
  }

  auth401LoginNavigationInFlight = true;
  navigationRef.navigate('Login');
  if (isOnLoginScreen()) {
    auth401LoginNavigationInFlight = false;
    return;
  }
  attachLoginArrivalLatch();
}
