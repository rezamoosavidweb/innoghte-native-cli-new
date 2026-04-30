/**
 * Public theme types — single source of truth for the semantic color shape.
 *
 * Adding a new token = add it here, then implement in `dark.ts` (and override
 * in `light.ts` only when the role intentionally diverges).
 */

import type { ThemeMode } from '@/shared/contracts/theme';

/** Concrete selectable palette — aliases {@link ThemeMode}. */
export type ColorSchemeName = ThemeMode;

/**
 * Semantic palette consumed by every UI surface. Roles are described by the
 * UX, not by a literal hex (e.g. `tabBar` and `background` may share a value
 * today, but each surface owns its own token so they can drift later).
 */
export type ThemeColors = {
  /** Page background (every screen). */
  background: string;
  /** Bottom tab bar surface. */
  tabBar: string;
  /** Side drawer / panel surface. */
  drawer: string;
  /** Card / elevated surface (also used by the navigation `card` role). */
  card: string;
  /** Elevated surface above `background` — bottom sheets, modals, input fills. */
  surface: string;
  /** Recessed / muted surface layer — section bands, sidebar panels. */
  surfaceSecondary: string;
  /** Border / divider line. */
  border: string;
  /** Soft separator — lighter than `border`; for list section dividers. */
  divider: string;

  /** Primary foreground text. */
  text: string;
  /** Secondary foreground text (slightly muted). */
  textSecondary: string;
  /** Tertiary / placeholder text (most muted). */
  textMuted: string;

  /** Brand / accent color. */
  primary: string;
  /** Foreground used on top of `primary`. */
  onPrimary: string;
  /** Very translucent primary tint — selected states, highlight fills. */
  primarySoft: string;
  /** Secondary accent (sand in light mode, primary-adjacent in dark). */
  accent: string;

  /** Error base (use for both bg + text when no contrast needed, e.g. tinted toast). */
  error: string;
  /** Error background — toasts, alerts. */
  errorBg: string;
  /** Error text — inline form errors, validation messages. */
  errorText: string;

  /** Success base. */
  success: string;
  /** Success background — toasts, alerts. */
  successBg: string;
  /** Success text — inline confirmation labels. */
  successText: string;
  /** Success button background — distinct, deeper shade for filled CTAs. */
  successButton: string;
  /** Translucent success fill — badges / pills (low-emphasis confirmation). */
  successMuted: string;

  /** Info base (text). */
  info: string;
  /** Info background — translucent fill for info banners / pills. */
  infoBg: string;
  /** Info text — emphasised info copy. */
  infoText: string;

  /** Default input field background. */
  inputBackground: string;

  /** Modal / overlay scrim. */
  overlay: string;

  /** Header (top bar) surface. */
  headerBg: string;
  /** Header foreground (icons + title). */
  headerForeground: string;
  /** Active tab tint. */
  tabActive: string;
  /** Inactive tab tint. */
  tabInactive: string;

  /** Drawer header / profile band surface. */
  drawerSurface: string;
  /** Drawer secondary / muted surface (profile band). */
  drawerMutedSurface: string;
  /** Drawer active row background. */
  drawerActiveBg: string;
  /** Drawer active label / icon tint. */
  drawerActiveTint: string;
  /** Drawer inactive label / icon tint. */
  drawerInactiveTint: string;

  /** Filter / pill border (resting). */
  chipBorder: string;
  /** Filter / pill background (resting). */
  chipBackground: string;
  /** Filter / pill border (selected). */
  chipActiveBorder: string;
  /** Filter / pill background (selected). */
  chipActiveBackground: string;

  /**
   * @deprecated Use `error` / `errorBg` / `errorText`. Kept so legacy
   * `s.danger` / `colors.notification` consumers don't break during migration.
   */
  danger: string;
};

/**
 * Full theme bundle. Tokens live on `colors`; spacing / typography / radii
 * come from primitive scales which don't change between schemes.
 */
export type AppTheme = {
  scheme: ColorSchemeName;
  colors: ThemeColors;
};
