/**
 * Theme registry — single lookup table that resolves a {@link ColorSchemeName}
 * to a fully-built {@link AppTheme}. Adding a future scheme (e.g.
 * `highContrast`) means: build a new theme file, register it here, and
 * update `ColorSchemeName`.
 *
 * The object is frozen and the references are stable across renders; consumers
 * can rely on `themes[scheme] === themes[scheme]` for memoisation.
 */

import { darkTheme } from '@/ui/theme/dark';
import { lightTheme } from '@/ui/theme/light';
import type { AppTheme, ColorSchemeName } from '@/ui/theme/types';

export const themes: Readonly<Record<ColorSchemeName, AppTheme>> = Object.freeze({
  dark: darkTheme,
  light: lightTheme,
});

/** Resolve a registered theme by name. Defaults to dark when called blank. */
export function getTheme(scheme: ColorSchemeName = 'dark'): AppTheme {
  return themes[scheme];
}
