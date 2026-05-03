import * as React from 'react';

import { logout as logoutRemoteAndClearLocal } from '@/domains/auth/api/auth.service';

let logoutInFlight: Promise<void> | null = null;

/**
 * Full logout: remote revoke (best-effort), local session + React Query clear
 * (see `auth.service`).
 *
 * Navigation to AuthEntry is handled exclusively by navigationGuard, which
 * reacts to the auth store becoming invalid — no nav dispatch here.
 *
 * Idempotent: concurrent callers share one in-flight promise.
 */
export function performAppLogout(): Promise<void> {
  if (logoutInFlight) {
    return logoutInFlight;
  }

  logoutInFlight = (async () => {
    try {
      await logoutRemoteAndClearLocal();
    } finally {
      logoutInFlight = null;
    }
  })();

  return logoutInFlight;
}

/** Stable callback for drawer / settings actions that trigger logout. */
export function useLogout(): () => Promise<void> {
  return React.useCallback(performAppLogout, []);
}
