import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { Pressable, Text, View } from 'react-native';

import { createDonationSelectPaymentTypeStyles } from '@/domains/donation/styles/donationSelectPaymentType.styles';
import { pickSemantic } from '@/ui/theme';

export type DonationSelectPaymentTypeProps = {
  value: 'paypal' | 'credit_card';
  onChange: (value: 'paypal' | 'credit_card') => void;
};

export const DonationSelectPaymentType = React.memo(
  function DonationSelectPaymentType({
    value,
    onChange,
  }: DonationSelectPaymentTypeProps) {
    const theme = useTheme();
    const { colors } = theme;
    const semantic = pickSemantic(theme);

    const s = React.useMemo(
      () =>
        createDonationSelectPaymentTypeStyles({
          colors: { ...semantic, text: colors.text },
          semantic,
        }),
      [colors.text, semantic],
    );

    return (
      <View style={s.row}>
        <Text style={s.label}>روش پرداخت:</Text>
        <Pressable
          onPress={() => onChange('paypal')}
          style={[s.chip, value === 'paypal' && s.chipOn]}
          accessibilityRole="button"
          accessibilityState={{ selected: value === 'paypal' }}
        >
          <Text style={[s.chipText, value === 'paypal' && s.chipTextOn]}>
            PayPal
          </Text>
        </Pressable>
        <Pressable
          onPress={() => onChange('credit_card')}
          style={[s.chip, value === 'credit_card' && s.chipOn]}
          accessibilityRole="button"
          accessibilityState={{ selected: value === 'credit_card' }}
        >
          <Text style={[s.chipText, value === 'credit_card' && s.chipTextOn]}>
            کارت
          </Text>
        </Pressable>
      </View>
    );
  },
);
DonationSelectPaymentType.displayName = 'DonationSelectPaymentType';
