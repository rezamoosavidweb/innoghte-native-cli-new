import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/shared/ui/Text';

import { useDonationSelectGatewayStyles } from '@/domains/donation/ui/donationSelectGateway.styles';
import { pickSemantic } from '@/ui/theme';
import { Button } from '@/ui/components/Button';
import { enabledIranGateways } from '@/shared/config/commerceMarket';

export type DonationSelectGatewayProps = {
  gateway: 'vandar' | 'zarinpal';
  onChange: (gateway: 'vandar' | 'zarinpal') => void;
};

/** Gateway picker — both options always selectable, matching the basket. */
export const DonationSelectGateway = React.memo(function DonationSelectGateway({
  gateway,
  onChange,
}: DonationSelectGatewayProps) {
  const theme = useTheme();
  const { colors } = theme;
  const semantic = pickSemantic(theme);

  const s = useDonationSelectGatewayStyles(colors.card, colors.text, semantic);

  return (
    <View style={s.row}>
      {enabledIranGateways.map(item => {
        const label = item === 'zarinpal' ? 'زرین‌پال' : 'وندار';
        return (
          <Button
            key={item}
            layout="auto"
            variant="text"
            title={label}
            onPress={() => onChange(item)}
            style={[s.chip, gateway === item && s.chipActive]}
            accessibilityState={{ selected: gateway === item }}
            contentStyle={{ width: '100%' }}
          >
            <Text style={s.chipLabel}>{label}</Text>
          </Button>
        );
      })}
    </View>
  );
});
DonationSelectGateway.displayName = 'DonationSelectGateway';
