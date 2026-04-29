import { getAccessToken } from '@/domains/auth/api/auth.storage';
import { login, logout } from '@/domains/auth/api/auth.service';
import {
  useAuthStore,
  type PendingNavigation,
} from '@/domains/auth/model/auth.store';
import type { LoginBodyType, LoginResponse } from '@/domains/auth/model/apiTypes';
import { resetAuth401LoginNavigationGuard } from '@/shared/infra/auth401/loginNavigationGuard';

export type { PendingNavigation };

/**
 * Public auth surface for cross-domain consumers (app/bridge, navigation,
 * HTTP wiring). Encapsulates the Zustand store — outside the auth domain
 * code MUST go through this service rather than touching `useAuthStore`.
 */
export const AuthService = {
  // — Session —
  login: (body: LoginBodyType): Promise<LoginResponse> => login(body),
  logout: (): Promise<void> => logout(),
  getToken: (): string | null => getAccessToken(),
  isAuthenticated: (): boolean => useAuthStore.getState().isAuthenticated,
  /** Clear local auth state without calling the logout endpoint (used by legacy paths). */
  clearLocalAuth: (): void => {
    useAuthStore.getState().logout();
    resetAuth401LoginNavigationGuard();
  },
  /**
   * Invalidate session but keep `pendingNavigation` (401 resume / protected flows).
   */
  clearSessionTokensOnly: (): void =>
    useAuthStore.getState().clearSessionTokensOnly(),

  // — Pending navigation (post-login resume) —
  setPendingNavigation: (target: PendingNavigation | null): void =>
    useAuthStore.getState().setPendingNavigation(target),
  consumePendingNavigation: (): PendingNavigation | null =>
    useAuthStore.getState().consumePendingNavigation(),
} as const;

/** Reactive hook for components that need to re-render on auth changes. */
export function useIsAuthenticated(): boolean {
  return useAuthStore(s => s.isAuthenticated);
}
