import { useTheme, type Theme } from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet } from 'react-native';

import {
  fontSize,
  fontWeight,
  pickSemantic,
  radius,
  spacing,
} from '@/theme';

function createSettingsScreenStyles(
  themeColors: Theme['colors'],
  s: ReturnType<typeof pickSemantic>,
) {
  return StyleSheet.create({
    section: {
      marginTop: spacing.xl,
      width: '100%',
      maxWidth: 320,
      gap: spacing.md,
    },
    row: {
      flexDirection: 'row',
      gap: spacing.md - 2,
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    chip: {
      paddingVertical: 10,
      paddingHorizontal: spacing.base,
      borderRadius: radius.lg - 2,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: s.chipBorder,
      backgroundColor: s.chipBackground,
    },
    chipActive: {
      borderColor: s.chipActiveBorder,
      backgroundColor: s.chipActiveBackground,
    },
    chipText: {
      fontSize: fontSize.md + 1,
      fontWeight: fontWeight.semibold,
      color: themeColors.text,
    },
  });
}

export function useSettingsScreenStyles() {
  const { colors, dark } = useTheme();
  const s = pickSemantic(dark);
  return React.useMemo(
    () => createSettingsScreenStyles(colors, s),
    [colors, s],
  );
}
