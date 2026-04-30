import { semantic } from '@/ui/theme/core/semantic';
import type { NavigationThemeWithScheme } from '@/ui/theme/navigationThemeContract';
import type { ColorSchemeName, ThemeColors } from '@/ui/theme/types';

/**
 * Resolves semantic colors for chrome that must match the active palette
 * (not just light vs dark). Requires `theme.appScheme` from our navigation bundle.
 */
export function pickSemantic(theme: NavigationThemeWithScheme): ThemeColors {
  const scheme = theme.appScheme;
  if (scheme !== undefined && scheme in semantic) {
    return semantic[scheme as ColorSchemeName];
  }
  return theme.dark ? semantic.dark : semantic.light;
}
