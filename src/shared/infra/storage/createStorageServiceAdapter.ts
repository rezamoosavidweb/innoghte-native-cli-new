import type { StateStorage } from 'zustand/middleware';

import { StorageService } from '@/shared/infra/storage/storage.service';

/**
 * Zustand `StateStorage` backed by the default (non-secure) `StorageService` / MMKV.
 */
export function createStorageServiceStateStorage(): StateStorage {
  return {
    getItem: name => StorageService.getString(name),
    setItem: (name, value) => {
      StorageService.setString(name, value);
    },
    removeItem: name => {
      StorageService.remove(name);
    },
  };
}
