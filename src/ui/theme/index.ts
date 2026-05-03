/**
 * Public theme API.
 *
 * - **Source of truth:** {@link ./dark} (every semantic token resolves here).
 * - **Light mode:** {@link ./light} composes on top of dark and overrides only
 *   what intentionally diverges (currently `inputBackground`).
 * - **Primitives:** {@link ./colors} holds raw scales — UI MUST consume
 *   semantic `theme.colors.*` instead.
 *
 * Layering keeps a future scheme (e.g. `highContrastTheme`) cheap: spread
 * `darkColors` and override the affected roles.
 */

export type {
  AppTheme,
  ColorSchemeName,
  ThemeColors,
} from '@/ui/theme/types';

export { palette, colors, type Palette, type Colors } from '@/ui/theme/colors';
export { darkColors, darkTheme } from '@/ui/theme/dark';
export { lightColors, lightTheme } from '@/ui/theme/light';
export { themes, getTheme } from '@/ui/theme/registry';

export {
  AppThemeProvider,
  useAppTheme,
  useThemeColors,
} from '@/ui/theme/provider/AppThemeProvider';

export { spacing, type SpacingToken } from '@/ui/theme/core/spacing';
export { FORM_CONTROL_HEIGHT } from '@/ui/theme/core/formControlHeight';
export { radius, type RadiusToken } from '@/ui/theme/core/radius';
export {
  fontSize,
  fontWeight,
  lineHeight,
  fontFamily,
} from '@/ui/theme/core/typography';
export { designTokens, type DesignTokens } from '@/ui/theme/core/designTokens';
export {
  semantic,
  type SemanticColors,
} from '@/ui/theme/core/semantic';
export { navigationThemes, getChromeForScheme } from '@/ui/theme/core/navigationTheme';
export {
  drawerChrome,
  mainTabBarLabelStyle,
  mainTabHeaderTitleStyle,
  tabBarSurfaceStyle,
} from '@/ui/theme/core/navigationChrome';
export {
  flashListContentGutters,
  flashListEstimatedItemSize,
  flashListRowSeparators,
  createNavScreenShellStyles,
  createScreenScaffoldStyles,
} from '@/ui/theme/core/navScreenLayout';
export {
  createSectionDividerStyles,
  type SectionDividerStyleSet,
} from '@/ui/theme/core/sectionDivider';
export { cardShadow } from '@/ui/theme/core/shadows';
export { createCardStyle } from '@/ui/theme/core/card.styles';

export { hexAlpha } from '@/ui/theme/utils/colorUtils';
export { pickSemantic } from '@/ui/theme/utils/pickSemantic';
