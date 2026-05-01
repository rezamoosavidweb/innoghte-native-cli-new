import type { Theme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

import {
  fontSize,
  fontWeight,
  lineHeight,
  pickSemantic,
  spacing,
} from '@/ui/theme';

export function createCommentsSectionStyles(
  themeColors: Theme['colors'],
  navigationTheme: Theme,
) {
  const s = pickSemantic(navigationTheme);

  return StyleSheet.create({
    section: {
      width: '100%',
      paddingVertical: spacing.xl,
      gap: spacing.base,
    },
    header: {
      paddingHorizontal: spacing.xl,
      gap: spacing.xs,
    },
    title: {
      fontSize: fontSize['2xl'],
      fontWeight: fontWeight.bold,
      color: themeColors.text,
    },
    subtitle: {
      fontSize: fontSize.md,
      lineHeight: lineHeight.normal,
      color: s.textSecondary,
    },
  });
}

export type CommentsSectionStyles = ReturnType<
  typeof createCommentsSectionStyles
>;
