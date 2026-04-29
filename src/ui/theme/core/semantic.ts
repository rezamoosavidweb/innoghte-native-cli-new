/**
 * Legacy `semantic.{light, dark}` shape. Kept as a thin adapter over the
 * single source of truth in `@/ui/theme/dark` + `@/ui/theme/light` so older
 * call sites (`pickSemantic(dark)` → `s.danger`, `s.headerBg`, ...) keep
 * compiling while we finish migrating screens to `theme.colors.*`.
 *
 * Do **not** add new keys here — extend {@link ThemeColors} and the dark
 * theme file instead.
 */

import { darkColors } from '@/ui/theme/dark';
import { lightColors } from '@/ui/theme/light';
import type { ColorSchemeName, ThemeColors } from '@/ui/theme/types';

export type { ColorSchemeName } from '@/ui/theme/types';

export const semantic: Readonly<Record<ColorSchemeName, ThemeColors>> = Object.freeze({
  light: lightColors,
  dark: darkColors,
});

export type SemanticColors = ThemeColors;
