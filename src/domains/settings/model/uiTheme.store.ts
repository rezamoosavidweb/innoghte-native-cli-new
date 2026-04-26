import { Appearance } from 'react-native';
import { create } from 'zustand';
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from 'zustand/middleware';

import { StorageService } from '@/shared/infra/storage/storage.service';
import type { ThemePreference } from '@/shared/contracts/theme';

import { UI_THEME_STORAGE_KEY } from '@/domains/settings/model/uiThemeStorageKey';

export type { ThemePreference } from '@/shared/contracts/theme';

type UiThemeState = {
  preference: ThemePreference;
  setPreference: (p: ThemePreference) => void;
};

const uiThemePersistStorage: StateStorage = {
  getItem: name => StorageService.getString(name),
  setItem: (name, value) => {
    StorageService.setString(name, value);
  },
  removeItem: name => {
    StorageService.remove(name);
  },
};

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
