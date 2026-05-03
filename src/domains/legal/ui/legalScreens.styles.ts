import type { Theme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

import { radius } from '@/ui/theme/core/radius';
import { spacing } from '@/ui/theme/core/spacing';
import { fontSize, fontWeight } from '@/ui/theme/core/typography';
import { hexAlpha } from '@/ui/theme/utils/colorUtils';

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
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    heroLead: {
      fontSize: fontSize.md + 1,
      color: nav.text,
      opacity: 0.8,
      marginTop: spacing.sm,
      textAlign: 'right',
      writingDirection: 'rtl',
      lineHeight: 24,
    },
    band: {
      backgroundColor: '#2C2824',
      borderRadius: radius.lg,
      padding: spacing.lg,
      gap: spacing.lg,
    },
    sectionTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: '#FFFFFF',
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    p: {
      fontSize: fontSize.base,
      lineHeight: 24,
      color: hexAlpha('#FFFFFF', 0.9),
      textAlign: 'justify',
      writingDirection: 'rtl',
    },
  });
}