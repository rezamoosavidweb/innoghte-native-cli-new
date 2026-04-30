import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useThemeColors, fontSize, fontWeight, spacing } from '@/ui/theme';

type Props = {
  title: string;
  subtitle?: string;
};

export const CartHeader = React.memo(function CartHeader({ title, subtitle }: Props) {
  const colors = useThemeColors();
  const s = React.useMemo(
    () =>
      StyleSheet.create({
        wrap: { marginBottom: spacing.md },
        title: {
          fontSize: fontSize.lg + 2,
          fontWeight: fontWeight.semibold,
          color: colors.text,
        },
        sub: {
          marginTop: spacing.xs,
          fontSize: fontSize.sm,
          color: colors.textSecondary,
        },
      }),
    [colors.text, colors.textSecondary],
  );

  return (
    <View style={s.wrap}>
      <Text style={s.title}>{title}</Text>
      {subtitle ? <Text style={s.sub}>{subtitle}</Text> : null}
    </View>
  );
});
