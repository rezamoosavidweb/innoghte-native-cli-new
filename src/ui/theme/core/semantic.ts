/**
 * Role → color map per registered palette. Thin view over {@link themes} so
 * `pickSemantic(useTheme())` can resolve any scheme via `theme.appScheme`.
 */

import { themes } from '@/ui/theme/registry';
import type { ColorSchemeName, ThemeColors } from '@/ui/theme/types';

export type { ColorSchemeName } from '@/ui/theme/types';

const semanticEntries = (Object.keys(themes) as ColorSchemeName[]).map(
  (key): [ColorSchemeName, ThemeColors] => [key, themes[key].colors],
);

export const semantic: Readonly<Record<ColorSchemeName, ThemeColors>> =
  Object.freeze(
    Object.fromEntries(semanticEntries),
  ) as Readonly<Record<ColorSchemeName, ThemeColors>>;

export type SemanticColors = ThemeColors;
