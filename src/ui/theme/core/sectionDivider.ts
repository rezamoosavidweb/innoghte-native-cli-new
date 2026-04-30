import type { Theme } from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet } from 'react-native';

import {
  fontSize,
  fontWeight,
  pickSemantic,
  spacing,
} from '@/ui/theme';

export type SectionDividerStyleSet = ReturnType<
  typeof createSectionDividerStyles
>;

function createSectionDividerStyles(
  colors: Theme['colors'],
  sSemantic: ReturnType<typeof pickSemantic>,
) {
  return StyleSheet.create({
    root: {
      marginTop: spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    title: {
      flexShrink: 0,
      fontSize: fontSize.sm,
      fontWeight: fontWeight.bold,
      letterSpacing: 0.4,
      textTransform: 'uppercase',
      color: sSemantic.textSecondary,
    },
    line: {
      flex: 1,
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.border,
    },
  });
}

/** Token-based styles for {@link SectionDivider} — safe for profile, drawer, and other surfaces. */
export function useSectionDividerStyles(
  colors: Theme['colors'],
  navigationTheme: Theme,
) {
  const sSemantic = pickSemantic(navigationTheme);
  return React.useMemo(
    () => createSectionDividerStyles(colors, sSemantic),
    [colors, sSemantic],
  );
}
