import * as React from 'react';
import { View } from 'react-native';

import CardLogo from '@/assets/icons/payments/card.svg';
import PaypalLogo from '@/assets/icons/payments/paypal.svg';
import VenmoLogo from '@/assets/icons/payments/venmo.svg';
import { useSelectPaymentTypeStyles } from '@/domains/basket/components/selectPaymentType.styles';
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

  return (
    <View style={s.row}>
      <Button
        layout="auto"
        variant="text"
        title="PayPal"
        onPress={() => onChange('paypal')}
        style={[s.card, value === 'paypal' && s.cardOn]}
        accessibilityState={{ selected: value === 'paypal' }}
        contentStyle={s.slot}
      >
        <PaypalLogo width={64} height={24} color={colors.text} />
      </Button>
      <View
        style={[s.card, s.cardDisabled]}
        accessibilityState={{ disabled: true }}
      >
        <VenmoLogo width={56} height={12} color={colors.textMuted} />
      </View>
      <Button
        layout="auto"
        variant="text"
        title="کارت اعتباری"
        onPress={() => onChange('credit_card')}
        style={[s.card, value === 'credit_card' && s.cardOn]}
        accessibilityState={{ selected: value === 'credit_card' }}
        contentStyle={s.slot}
      >
        <CardLogo width={52} height={20} color={colors.text} />
      </Button>
    </View>
  );
});
