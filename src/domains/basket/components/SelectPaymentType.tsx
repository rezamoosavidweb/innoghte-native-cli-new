import * as React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { resolveIsDotIr } from '@/shared/config/resolveIsDotIr';
import { useThemeColors, fontSize, fontWeight, radius, spacing } from '@/ui/theme';

type Props = {
  value: 'paypal' | 'credit_card';
  onChange: (v: 'paypal' | 'credit_card') => void;
};

export const SelectPaymentType = React.memo(function SelectPaymentType({
  value,
  onChange,
}: Props) {
  const colors = useThemeColors();
  const isDotIr = resolveIsDotIr();

  const s = React.useMemo(
    () =>
      StyleSheet.create({
        row: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
        chip: {
          flex: 1,
          paddingVertical: spacing.lg,
          borderRadius: radius.md,
          borderWidth: 2,
          borderColor: colors.border,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.surface,
        },
        chipOn: { borderColor: colors.textSecondary },
        chipMuted: { opacity: 0.45 },
        lbl: { fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: colors.text },
      }),
    [colors],
  );

  if (isDotIr) {
    return (
      <View style={s.row}>
        <View style={[s.chip, s.chipOn]}>
          <Text style={s.lbl}>پرداخت بانکی</Text>
        </View>
        <View style={[s.chip, s.chipMuted]}>
          <Text style={s.lbl}>—</Text>
        </View>
        <View style={[s.chip, s.chipMuted]}>
          <Text style={s.lbl}>—</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={s.row}>
      <Pressable
        onPress={() => onChange('paypal')}
        style={[s.chip, value === 'paypal' && s.chipOn]}
        accessibilityRole="button"
        accessibilityState={{ selected: value === 'paypal' }}
      >
        <Text style={s.lbl}>PayPal</Text>
      </Pressable>
      <Pressable
        onPress={() => onChange('credit_card')}
        style={[s.chip, value === 'credit_card' && s.chipOn]}
        accessibilityRole="button"
        accessibilityState={{ selected: value === 'credit_card' }}
      >
        <Text style={s.lbl}>کارت اعتباری</Text>
      </Pressable>
      <View style={[s.chip, s.chipMuted]}>
        <Text style={s.lbl}>—</Text>
      </View>
    </View>
  );
});
