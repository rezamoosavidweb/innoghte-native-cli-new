import type { Theme } from '@react-navigation/native';

import type { ThemeMode } from '@/shared/contracts/theme';

/** React Navigation theme plus our palette key (set on every built navigation bundle). */
export type NavigationThemeWithScheme = Theme & { appScheme?: ThemeMode };
