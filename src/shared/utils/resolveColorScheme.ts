import type {
  ThemeMode,
  ThemePreference,
} from '@/shared/contracts/theme';

/**
 * Resolves the active palette key from persisted preference and the OS
 * (when preference is "system" → follows OS light/dark only).
 */
export function resolveColorScheme(
  preference: ThemePreference,
  systemScheme: 'light' | 'dark' | null | undefined,
): ThemeMode {
  if (preference !== 'system') {
    return preference;
  }
  return systemScheme === 'dark' ? 'dark' : 'light';
}
