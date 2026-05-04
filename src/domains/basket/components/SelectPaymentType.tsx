import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/shared/ui/Text';

import { useSelectPaymentTypeStyles } from '@/domains/basket/components/selectPaymentType.styles';
import { isDotIr } from '@/shared/config/resolveIsDotIr';
import { useThemeColors } from '@/ui/theme';
import { Button } from '@/ui/components/Button';

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
      <Button
        layout="auto"
        variant="text"
        title="PayPal"
        onPress={() => onChange('paypal')}
        style={[s.chip, value === 'paypal' && s.chipOn]}
        accessibilityState={{ selected: value === 'paypal' }}
        contentStyle={{ width: '100%' }}
      >
        <Text style={s.lbl}>PayPal</Text>
      </Button>
      <Button
        layout="auto"
        variant="text"
        title="کارت اعتباری"
        onPress={() => onChange('credit_card')}
        style={[s.chip, value === 'credit_card' && s.chipOn]}
        accessibilityState={{ selected: value === 'credit_card' }}
        contentStyle={{ width: '100%' }}
      >
        <Text style={s.lbl}>کارت اعتباری</Text>
      </Button>
      <View style={[s.chip, s.chipMuted]}>
        <Text style={s.lbl}>—</Text>
      </View>
    </View>
  );
});
