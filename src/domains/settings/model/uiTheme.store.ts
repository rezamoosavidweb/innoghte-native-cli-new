import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { createStorageServiceStateStorage } from '@/shared/infra/storage/createStorageServiceAdapter';
import type { ThemeMode } from '@/shared/contracts/theme';

import { UI_THEME_STORAGE_KEY } from '@/domains/settings/model/uiThemeStorageKey';

export type { ThemeMode } from '@/shared/contracts/theme';
export type { ThemePreference } from '@/shared/contracts/theme';

type UiThemeState = {
  preference: ThemeMode;
  setPreference: (p: ThemeMode) => void;
  toggleTheme: () => void;
};

const uiThemePersistStorage = createStorageServiceStateStorage();

export const useUiThemeStore = create<UiThemeState>()(
  persist(
    set => ({
      preference: 'light',
      setPreference: p => set({ preference: p }),
      toggleTheme: () =>
        set(state => ({ preference: state.preference === 'dark' ? 'light' : 'dark' })),
    }),
    {
      name: UI_THEME_STORAGE_KEY,
      storage: createJSONStorage(() => uiThemePersistStorage),
      partialize: state => ({ preference: state.preference }),
    },
  ),
);
