/**
 * Light theme — override layer on top of {@link ./dark}.
 *
 * Per spec, light mode is **not** a redesign: it inherits every dark token
 * and only overrides what the product explicitly diverges on. Today that's
 * just the input background.
 *
 * To diverge another role later, add a single key to `lightOverrides` — the
 * spread keeps everything else aligned with the dark source of truth.
 */

import { palette } from '@/ui/theme/colors';
import { darkColors } from '@/ui/theme/dark';
import type { AppTheme, ThemeColors } from '@/ui/theme/types';

/**
 * Roles that light mode intentionally re-paints. Keep this list intentional
 * and small; bias toward NOT overriding.
 */
const lightOverrides: Partial<ThemeColors> = {
  inputBackground: palette.grayscale[200],
};

export const lightColors: ThemeColors = Object.freeze({
  ...darkColors,
  ...lightOverrides,
});

export const lightTheme: AppTheme = Object.freeze({
  scheme: 'light',
  colors: lightColors,
});
