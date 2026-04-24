import { Appearance } from 'react-native';
import { create } from 'zustand';
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from 'zustand/middleware';

import { StorageService } from '@/lib/storage.service';

import { UI_THEME_STORAGE_KEY } from '@/stores/uiThemeStorageKey';

export type ThemePreference = 'system' | 'light' | 'dark';

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

export function resolveColorScheme(
  preference: ThemePreference,
  systemScheme: 'light' | 'dark' | null | undefined,
): 'light' | 'dark' {
  if (preference === 'light' || preference === 'dark') {
    return preference;
  }
  return systemScheme === 'dark' ? 'dark' : 'light';
}

/** Useful outside React (e.g. bootstrap) — mirrors default `resolveColorScheme` behaviour. */
export function defaultSystemScheme(): 'light' | 'dark' {
  const system = Appearance.getColorScheme();
  return system === 'dark' ? 'dark' : 'light';
}
