/**
 * Light theme — wellness / meditation palette.
 *
 * Mood: grounded · gentle · restorative.
 * Every role that diverges from dark is declared here; everything else
 * inherits from darkColors so a single token change in dark propagates.
 *
 * Palette anchors (do not hardcode elsewhere):
 *   #7A8F78  sage 500  — light-mode primary (green, NOT orange)
 *   #B9C7B1  sage 300  — soft sage tint
 *   #EEE6DA  sand 200  — warm neutral background
 *   #C9B59A  sand 500  — sand accent
 *   #3E4A45  forest 500 — deep text
 */

import { palette } from '@/ui/theme/colors';
import { darkColors } from '@/ui/theme/dark';
import type { AppTheme, ThemeColors } from '@/ui/theme/types';
import { hexAlpha } from '@/ui/theme/utils/colorUtils';

const { sage, sand, forest } = palette;

/**
 * Every key that light mode intentionally re-paints.
 * The spread below keeps unmentioned dark tokens as-is, so new dark tokens
 * automatically appear in light unless explicitly overridden.
 */
const lightOverrides: Partial<ThemeColors> = {
  // ── Surfaces ───────────────────────────────────────────────────────────
  background: sand[200],          // #EEE6DA — warm neutral page
  surface: sand[100],             // #F5EEE4 — elevated card / sheet surface
  surfaceSecondary: sand[300],    // #E2D6C5 — recessed section bands
  card: sand[100],                // #F5EEE4 — navigation card role
  tabBar: sand[100],              // #F5EEE4 — elevated above background
  drawer: sand[200],              // #EEE6DA — seamless with page

  // ── Borders / Dividers ─────────────────────────────────────────────────
  border: sand[400],              // #D5C5AF — warm, visible, not harsh
  divider: sand[300],             // #E2D6C5 — whisper-thin list separator

  // ── Text ───────────────────────────────────────────────────────────────
  text: forest[500],              // #3E4A45 — WCAG ~9:1 on sand bg
  textSecondary: forest[400],     // #5A6E69 — muted primary text
  textMuted: '#8A9893',           // ~WCAG 2.9:1 — acceptable for placeholders

  // ── Primary: green (LIGHT MODE ONLY — orange stays in dark) ───────────
  primary: sage[500],             // #7A8F78
  onPrimary: palette.white,       // #FFFFFF — bold/large label on primary
  primarySoft: hexAlpha(sage[500], 0.12),  // highlight fills, selected states

  // ── Accent: sand ───────────────────────────────────────────────────────
  accent: sand[500],              // #C9B59A — badges, secondary highlights

  // ── Input ──────────────────────────────────────────────────────────────
  inputBackground: '#EDE4D8',     // between sand[200] and sand[300]

  // ── Overlay ────────────────────────────────────────────────────────────
  overlay: hexAlpha(forest[500], 0.42), // dark forest scrim, not pure black

  // ── Navigation chrome ──────────────────────────────────────────────────
  headerBg: sand[200],            // #EEE6DA — seamless with page (no edge)
  headerForeground: forest[500],  // #3E4A45

  // ── Tab bar ────────────────────────────────────────────────────────────
  tabActive: sage[500],           // #7A8F78 — active glyph / label
  tabInactive: forest[400],       // #5A6E69 — muted, warm

  // ── Drawer ─────────────────────────────────────────────────────────────
  drawerSurface: sand[100],              // #F5EEE4 — elevated drawer header
  drawerMutedSurface: sand[200],         // #EEE6DA — muted drawer band
  drawerActiveBg: hexAlpha(sage[500], 0.12),
  drawerActiveTint: sage[600],           // #6A7F68 — slightly deeper active
  drawerInactiveTint: forest[400],       // #5A6E69

  // ── Chips / Filter pills ───────────────────────────────────────────────
  chipBorder: hexAlpha(sage[500], 0.25),
  chipBackground: hexAlpha(sage[500], 0.07),
  chipActiveBorder: sage[500],
  chipActiveBackground: hexAlpha(sage[500], 0.16),

  // ── Feedback — harmonized with the earthy wellness palette ────────────
  // Error: warm earthy red (not the jarring bright #F75555 from dark)
  error: '#C0453A',
  errorBg: hexAlpha('#C0453A', 0.09),
  errorText: '#C0453A',

  // Success: earthy medium green, distinct hue from sage primary
  success: '#4A8B5A',
  successBg: hexAlpha('#4A8B5A', 0.09),
  successText: '#4A8B5A',
  successButton: '#357A44',         // deeper shade — white text 4.9:1 ✓
  successMuted: hexAlpha('#4A8B5A', 0.13),

  // Info: muted teal — clearly different from primary green
  info: '#4A7A8C',
  infoBg: hexAlpha('#4A7A8C', 0.09),
  infoText: '#4A7A8C',

  // ── Legacy ─────────────────────────────────────────────────────────────
  danger: '#C0453A',
};

export const lightColors: ThemeColors = Object.freeze({
  ...darkColors,
  ...lightOverrides,
});

export const lightTheme: AppTheme = Object.freeze({
  scheme: 'light',
  colors: lightColors,
});
