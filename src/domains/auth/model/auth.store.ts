import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import {
  clearAccessToken,
  setAccessToken,
} from '@/domains/auth/api/auth.storage';
import { zustandMMKVStorage } from '@/shared/infra/storage/zustand-mmkv-storage';

export type PendingNavigation = {
  name: string;
  params?: Record<string, unknown>;
};

type AuthStoreState = {
  isAuthenticated: boolean;
  accessToken: string | null;
  pendingNavigation: PendingNavigation | null;
  setAuth: (payload: { accessToken: string }) => void;
  logout: () => void;
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
        setAccessToken(accessToken);
        set({
          accessToken,
          isAuthenticated: true,
        });
      },

      logout: () => {
        clearAccessToken();
        set({
          accessToken: null,
          isAuthenticated: false,
          pendingNavigation: null,
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
      name: 'innoghte-auth',
      storage: createJSONStorage(() => zustandMMKVStorage),
      partialize: state => ({
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error || !state?.accessToken) {
          return;
        }
        setAccessToken(state.accessToken);
      },
    },
  ),
);
