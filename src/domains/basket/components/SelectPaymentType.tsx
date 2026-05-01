import * as React from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '@/shared/ui/Text';

import { useSelectPaymentTypeStyles } from '@/domains/basket/components/selectPaymentType.styles';
import { isDotIr } from '@/shared/config/resolveIsDotIr';
import { useThemeColors } from '@/ui/theme';

type Props = {
  value: 'paypal' | 'credit_card';
  onChange: (v: 'paypal' | 'credit_card') => void;
};

export const SelectPaymentType = React.memo(function SelectPaymentType({
  value,
  onChange,
}: Props) {
  const colors = useThemeColors();

  const s = useSelectPaymentTypeStyles(colors);

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
