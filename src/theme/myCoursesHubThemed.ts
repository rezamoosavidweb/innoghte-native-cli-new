import * as React from 'react';
import { StyleSheet } from 'react-native';
import type { Theme } from '@react-navigation/native';

export function useMyCoursesHubStyles(colors: Theme['colors']) {
  return React.useMemo(
    () =>
      StyleSheet.create({
        scroll: { flex: 1, backgroundColor: colors.background },
        subtitle: {
          fontSize: 15,
          lineHeight: 22,
          opacity: 0.8,
          color: colors.text,
        },
        menuRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 14,
          paddingHorizontal: 14,
          borderRadius: 12,
          borderWidth: StyleSheet.hairlineWidth,
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
        menuRowPressed: { opacity: 0.92 },
        menuRowLeft: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          flex: 1,
        },
        menuIcon: { fontSize: 22 },
        menuTitle: { fontSize: 16, fontWeight: '600', color: colors.text },
        chevron: {
          fontSize: 22,
          fontWeight: '300',
          opacity: 0.55,
          color: colors.text,
        },
      }),
    [colors.background, colors.border, colors.card, colors.text],
  );
}
