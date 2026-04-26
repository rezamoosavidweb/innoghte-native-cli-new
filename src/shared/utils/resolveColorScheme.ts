import type { ThemePreference } from '@/shared/contracts/theme';

/**
 * Resolves a concrete light/dark scheme from persisted preference and the OS
 * (when preference is "system").
 */
export function resolveColorScheme(
  preference: ThemePreference,
  systemScheme: 'light' | 'dark' | null | undefined,
): 'light' | 'dark' {
  if (preference === 'light' || preference === 'dark') {
    return preference;
  }
  return systemScheme === 'dark' ? 'dark' : 'light';
}
