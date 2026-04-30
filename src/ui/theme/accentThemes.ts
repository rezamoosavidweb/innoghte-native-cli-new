/**
 * Extended palettes — static semantic bundles only from each theme's anchor hex set.
 * Heavy shadows avoided where noted (editorial uses elevation 0 patterns via tokens).
 */

import type { AppTheme, ThemeColors } from '@/ui/theme/types';
import { hexAlpha } from '@/ui/theme/utils/colorUtils';

/* ── editorialGray ──────────────────────────────────────────────────────── */
const egInk = '#2B2D2F';
const egSlate = '#5B6066';
const egMist = '#A8ADB3';
const egCloud = '#E7E9EC';
const egSnow = '#F7F8FA';

export const editorialGrayColors: ThemeColors = Object.freeze({
  background: egSnow,
  tabBar: egSnow,
  drawer: egSnow,
  card: egCloud,
  surface: egCloud,
  surfaceSecondary: hexAlpha(egInk, 0.045),
  border: egMist,
  divider: hexAlpha(egInk, 0.08),

  text: egInk,
  textSecondary: egSlate,
  textMuted: egMist,

  primary: egSlate,
  onPrimary: egSnow,
  primarySoft: hexAlpha(egSlate, 0.12),
  accent: egSlate,

  error: '#B54747',
  errorBg: hexAlpha('#B54747', 0.09),
  errorText: '#A03D3D',

  success: '#4A7358',
  successBg: hexAlpha('#4A7358', 0.09),
  successText: '#3F634C',
  successButton: '#355F44',
  successMuted: hexAlpha('#4A7358', 0.13),

  info: '#4A6778',
  infoBg: hexAlpha('#4A6778', 0.09),
  infoText: '#3E5868',

  inputBackground: egCloud,
  overlay: hexAlpha(egInk, 0.42),

  headerBg: egSnow,
  headerForeground: egInk,
  tabActive: egSlate,
  tabInactive: egMist,

  drawerSurface: egCloud,
  drawerMutedSurface: egSnow,
  drawerActiveBg: hexAlpha(egSlate, 0.08),
  drawerActiveTint: egInk,
  drawerInactiveTint: egSlate,

  chipBorder: hexAlpha(egSlate, 0.28),
  chipBackground: hexAlpha(egSlate, 0.06),
  chipActiveBorder: egSlate,
  chipActiveBackground: hexAlpha(egSlate, 0.14),

  danger: '#B54747',
});

export const editorialGrayTheme: AppTheme = Object.freeze({
  scheme: 'editorialGray',
  colors: editorialGrayColors,
});

/* ── studioDark ─────────────────────────────────────────────────────────── */
const sdVoid = '#0F1720';
const sdPanel = '#243042';
const sdSteel = '#4B5D6B';
const sdSilver = '#B8C1C6';
const sdMist = '#F1F2F3';

export const studioDarkColors: ThemeColors = Object.freeze({
  background: sdVoid,
  tabBar: sdVoid,
  drawer: sdVoid,
  card: sdPanel,
  surface: sdPanel,
  surfaceSecondary: hexAlpha(sdMist, 0.06),
  border: sdSteel,
  divider: hexAlpha(sdMist, 0.1),

  text: sdMist,
  textSecondary: sdSilver,
  textMuted: sdSteel,

  primary: sdSilver,
  onPrimary: sdVoid,
  primarySoft: hexAlpha(sdSilver, 0.16),
  accent: sdSilver,

  error: '#E07872',
  errorBg: hexAlpha('#E07872', 0.14),
  errorText: '#F0A09C',

  success: '#7CB89A',
  successBg: hexAlpha('#7CB89A', 0.12),
  successText: '#A8D4BE',
  successButton: '#5FA883',
  successMuted: hexAlpha('#7CB89A', 0.18),

  info: '#8BAFC4',
  infoBg: hexAlpha('#8BAFC4', 0.12),
  infoText: '#C5DCEB',

  inputBackground: sdPanel,
  overlay: hexAlpha('#000000', 0.52),

  headerBg: sdPanel,
  headerForeground: sdMist,
  tabActive: sdSilver,
  tabInactive: sdSteel,

  drawerSurface: sdPanel,
  drawerMutedSurface: sdVoid,
  drawerActiveBg: hexAlpha(sdSilver, 0.08),
  drawerActiveTint: sdMist,
  drawerInactiveTint: sdSilver,

  chipBorder: sdSteel,
  chipBackground: hexAlpha(sdMist, 0.05),
  chipActiveBorder: sdSilver,
  chipActiveBackground: hexAlpha(sdSilver, 0.12),

  danger: '#E07872',
});

export const studioDarkTheme: AppTheme = Object.freeze({
  scheme: 'studioDark',
  colors: studioDarkColors,
});

/* ── nighttime ──────────────────────────────────────────────────────────── */
const ntCream = '#F7F3ED';
const ntTaupe = '#D9D1C7';
const ntLavender = '#A7A1A8';
const ntGraphite = '#6B6873';
const ntInk = '#2A2830';

