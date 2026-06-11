import type { Theme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

import { palette } from '@/ui/theme/colors';
import { radius } from '@/ui/theme/core/radius';
import { spacing } from '@/ui/theme/core/spacing';
import { fontSize, fontWeight } from '@/ui/theme/core/typography';
import { hexAlpha } from '@/ui/theme/utils/colorUtils';

/** Warm-dark legal callout band — fixed surface (white copy), not theme-driven. */
const LEGAL_CALLOUT_BG = '#2C2824';

export function createLegalScreenStyles(nav: Theme['colors']) {
  return StyleSheet.create({
    scroll: {
      paddingBottom: spacing['6xl'],
      gap: spacing.lg,
    },
    hero: {
      marginBottom: spacing.md,
    },
    heroTitle: {
      fontSize: fontSize['2xl'],
      fontWeight: fontWeight.bold,
      color: nav.text,
    },
    heroLead: {
      fontSize: fontSize.md + 1,
      color: nav.text,
      opacity: 0.8,
      marginTop: spacing.sm,
      lineHeight: 24,
    },
    band: {
      backgroundColor: LEGAL_CALLOUT_BG,
      borderRadius: radius.lg,
      padding: spacing.lg,
      gap: spacing.lg,
    },
    sectionTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: palette.white,
    },
    p: {
      fontSize: fontSize.base,
      lineHeight: 24,
      color: hexAlpha(palette.white, 0.9),
      textAlign: 'justify',
    },
  });
}