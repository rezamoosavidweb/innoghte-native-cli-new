import { useAuthStore } from '@/domains/auth/model/auth.store';

export type AuthStoreSnapshot = {
  isAuthenticated: boolean;
  accessToken: string | null;
};

function snapshotFromState(s: {
  isAuthenticated: boolean;
  accessToken: string | null;
}): AuthStoreSnapshot {
  return {
    isAuthenticated: s.isAuthenticated,
    accessToken: s.accessToken,
  };
}

/**
 * INTERNAL USE ONLY — infra / bridge layer (navigationGuard, HTTP client, native bridges).
 * Do NOT import this in feature domains or screens; use AuthService from @/domains/auth instead.
 *
 * The underlying source of truth is `useAuthStore` (Zustand + MMKV); session mutations
 * stay in login / logout / 401 flows — do not fork parallel flags here.
 */
export const authStore = {
  /** Full Zustand slice (includes pending navigation helpers). */
  getState: () => useAuthStore.getState(),

  getSnapshot(): AuthStoreSnapshot {
    return snapshotFromState(useAuthStore.getState());
  },

  get isAuthenticated(): boolean {
    return useAuthStore.getState().isAuthenticated;
  },

  /**
   * Fail-safe session check: both token and flag must be set.
   * Prevents protected access if persisted state is partially corrupted.
   */
  get isSessionValid(): boolean {
    const s = useAuthStore.getState();
    return Boolean(s.accessToken) && s.isAuthenticated;
  },

  subscribe(
    listener: (snapshot: AuthStoreSnapshot, prev: AuthStoreSnapshot) => void,
  ): () => void {
    return useAuthStore.subscribe((s, p) =>
      listener(snapshotFromState(s), snapshotFromState(p)),
    );
  },
};
