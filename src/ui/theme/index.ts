/** Design system + provider. UI style hooks live under `components/themed` and `screens/themed`. */

export { AppThemeProvider, useAppTheme } from '@/ui/theme/provider/AppThemeProvider';

export { colors, type Colors } from '@/ui/theme/core/colors';
export { palette, type Palette } from '@/ui/theme/core/palette';
export { spacing, type SpacingToken } from '@/ui/theme/core/spacing';
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
  type ColorSchemeName,
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
  useNavScreenShellStyles,
  useScreenScaffoldStyles,
} from '@/ui/theme/core/navScreenLayout';
export { cardShadow } from '@/ui/theme/core/shadows';

export { hexAlpha } from '@/ui/theme/utils/colorUtils';
export { pickSemantic } from '@/ui/theme/utils/pickSemantic';
