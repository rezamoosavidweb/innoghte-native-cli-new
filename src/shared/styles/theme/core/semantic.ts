import { hexAlpha } from '@/shared/styles/theme/utils/colorUtils';
import { colors } from '@/shared/styles/theme/core/colors';

export type ColorSchemeName = 'light' | 'dark';

/**
 * Semantic colors: UI meaning (maps primitive `colors` → light/dark roles).
 */
export const semantic = {
  light: {
    primary: colors.primary[800],
    onPrimary: colors.white,
    background: colors.grayscale[50],
    card: colors.white,
    text: colors.black,
    textSecondary: colors.grayscale[600],
    textMuted: colors.grayscale[500],
    border: colors.charcoal[100],
    success: colors.success[600],
    successMuted: hexAlpha(colors.success[500], 0.12),
    danger: colors.danger[500],
    warning: colors.warning[500],
    headerBg: colors.primary[800],
    headerForeground: colors.white,
    tabActive: colors.primary[800],
    tabInactive: colors.grayscale[600],
    drawerSurface: colors.white,
    drawerMutedSurface: colors.neutral[100],
    drawerActiveBg: colors.primary[50],
    drawerActiveTint: colors.primary[800],
    drawerInactiveTint: colors.grayscale[600],
    overlay: hexAlpha('#000000', 0.45),
    chipBorder: colors.charcoal[200],
    chipBackground: colors.grayscale[50],
    chipActiveBorder: colors.primary[800],
    chipActiveBackground: colors.primary[50],
  },
  dark: {
    primary: colors.primary[300],
    onPrimary: colors.dark[5],
    background: colors.dark[5],
    card: colors.dark[3],
    text: colors.white,
    textSecondary: colors.charcoal[200],
    textMuted: colors.charcoal[300],
    border: colors.dark[1],
    success: colors.success[400],
    successMuted: hexAlpha(colors.success[400], 0.15),
    danger: colors.danger[400],
    warning: colors.warning[400],
    headerBg: colors.dark[3],
    headerForeground: colors.white,
    tabActive: colors.primary[300],
    tabInactive: colors.charcoal[300],
    drawerSurface: colors.dark[3],
    drawerMutedSurface: colors.dark[4],
    drawerActiveBg: colors.dark[2],
    drawerActiveTint: colors.primary[300],
    drawerInactiveTint: colors.charcoal[200],
    overlay: hexAlpha('#000000', 0.55),
    chipBorder: colors.dark[1],
    chipBackground: colors.dark[4],
    chipActiveBorder: colors.primary[400],
    chipActiveBackground: colors.dark[2],
  },
} as const;

export type SemanticColors =
  (typeof semantic)['light'] | (typeof semantic)['dark'];
