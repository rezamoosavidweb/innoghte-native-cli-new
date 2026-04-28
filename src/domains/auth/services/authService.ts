import { getAccessToken } from '@/domains/auth/api/auth.storage';
import { login, logout } from '@/domains/auth/api/auth.service';
import {
  useAuthStore,
  type PendingNavigation,
} from '@/domains/auth/model/auth.store';
import type { LoginBodyType, LoginResponse } from '@/domains/auth/model/apiTypes';

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
  /** Clear local auth state without calling the logout endpoint (used by 401 handler). */
  clearLocalAuth: (): void => useAuthStore.getState().logout(),

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
