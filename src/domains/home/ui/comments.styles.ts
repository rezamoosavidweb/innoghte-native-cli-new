import { useTheme, type Theme } from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet } from 'react-native';

import {
  fontSize,
  fontWeight,
  lineHeight,
  pickSemantic,
  spacing,
} from '@/ui/theme';

export function useCommentsSectionStyles(themeColors: Theme['colors']) {
  const { dark } = useTheme();
  const s = pickSemantic(dark);

  return React.useMemo(
    () =>
      StyleSheet.create({
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
      }),
    [themeColors.text, s],
  );
}

export type CommentsSectionStyles = ReturnType<typeof useCommentsSectionStyles>;
