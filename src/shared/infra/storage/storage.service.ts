import { storage } from '@/shared/infra/storage/storage.default';

export const StorageService = {
  set(key: string, value: unknown) {
    storage.set(key, JSON.stringify(value));
  },

  get<T>(key: string): T | null {
    const value = storage.getString(key);
    return value ? (JSON.parse(value) as T) : null;
  },

  remove(key: string) {
    storage.remove(key);
  },

  /**
   * Raw string read/write for values that are already serialized (e.g. Zustand
   * `createJSONStorage`, which stores JSON text).
   */
  setString(key: string, value: string) {
    storage.set(key, value);
  },

  getString(key: string): string | null {
    const value = storage.getString(key);
    return value ?? null;
  },
};
