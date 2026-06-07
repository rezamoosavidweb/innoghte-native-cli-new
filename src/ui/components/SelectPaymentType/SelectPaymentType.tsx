import * as React from 'react';
import { View } from 'react-native';

import CardLogo from '@/assets/icons/payments/card.svg';
import PaypalLogo from '@/assets/icons/payments/paypal.svg';
import VenmoLogo from '@/assets/icons/payments/venmo.svg';
import { useThemeColors } from '@/ui/theme';
import { Button } from '@/ui/components/Button';

import { useSelectPaymentTypeStyles } from './selectPaymentType.styles';

export type SelectPaymentTypeValue = 'paypal' | 'credit_card';

type Props = {
  value: SelectPaymentTypeValue;
  onChange: (v: SelectPaymentTypeValue) => void;
};

/**
 * `.com` payment-method selector: PayPal and Card are selectable; Venmo is
 * shown disabled (no backend support). Brand logos adapt to the theme via
 * `currentColor`. Shared across basket + donation checkout.
 */
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
SelectPaymentType.displayName = 'SelectPaymentType';
