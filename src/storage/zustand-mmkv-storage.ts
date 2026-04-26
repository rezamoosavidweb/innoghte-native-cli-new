import { getSecureMMKV } from '@/storage/mmkv';

const LOG_PREFIX = '[zustand-mmkv]';

function storageDebugEnabled(): boolean {
  return readEnvFlag('MMKV_STORAGE_DEBUG');
}

function readEnvFlag(name: string): boolean {
  const v = (globalThis as { process?: { env?: Record<string, string | undefined> } })
    .process?.env?.[name];
  return v === '1' || v === 'true';
}

export type ZustandMMKVStateStorage = {
  setItem: (name: string, value: string) => void;
  getItem: (name: string) => string | null;
  removeItem: (name: string) => void;
};

function createZustandMMKVStateStorage(): ZustandMMKVStateStorage {
  const mmkv = getSecureMMKV();

  return {
    getItem: (name: string) => {
      const value = mmkv.getString(name);
      if (storageDebugEnabled()) {
        console.log(LOG_PREFIX, 'getItem', name, value === undefined ? '(miss)' : '(hit)');
      }
      return value === undefined ? null : value;
    },

    setItem: (name: string, value: string) => {
      if (storageDebugEnabled()) {
        console.log(LOG_PREFIX, 'setItem', name, `(${value.length} chars)`);
      }
      mmkv.set(name, value);
    },

    removeItem: (name: string) => {
      if (storageDebugEnabled()) {
        console.log(LOG_PREFIX, 'removeItem', name);
      }
      mmkv.remove(name);
    },
  };
}

/**
 * Synchronous adapter for `persist(createJSONStorage(() => zustandMMKVStorage))`.
 * Reuses one backing MMKV instance via {@link getSecureMMKV}.
 */
export const zustandMMKVStorage: ZustandMMKVStateStorage =
  createZustandMMKVStateStorage();
