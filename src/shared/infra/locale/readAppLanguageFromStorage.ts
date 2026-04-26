import { StorageService } from '@/shared/infra/storage/storage.service';
import type { AppLanguage } from '@/shared/contracts/locale';
import { LANGUAGE_STORAGE_KEY } from '@/shared/infra/persistence/appStorageKeys';

/**
 * Reads the same persisted shape Zustand `persist` writes for `awesome-language`.
 */
export function readAppLanguageFromStorage(): AppLanguage {
  try {
    const raw = StorageService.getString(LANGUAGE_STORAGE_KEY);
    if (!raw) {
      return 'fa';
    }
    const parsed = JSON.parse(raw) as {
      state?: { currentLanguage?: string };
    };
    const lng = parsed?.state?.currentLanguage;
    return lng === 'en' ? 'en' : 'fa';
  } catch {
    return 'fa';
  }
}
