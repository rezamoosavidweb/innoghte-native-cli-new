import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { ZUSTAND_AUTH_PERSIST_KEY } from '@/domains/auth/model/authPersistKey';
import type { PendingNavigation } from '@/shared/contracts/pendingNavigation';
import { zustandMMKVStorage } from '@/shared/infra/storage/zustand-mmkv-storage';

type AuthStoreState = {
  isAuthenticated: boolean;
  accessToken: string | null;
  pendingNavigation: PendingNavigation | null;
  setAuth: (payload: { accessToken: string }) => void;
  logout: () => void;
  /** Clear token/session only (401 path). Does not clear `pendingNavigation`. */
  clearSessionTokensOnly: () => void;
  /** Replace any queued post-login target (last intent wins). */
  setPendingNavigation: (target: PendingNavigation | null) => void;
  /** Read and clear pending navigation (call after successful login). */
  consumePendingNavigation: () => PendingNavigation | null;
};

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      accessToken: null,
      pendingNavigation: null,

      setAuth: ({ accessToken }) => {
        set({
          accessToken,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          accessToken: null,
          isAuthenticated: false,
          pendingNavigation: null,
        });
      },

      clearSessionTokensOnly: () => {
        set({
          accessToken: null,
          isAuthenticated: false,
        });
      },

      setPendingNavigation: target => set({ pendingNavigation: target }),

      consumePendingNavigation: () => {
        const next = get().pendingNavigation;
        set({ pendingNavigation: null });
        return next;
      },
    }),
    {
      name: ZUSTAND_AUTH_PERSIST_KEY,
      storage: createJSONStorage(() => zustandMMKVStorage),
      partialize: state => ({
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
      }),
    },
  ),
);
