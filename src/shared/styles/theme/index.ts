/** Design system + provider. UI style hooks live under `components/themed` and `screens/themed`. */

export { AppThemeProvider, useAppTheme } from '@/shared/styles/theme/provider/AppThemeProvider';

export { colors, type Colors } from '@/shared/styles/theme/core/colors';
export { palette, type Palette } from '@/shared/styles/theme/core/palette';
export { spacing, type SpacingToken } from '@/shared/styles/theme/core/spacing';
export { radius, type RadiusToken } from '@/shared/styles/theme/core/radius';
export {
  fontSize,
  fontWeight,
  lineHeight,
  fontFamily,
} from '@/shared/styles/theme/core/typography';
export { designTokens, type DesignTokens } from '@/shared/styles/theme/core/designTokens';
export {
  semantic,
  type ColorSchemeName,
  type SemanticColors,
} from '@/shared/styles/theme/core/semantic';
export { navigationThemes, getChromeForScheme } from '@/shared/styles/theme/core/navigationTheme';
export {
  drawerChrome,
  mainTabBarLabelStyle,
  mainTabHeaderTitleStyle,
  tabBarSurfaceStyle,
} from '@/shared/styles/theme/core/navigationChrome';
export {
  flashListContentGutters,
  flashListEstimatedItemSize,
  flashListRowSeparators,
  useNavScreenShellStyles,
  useScreenScaffoldStyles,
} from '@/shared/styles/theme/core/navScreenLayout';
export { cardShadow } from '@/shared/styles/theme/core/shadows';

export { hexAlpha } from '@/shared/styles/theme/utils/colorUtils';
export { pickSemantic } from '@/shared/styles/theme/utils/pickSemantic';
