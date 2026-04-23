import { createMMKV } from 'react-native-mmkv';

/** Default MMKV instance (react-native-mmkv v4 uses `createMMKV`, not `new MMKV`). */
export const storage = createMMKV();
