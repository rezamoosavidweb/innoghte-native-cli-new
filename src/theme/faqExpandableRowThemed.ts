import * as React from 'react';
import { StyleSheet } from 'react-native';
import type { Theme } from '@react-navigation/native';

export function useFaqExpandableRowStyles(colors: Theme['colors']) {
  return React.useMemo(
    () =>
      StyleSheet.create({
        wrap: {
          borderRadius: 10,
          borderWidth: StyleSheet.hairlineWidth,
          overflow: 'hidden',
          borderColor: colors.border,
          backgroundColor: colors.card,
        },
        header: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 12,
          paddingHorizontal: 12,
          gap: 12,
        },
        q: {
          fontSize: 15,
          fontWeight: '600',
          flex: 1,
          color: colors.text,
        },
        chev: { fontSize: 14, opacity: 0.6, color: colors.text },
        a: {
          fontSize: 14,
          lineHeight: 22,
          paddingHorizontal: 12,
          paddingBottom: 12,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.border,
          paddingTop: 10,
          color: colors.text,
        },
      }),
    [colors.border, colors.card, colors.text],
  );
}
