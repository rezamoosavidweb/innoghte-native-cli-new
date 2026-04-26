import RNRestart from 'react-native-restart';
import { create } from 'zustand';
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from 'zustand/middleware';

import { StorageService } from '@/shared/infra/storage/storage.service';
import type { AppLanguage } from '@/shared/contracts/locale';
import { i18n, initI18n } from '@/shared/infra/i18n';
import { applyRtlForLanguage, isRtlLanguage } from '@/shared/infra/i18n/i18n-rtl';

import { LANGUAGE_STORAGE_KEY } from '@/domains/settings/model/languageStorageKey';

const languagePersistStorage: StateStorage = {
  getItem: (name) => StorageService.getString(name),
  setItem: (name, value) => {
    StorageService.setString(name, value);
  },
  removeItem: (name) => {
    StorageService.remove(name);
  },
};

type LanguageState = {
  currentLanguage: AppLanguage;
  setLanguage: (lang: AppLanguage) => Promise<void>;
};

/** Ensures language is on disk before `RNRestart` (Zustand persist writes can lag). */
function persistLanguageSnapshot(lang: AppLanguage): void {
  StorageService.setString(
    LANGUAGE_STORAGE_KEY,
    JSON.stringify({ state: { currentLanguage: lang }, version: 0 }),
  );
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      currentLanguage: 'fa',
      setLanguage: async (lang) => {
        const prev = get().currentLanguage;
        if (prev === lang) {
          return;
        }

        await i18n.changeLanguage(lang);
        set({ currentLanguage: lang });
        applyRtlForLanguage(lang);

        const rtlChanged = isRtlLanguage(prev) !== isRtlLanguage(lang);
        if (rtlChanged) {
          persistLanguageSnapshot(lang);
          RNRestart.restart();
        }
      },
    }),
    {
      name: LANGUAGE_STORAGE_KEY,
      storage: createJSONStorage(() => languagePersistStorage),
      partialize: (state) => ({ currentLanguage: state.currentLanguage }),
      /**
       * If persisted language differs from what `index.js` applied (edge cases),
       * align i18n + RTL once Zustand rehydrates.
       */
      onRehydrateStorage: () => (state, error) => {
        if (error || !state) {
          return;
        }
        const lng = state.currentLanguage;
        if (i18n.language !== lng) {
          initI18n(lng)
            .then(() => {
              applyRtlForLanguage(lng);
            })
            .catch(() => {});
        }
      },
    },
  ),
);
