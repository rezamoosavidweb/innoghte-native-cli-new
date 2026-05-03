/** Inlined at bundle time via babel (see `babel.config.js`). */
declare namespace NodeJS {
  interface ProcessEnv {
    /** Region selector — `'ir'` for Iran build, absent/other for international. Inlined at compile time. */
    REACT_NATIVE_IS_DOT_IR?: string;

    /** API base URL. Falls back to the staging server when absent. */
    REACT_NATIVE_API_URL?: string;

    /** Payment gateway visibility flags. */
    REACT_NATIVE_IS_SHOW_ZARINPAL?: string;
    REACT_NATIVE_IS_SHOW_VANDAR?: string;

    /** MMKV encryption. Encryption is disabled when key is absent or empty. */
    MMKV_ENCRYPTION_KEY?: string;
    REACT_NATIVE_MMKV_ENCRYPTION_KEY?: string;
    MMKV_ENCRYPTION_ENABLED?: string;
    MMKV_ENCRYPTION_TYPE?: string;

    /** Enable verbose MMKV storage logging in development. */
    MMKV_STORAGE_DEBUG?: string;
  }
}

declare const process: { env: NodeJS.ProcessEnv };
