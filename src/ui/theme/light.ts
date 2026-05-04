/**
 * Light theme — modern warm-stone monochrome palette (2024–2025).
 *
 * Mood: clean · precise · minimal.
 * Primary: #FF984C (palette.primary[300]) — identical to dark theme.
 * Neutral base: warm stone tones; single brand accent (orange).
 *
 * Palette anchors:
 *   #FF984C  primary[300]  — brand orange (same as dark)
 *   #FAFAF9  —             — near-white warm stone page bg
 *   #1C1917  —             — near-black warm stone text  (16:1 on bg ✓✓)
 *   #57534E  —             — stone-600 secondary text    ( 6.9:1 on white ✓✓)
 *   #78716C  —             — stone-500 muted text        ( 4.6:1 on white ✓)
 *
 * Contrast notes
 *   onPrimary (#1C1917) on primary (#FF984C) → 8.0:1 ✓✓
 *   tabActive (#CC5600) on tabBar (#FFF)     → 3.95:1 (non-text 3:1 ✓)
 *   drawerActiveTint (#B24C00) on white      → 4.84:1 ✓✓
 *   error text (#B91C1C) on white            → 6.2:1 ✓✓
 *   success text (#15803D) on white          → 5.2:1 ✓✓
 *   info text (#0369A1) on white             → 6.9:1 ✓✓
 */

import { palette } from '@/ui/theme/colors';
import { darkColors } from '@/ui/theme/dark';
import type { AppTheme, ThemeColors } from '@/ui/theme/types';
import { hexAlpha } from '@/ui/theme/utils/colorUtils';

// Brand orange — identical to dark theme primary. Do NOT change.
const primary = palette.primary[300]; // #FF984C

/**
 * Stone-neutral overrides. Every key light mode intentionally re-paints vs
 * dark; unmentioned tokens inherit from darkColors automatically.
 */
const lightOverrides: Partial<ThemeColors> = {
  // ── Surfaces ───────────────────────────────────────────────────────────
  background:       '#FAFAF9',          // stone-50: near-white warm page
  surface:          '#FFFFFF',          // pure white: sheets, modals, inputs
  surfaceSecondary: '#F2F1EF',          // recessed section bands / sidebar
  card:             '#FFFFFF',          // navigation card role
  tabBar:           '#FFFFFF',          // elevated above background
  drawer:           '#FAFAF9',          // seamless with page

  // ── Borders / Dividers ─────────────────────────────────────────────────
  border:  '#E4E3E1',                   // warm soft gray — visible, not harsh
  divider: '#EDECEB',                   // whisper-thin list separator

  // ── Text ───────────────────────────────────────────────────────────────
  text:          '#1C1917',             // stone-900: ~16:1 on #FAFAF9 ✓✓
  textSecondary: '#57534E',             // stone-600: ~6.9:1 on white ✓✓
  textMuted:     '#78716C',             // stone-500: ~4.6:1 on white ✓

  // ── Primary (matches dark theme exactly) ──────────────────────────────
  primary,                              // #FF984C — brand orange
  onPrimary:   '#1C1917',              // dark stone on orange: 8.0:1 ✓✓
  primarySoft: hexAlpha(primary, 0.12), // soft tint for selected / highlight fills
  accent:      primary,                 // monochrome: single brand accent

  // ── Input ──────────────────────────────────────────────────────────────
  inputBackground: '#F5F4F2',           // stone tint — distinct from white surface

  // ── Overlay ────────────────────────────────────────────────────────────
  overlay: hexAlpha('#1C1917', 0.45),  // dark stone scrim (not pure black)

  // ── Navigation chrome ──────────────────────────────────────────────────
  headerBg:         '#FFFFFF',          // clean white header
  headerForeground: '#1C1917',          // stone-900

  // ── Tab bar ────────────────────────────────────────────────────────────
  // primary[800] = #CC5600 → 3.95:1 on white (non-text 3:1 ✓; icon + label)
  tabActive:   palette.primary[800],    // #CC5600 — accessible deep orange
  tabInactive: '#A8A29E',               // stone-400: muted inactive icons

  // ── Drawer ─────────────────────────────────────────────────────────────
  drawerSurface:      '#FFFFFF',
  drawerMutedSurface: '#FAFAF9',
  drawerActiveBg:     hexAlpha(primary, 0.10),
  // primary[900] = #B24C00 → 4.84:1 on white ✓✓ (text label accessible)
  drawerActiveTint:   palette.primary[900],   // #B24C00 — dark amber for labels
  drawerInactiveTint: '#57534E',              // stone-600

  // ── Chips / Filter pills ───────────────────────────────────────────────
  chipBorder:          '#D6D3D0',       // stone-300: soft visible border
  chipBackground:      '#F5F4F2',       // very light stone fill
  chipActiveBorder:    primary,         // full orange border on active chip
  chipActiveBackground: hexAlpha(primary, 0.10), // soft orange tint

  // ── Feedback ─────────────────────────────────────────────────────────
  // Error: red-600 base (4.5:1) / red-700 text (6.2:1) — both ✓
  error:     '#DC2626',
  errorBg:   hexAlpha('#DC2626', 0.08),
  errorText: '#B91C1C',                // red-700: 6.2:1 on white ✓✓

  // Success: green-700 throughout (5.2:1 on white ✓✓)
  success:       '#15803D',
  successBg:     hexAlpha('#15803D', 0.08),
  successText:   '#15803D',
  successButton: '#15803D',            // white text on this: 5.0:1 ✓✓
  successMuted:  hexAlpha('#15803D', 0.12),

  // Info: sky-700 throughout (6.9:1 on white ✓✓)
  info:     '#0369A1',
  infoBg:   hexAlpha('#0369A1', 0.08),
  infoText: '#0369A1',

  // ── Legacy ─────────────────────────────────────────────────────────────
  danger: '#DC2626',

  // ── Ambient atmosphere ─────────────────────────────────────────────────
  gradientStart: '#FAFAF9',             // stone-50 base
  gradientMid:   '#F2F1EF',            // slightly deeper neutral
  ambientOrb1:   primary,              // orange warmth accent
  ambientOrb2:   '#E4E3E1',            // stone-200: soft neutral ring
  shimmer:       hexAlpha(primary, 0.08), // soft orange inner glow
};

export const lightColors: ThemeColors = Object.freeze({
  ...darkColors,
  ...lightOverrides,
});

export const lightTheme: AppTheme = Object.freeze({
  scheme: 'light',
  colors: lightColors,
});
