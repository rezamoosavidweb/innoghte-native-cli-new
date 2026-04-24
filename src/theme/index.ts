/** Design system + provider. UI style hooks live under `components/themed` and `screens/themed`. */

export { AppThemeProvider, useAppTheme } from '@/theme/provider/AppThemeProvider';

export { colors, type Colors } from '@/theme/core/colors';
export { palette, type Palette } from '@/theme/core/palette';
export { spacing, type SpacingToken } from '@/theme/core/spacing';
export { radius, type RadiusToken } from '@/theme/core/radius';
export {
  fontSize,
  fontWeight,
  lineHeight,
  fontFamily,
} from '@/theme/core/typography';
export { designTokens, type DesignTokens } from '@/theme/core/designTokens';
export {
  semantic,
  type ColorSchemeName,
  type SemanticColors,
} from '@/theme/core/semantic';
export { navigationThemes, getChromeForScheme } from '@/theme/core/navigationTheme';
export {
  drawerChrome,
  mainTabBarLabelStyle,
  mainTabHeaderTitleStyle,
  tabBarSurfaceStyle,
} from '@/theme/core/navigationChrome';
export {
  flashListContentGutters,
  flashListEstimatedItemSize,
  flashListRowSeparators,
  useNavScreenShellStyles,
  useScreenScaffoldStyles,
} from '@/theme/core/navScreenLayout';
export { cardShadow } from '@/theme/core/shadows';

export { hexAlpha } from '@/theme/utils/colorUtils';
export { pickSemantic } from '@/theme/utils/pickSemantic';
