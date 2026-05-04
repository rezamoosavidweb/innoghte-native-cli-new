import { darkTheme } from '@/ui/theme/dark';
import { lightTheme } from '@/ui/theme/light';
import type { AppTheme, ColorSchemeName } from '@/ui/theme/types';

export const themes: Readonly<Record<ColorSchemeName, AppTheme>> = Object.freeze({
  dark: darkTheme,
  light: lightTheme,
});

/** Resolve a registered theme by name. Defaults to light when called blank. */
export function getTheme(scheme: ColorSchemeName = 'light'): AppTheme {
  return themes[scheme];
}
