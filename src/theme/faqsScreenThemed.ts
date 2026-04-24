import * as React from 'react';
import { StyleSheet } from 'react-native';
import type { Theme } from '@react-navigation/native';

export function useFaqsCategoryChipStyles(
  colors: Theme['colors'],
  active: boolean,
) {
  return React.useMemo(
    () =>
      StyleSheet.create({
        press: {
          paddingVertical: 8,
          paddingHorizontal: 14,
          borderRadius: 20,
          borderWidth: StyleSheet.hairlineWidth,
          overflow: 'hidden',
          borderColor: active ? colors.primary : colors.border,
          backgroundColor: colors.card,
        },
        pressDim: { opacity: 0.85 },
        label: {
          fontSize: 14,
          fontWeight: '600',
          color: active ? colors.primary : colors.text,
        },
      }),
    [active, colors.border, colors.card, colors.primary, colors.text],
  );
}

export function useFaqsSearchInputStyles(colors: Theme['colors']) {
  return React.useMemo(
    () =>
      StyleSheet.create({
        input: {
          marginHorizontal: 16,
          marginBottom: 10,
          borderRadius: 10,
          borderWidth: StyleSheet.hairlineWidth,
          paddingHorizontal: 14,
          paddingVertical: 10,
          fontSize: 16,
          borderColor: colors.border,
          color: colors.text,
          backgroundColor: colors.card,
        },
      }),
    [colors.border, colors.card, colors.text],
  );
}
