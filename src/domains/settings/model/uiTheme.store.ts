import { Appearance } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { createStorageServiceStateStorage } from '@/shared/infra/storage/createStorageServiceAdapter';
import type { ThemePreference } from '@/shared/contracts/theme';

import { UI_THEME_STORAGE_KEY } from '@/domains/settings/model/uiThemeStorageKey';

export type { ThemePreference } from '@/shared/contracts/theme';

type UiThemeState = {
  preference: ThemePreference;
  setPreference: (p: ThemePreference) => void;
};

const uiThemePersistStorage = createStorageServiceStateStorage();

export const useUiThemeStore = create<UiThemeState>()(
  persist(
    set => ({
      preference: 'system',
      setPreference: p => set({ preference: p }),
    }),
    {
      name: UI_THEME_STORAGE_KEY,
      storage: createJSONStorage(() => uiThemePersistStorage),
      partialize: state => ({ preference: state.preference }),
    },
  ),
);

export { resolveColorScheme } from '@/shared/utils/resolveColorScheme';

/** Useful outside React (e.g. bootstrap) — mirrors default `resolveColorScheme` behaviour. */
export function defaultSystemScheme(): 'light' | 'dark' {
  const system = Appearance.getColorScheme();
  return system === 'dark' ? 'dark' : 'light';
}
