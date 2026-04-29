/**
 * Raw color palette (primitive tokens). Components MUST NOT consume these
 * directly — always go through the semantic `theme.colors.*` from
 * {@link ./dark} / {@link ./light}. New raw values live here so a future
 * scheme (e.g. high-contrast) can compose them without duplicating hex.
 */

import { hexAlpha } from '@/ui/theme/utils/colorUtils';

/** Spec-driven dark surface ramp (see design tokens). */
const surfaceDark = {
  /** Card background. */
  card: '#1F222A',
  /** Drawer background. */
  drawer: '#1E2025',
  /** Page / tab background. */
  page: '#181A20',
  /** Border / divider. */
  border: '#35383F',
  /** Slightly elevated surface (avatar / placeholder). */
  raised: '#262A35',
} as const;

/** Spec-driven feedback hexes (toast + inline). */
const feedback = {
  errorBase: '#F75555',
  successBase: '#4AAF57',
  successButton: '#418039',
  infoBase: '#0ABBB5',
} as const;

/**
 * Public palette. Grouped by scale; legacy callers (e.g. `core/colors.ts`)
 * re-export this verbatim so the previous import path keeps working.
 */
export const palette = {
  white: '#FFFFFF',
  black: '#212121',

  /** Spec dark surfaces (preferred over the numeric `dark` ramp below). */
  surfaceDark,
  /** Spec feedback hexes. */
  feedback,
  /** Info translucent fill (`#0ABBB51A` — alpha ~0.10). */
  infoBg: hexAlpha(feedback.infoBase, 0.1),

  /** Legacy dark ramp — kept for back-compat with older snippets. */
  dark: {
    1: surfaceDark.border,
    2: surfaceDark.raised,
    3: surfaceDark.card,
    4: surfaceDark.drawer,
    5: surfaceDark.page,
  },

  charcoal: {
    50: '#F2F2F2',
    100: '#E5E5E5',
    200: '#C9C9C9',
    300: '#B0B0B0',
    400: '#969696',
    500: '#7D7D7D',
    600: '#616161',
    700: '#474747',
    800: '#383838',
    850: '#2E2E2E',
    900: '#1E1E1E',
    950: '#121212',
  },
  grayscale: {
    50: '#FAFAFA',
    100: '#FAFAFA',
    /** Spec light input background. */
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#F0EFEE',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  primary: {
    50: '#FFE2CC',
    100: '#FFC499',
    200: '#FFA766',
    300: '#FF984C',
    400: '#FF8933',
    500: '#FF7B1A',
    600: '#FF6C00',
    700: '#E56100',
    800: '#CC5600',
    900: '#B24C00',
  },
  secondary: {
    50: '#FFF2EB',
    100: '#FADFCF',
    200: '#F8CEB7',
    300: '#F5BE9F',
    400: '#F3AE87',
    500: '#F19E6E',
    600: '#EE8E56',
    700: '#EC7D3E',
    800: '#ED7028',
    900: '#E96D26',
    950: '#802F00',
  },
  danger: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
    800: feedback.successButton,
    900: '#14532D',
    950: '#2A4B25',
  },
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },

  background: {
    blue: '#EDF2FF',
    brown: '#F8F3F1',
    green: '#F8FFFC',
    orange: '#FFF3F0',
    primary: '#E6F8F7',
    purple: '#F5F3FF',
    red: '#FFF4F2',
    teal: '#EDF7F6',
    yellow: '#FFFCEB',
  },
} as const;

export type Palette = typeof palette;

/**
 * @deprecated Legacy alias of {@link palette}. Existing callers like
 * `import { colors } from '@/ui/theme'` keep working through the barrel;
 * new code should prefer `palette` (raw) or — better — `theme.colors`
 * (semantic) from `useAppTheme()` / `useTheme()`.
 */
export const colors = palette;
export type Colors = Palette;

