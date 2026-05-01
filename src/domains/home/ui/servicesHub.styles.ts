import type { Theme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

import {
  fontSize,
  fontWeight,
  lineHeight,
  radius,
  spacing,
} from '@/ui/theme';

export function createServicesHubStyles(themeColors: Theme['colors']) {
  return StyleSheet.create({
    scroll: { flex: 1, backgroundColor: themeColors.background },
    subtitle: {
      fontSize: fontSize.md + 1,
      lineHeight: lineHeight.normal,
      opacity: 0.8,
      color: themeColors.text,
    },
    menuRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 14,
      paddingHorizontal: 14,
      borderRadius: radius.lg,
      borderWidth: StyleSheet.hairlineWidth,
      backgroundColor: themeColors.card,
      borderColor: themeColors.border,
    },
    menuRowPressed: { opacity: 0.92 },
    menuRowLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      flex: 1,
    },
    menuIcon: { fontSize: fontSize['2xl'] },
    menuTitle: {
      fontSize: fontSize.base,
      fontWeight: fontWeight.semibold,
      color: themeColors.text,
    },
    chevron: {
      fontSize: fontSize['2xl'],
      fontWeight: fontWeight.light,
      opacity: 0.55,
      color: themeColors.text,
    },
    scrollContent: {
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.xl,
      paddingBottom: spacing['7xl'],
      gap: spacing.base,
    },
    list: {
      gap: spacing.md,
    },
  });
}
