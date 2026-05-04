import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import {View} from 'react-native';
import { Text } from '@/shared/ui/Text';

import {
  resolveShowVandar,
  resolveShowZarinpal,
} from '@/domains/donation/model/env';
import { useDonationSelectGatewayStyles } from '@/domains/donation/ui/donationSelectGateway.styles';
import { pickSemantic } from '@/ui/theme';
import { Button } from '@/ui/components/Button';

export type DonationSelectGatewayProps = {
  gateway: 'vandar' | 'zarinpal';
  onChange: (gateway: 'vandar' | 'zarinpal') => void;
};

export const DonationSelectGateway = React.memo(function DonationSelectGateway({
  gateway,
  onChange,
}: DonationSelectGatewayProps) {
  const theme = useTheme();
  const { colors } = theme;
  const semantic = pickSemantic(theme);
  const showZarinpal = resolveShowZarinpal();
  const showVandar = resolveShowVandar();

  const s = useDonationSelectGatewayStyles(colors.card, colors.text, semantic);

  return (
    <View style={s.row}>
      {showZarinpal && (
        <Button
          layout="auto"
          variant="text"
          title="زرین‌پال"
          onPress={() => onChange('zarinpal')}
          style={[s.chip, gateway === 'zarinpal' && s.chipActive]}
          accessibilityState={{ selected: gateway === 'zarinpal' }}
          contentStyle={{ width: '100%' }}
        >
          <Text style={s.chipLabel}>زرین‌پال</Text>
        </Button>
      )}
      {showVandar && (
        <Button
          layout="auto"
          variant="text"
          title="وندار"
          onPress={() => onChange('vandar')}
          style={[s.chip, gateway === 'vandar' && s.chipActive]}
          accessibilityState={{ selected: gateway === 'vandar' }}
          contentStyle={{ width: '100%' }}
        >
          <Text style={s.chipLabel}>وندار</Text>
        </Button>
      )}
      {!showZarinpal && !showVandar && (
        <>
          <View style={[s.chip, s.chipDisabled]}>
            <Text style={s.chipLabel}>زرین‌پال</Text>
          </View>
          <View style={[s.chip, s.chipDisabled]}>
            <Text style={s.chipLabel}>وندار</Text>
          </View>
        </>
      )}
    </View>
  );
});
DonationSelectGateway.displayName = 'DonationSelectGateway';
