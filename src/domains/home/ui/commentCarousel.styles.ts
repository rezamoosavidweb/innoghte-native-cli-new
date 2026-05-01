import type { Theme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

import {
  fontSize,
  fontWeight,
  lineHeight,
  pickSemantic,
  radius,
  spacing,
} from '@/ui/theme';

export function createCommentCarouselStyles(
  themeColors: Theme['colors'],
  navigationTheme: Theme,
) {
  const s = pickSemantic(navigationTheme);

  return StyleSheet.create({
    container: {
      width: '100%',
    },
    empty: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.xl,
    },
    emptyText: {
      fontSize: fontSize.md,
      color: s.textMuted,
      textAlign: 'center',
    },
    card: {
      flex: 1,
      marginHorizontal: spacing.base,
      paddingHorizontal: spacing.base,
      paddingVertical: spacing.md,
      borderRadius: radius.xl,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: themeColors.border,
      backgroundColor: themeColors.card,
      gap: spacing.xs + 12,
    },
    cardPressed: {
      opacity: 0.82,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.sm,
    },
    userText: {
      flexShrink: 1,
      fontSize: fontSize.base,
      fontWeight: fontWeight.bold,
      color: themeColors.text,
    },
    dateText: {
      fontSize: fontSize.xs,
      color: s.textMuted,
    },
    courseText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.semibold,
      color: themeColors.primary,
    },
    contentText: {
      flexShrink: 1,
      fontSize: fontSize.md,
      lineHeight: lineHeight.relaxed,
      color: s.textSecondary,
    },
    starContainer: {
      display: 'flex',
      gap: spacing.xs,
      flexDirection: 'row',
    },
  });
}

export function createCommentCarouselEmptyLayout(height: number, width: number) {
  return StyleSheet.create({
    frame: { height, width },
  });
}
