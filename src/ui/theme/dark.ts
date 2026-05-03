/**
 * Dark theme — source of truth.
 *
 * Every semantic token in {@link ThemeColors} is fully resolved here.
 * Light mode composes on top of this object and overrides only the roles it
 * intentionally diverges on (see {@link ./light}).
 */

import { palette } from '@/ui/theme/colors';
import type { AppTheme, ThemeColors } from '@/ui/theme/types';
import { hexAlpha } from '@/ui/theme/utils/colorUtils';

const { surfaceDark, feedback, infoBg } = palette;

/**
 * Dark color set. Keep additions strictly semantic (UX role); raw hex stays
 * in {@link ./colors}. This object is frozen so accidental mutations during
 * dev (e.g. spreading into a style) don't poison the shared reference.
 */
export const darkColors: ThemeColors = Object.freeze({
  background: surfaceDark.page,
  tabBar: surfaceDark.page,
  drawer: surfaceDark.drawer,
  card: surfaceDark.card,
  surface: surfaceDark.card,
  surfaceSecondary: surfaceDark.raised,
  border: surfaceDark.border,
  divider: surfaceDark.border,

  text: palette.white,
  textSecondary: palette.charcoal[200],
  textMuted: palette.charcoal[300],

  primary: palette.primary[300],
  onPrimary: surfaceDark.page,
  primarySoft: hexAlpha(palette.primary[300], 0.15),
  accent: palette.primary[300],
  primaryBg: palette.primary[50],
  primaryDark: palette.primary[600],

  error: feedback.errorBase,
  errorBg: feedback.errorBase,
  errorText: feedback.errorBase,

  success: feedback.successBase,
  successBg: feedback.successBase,
  successText: feedback.successBase,
  successButton: feedback.successButton,
  successMuted: hexAlpha(feedback.successBase, 0.15),

  info: feedback.infoBase,
  infoBg,
  infoText: feedback.infoBase,

  inputBackground: surfaceDark.card,

  overlay: hexAlpha('#000000', 0.55),

  headerBg: surfaceDark.card,
  headerForeground: palette.white,
  tabActive: palette.primary[300],
  tabInactive: palette.charcoal[300],

  drawerSurface: surfaceDark.card,
  drawerMutedSurface: surfaceDark.drawer,
  drawerActiveBg: surfaceDark.raised,
  drawerActiveTint: palette.primary[300],
  drawerInactiveTint: palette.charcoal[200],

  chipBorder: surfaceDark.border,
  chipBackground: surfaceDark.drawer,
  chipActiveBorder: palette.primary[400],
  chipActiveBackground: surfaceDark.raised,

  danger: feedback.errorBase,

  // ── Ambient atmosphere ─────────────────────────────────────────────────
  gradientStart: '#07101F',
  gradientMid: '#1E2D4A',
  ambientOrb1: feedback.infoBase,              // #0ABBB5 teal
  ambientOrb2: palette.primary[300],           // #FF984C orange
  shimmer: hexAlpha('#8B9FFF', 0.08),          // soft periwinkle inner glow
});

export const darkTheme: AppTheme = Object.freeze({
  scheme: 'dark',
  colors: darkColors,
});
