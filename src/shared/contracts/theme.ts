/** All selectable app themes (excludes the OS-adaptive 'system' alias). */
export type ThemeMode =
  | 'light'
  | 'dark'
  | 'editorialGray'
  | 'studioDark'
  | 'nighttime'
  | 'steady'
  | 'stoneCalm';

/** User-facing preference — 'system' delegates to the OS colour scheme. */
export type ThemePreference = 'system' | ThemeMode;