export const nighttimeColors: ThemeColors = Object.freeze({
  background: ntCream,
  tabBar: ntCream,
  drawer: ntCream,
  card: ntTaupe,
  surface: ntTaupe,
  surfaceSecondary: hexAlpha(ntInk, 0.04),
  border: ntTaupe,
  divider: hexAlpha(ntInk, 0.06),

  text: ntInk,
  textSecondary: ntGraphite,
  textMuted: ntLavender,

  primary: ntGraphite,
  onPrimary: ntCream,
  primarySoft: hexAlpha(ntGraphite, 0.11),
  accent: ntGraphite,

  error: '#A85E56',
  errorBg: hexAlpha('#A85E56', 0.09),
  errorText: '#944E46',

  success: '#527A5F',
  successBg: hexAlpha('#527A5F', 0.09),
  successText: '#466D52',
  successButton: '#3E614A',
  successMuted: hexAlpha('#527A5F', 0.12),

  info: '#5C7584',
  infoBg: hexAlpha('#5C7584', 0.09),
  infoText: '#506673',

  inputBackground: ntTaupe,
  overlay: hexAlpha(ntInk, 0.38),

  headerBg: ntCream,
  headerForeground: ntInk,
  tabActive: ntGraphite,
  tabInactive: ntLavender,

  drawerSurface: ntTaupe,
  drawerMutedSurface: ntCream,
  drawerActiveBg: hexAlpha(ntGraphite, 0.09),
  drawerActiveTint: ntInk,
  drawerInactiveTint: ntGraphite,

  chipBorder: hexAlpha(ntGraphite, 0.22),
  chipBackground: hexAlpha(ntGraphite, 0.06),
  chipActiveBorder: ntGraphite,
  chipActiveBackground: hexAlpha(ntGraphite, 0.11),

  danger: '#A85E56',
});

export const nighttimeTheme: AppTheme = Object.freeze({
  scheme: 'nighttime',
  colors: nighttimeColors,
});

/* ── steady ─────────────────────────────────────────────────────────────── */
const stMist = '#F6F7F6';
const stHaze = '#D7DEE0';
const stDust = '#9AA3A6';
const stSage = '#7E8C86';
const stCharcoal = '#3B4448';

export const steadyColors: ThemeColors = Object.freeze({
  background: stMist,
  tabBar: stMist,
  drawer: stMist,
  card: stHaze,
  surface: stHaze,
  surfaceSecondary: hexAlpha(stCharcoal, 0.04),
  border: stDust,
  divider: hexAlpha(stCharcoal, 0.07),

  text: stCharcoal,
  textSecondary: stSage,
  textMuted: stDust,

  primary: stSage,
  onPrimary: stMist,
  primarySoft: hexAlpha(stSage, 0.13),
  accent: stSage,

  error: '#B35248',
  errorBg: hexAlpha('#B35248', 0.09),
  errorText: '#9F463E',

  success: '#4F8064',
  successBg: hexAlpha('#4F8064', 0.09),
  successText: '#447057',
  successButton: '#3C664F',
  successMuted: hexAlpha('#4F8064', 0.12),

  info: '#5B7888',
  infoBg: hexAlpha('#5B7888', 0.09),
  infoText: '#506977',

  inputBackground: stHaze,
  overlay: hexAlpha(stCharcoal, 0.4),

  headerBg: stMist,
  headerForeground: stCharcoal,
  tabActive: stSage,
  tabInactive: stDust,

  drawerSurface: stHaze,
  drawerMutedSurface: stMist,
  drawerActiveBg: hexAlpha(stSage, 0.1),
  drawerActiveTint: stCharcoal,
  drawerInactiveTint: stSage,

  chipBorder: hexAlpha(stSage, 0.28),
  chipBackground: hexAlpha(stSage, 0.06),
  chipActiveBorder: stSage,
  chipActiveBackground: hexAlpha(stSage, 0.13),

  danger: '#B35248',
});

export const steadyTheme: AppTheme = Object.freeze({
  scheme: 'steady',
  colors: steadyColors,
});

/* ── stoneCalm ──────────────────────────────────────────────────────────── */
const scBone = '#EDEBE6';
const scAsh = '#D7DDDA';
const scLichen = '#87918E';
const scPine = '#4C5A57';
const scDeep = '#2B2F2E';

export const stoneCalmColors: ThemeColors = Object.freeze({
  background: scBone,
  tabBar: scBone,
  drawer: scBone,
  card: scAsh,
  surface: scAsh,
  surfaceSecondary: hexAlpha(scDeep, 0.04),
  border: scLichen,
  divider: hexAlpha(scDeep, 0.07),

  text: scDeep,
  textSecondary: scPine,
  textMuted: scLichen,

  primary: scPine,
  onPrimary: scBone,
  primarySoft: hexAlpha(scPine, 0.12),
  accent: scPine,

  error: '#AD554E',
  errorBg: hexAlpha('#AD554E', 0.09),
  errorText: '#994841',

  success: '#5A7D62',
  successBg: hexAlpha('#5A7D62', 0.09),
  successText: '#4F6F56',
  successButton: '#46634D',
  successMuted: hexAlpha('#5A7D62', 0.12),

  info: '#5F7B82',
  infoBg: hexAlpha('#5F7B82', 0.09),
  infoText: '#546E74',

  inputBackground: scAsh,
  overlay: hexAlpha(scDeep, 0.38),

  headerBg: scBone,
  headerForeground: scDeep,
  tabActive: scPine,
  tabInactive: scLichen,

  drawerSurface: scAsh,
  drawerMutedSurface: scBone,
  drawerActiveBg: hexAlpha(scPine, 0.09),
  drawerActiveTint: scDeep,
  drawerInactiveTint: scPine,

  chipBorder: hexAlpha(scPine, 0.26),
  chipBackground: hexAlpha(scPine, 0.06),
  chipActiveBorder: scPine,
  chipActiveBackground: hexAlpha(scPine, 0.12),

  danger: '#AD554E',
});

export const stoneCalmTheme: AppTheme = Object.freeze({
  scheme: 'stoneCalm',
  colors: stoneCalmColors,
});
