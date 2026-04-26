import { createMMKV, type Configuration, type MMKV } from 'react-native-mmkv';

type ProcessEnv = { env?: Record<string, string | undefined> };

function readEnv(name: string): string | undefined {
  const raw = (globalThis as { process?: ProcessEnv }).process?.env?.[name];
  const v = typeof raw === 'string' ? raw.trim() : '';
  return v.length > 0 ? v : undefined;
}

function resolveEncryptionType(): NonNullable<Configuration['encryptionType']> {
  return readEnv('MMKV_ENCRYPTION_TYPE') === 'AES-256' ? 'AES-256' : 'AES-128';
}

/**
 * Builds MMKV configuration. Encryption is enabled when `MMKV_ENCRYPTION_KEY` (or
 * `REACT_NATIVE_MMKV_ENCRYPTION_KEY`) is set, unless `MMKV_ENCRYPTION_ENABLED` is
 * explicitly `false` / `0`.
 */
export function buildSecureMMKVConfig(): Configuration {
  const encryptionKey =
    readEnv('MMKV_ENCRYPTION_KEY') ?? readEnv('REACT_NATIVE_MMKV_ENCRYPTION_KEY');

  const disabled =
    readEnv('MMKV_ENCRYPTION_ENABLED') === 'false' ||
    readEnv('MMKV_ENCRYPTION_ENABLED') === '0';

  const useEncryption = Boolean(encryptionKey) && !disabled;

  return {
    id: 'innoghte-secure',
    ...(useEncryption && encryptionKey
      ? { encryptionKey, encryptionType: resolveEncryptionType() }
      : {}),
  };
}

let secureMmkv: MMKV | null = null;

/**
 * Lazily initialized singleton for app “secure” storage (Zustand persist, secrets).
 * Separate from the default `mmkv.default` instance used elsewhere.
 */
export function getSecureMMKV(): MMKV {
  if (!secureMmkv) {
    secureMmkv = createMMKV(buildSecureMMKVConfig());
  }
  return secureMmkv;
}

/**
 * Clears every key in the secure MMKV instance. If Zustand has already
 * rehydrated, reset or rehydrate auth (e.g. `logout()`) so memory matches disk.
 */
export function clearAllStorage(): void {
  getSecureMMKV().clearAll();
}
