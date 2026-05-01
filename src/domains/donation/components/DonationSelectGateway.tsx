import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import {Pressable, View} from 'react-native';
import { Text } from '@/shared/ui/Text';

import {
  resolveShowVandar,
  resolveShowZarinpal,
} from '@/domains/donation/model/env';
import { useDonationSelectGatewayStyles } from '@/domains/donation/styles/donationSelectGateway.styles';
import { pickSemantic } from '@/ui/theme';

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
        <Pressable
          onPress={() => onChange('zarinpal')}
          style={[s.chip, gateway === 'zarinpal' && s.chipActive]}
          accessibilityRole="button"
          accessibilityState={{ selected: gateway === 'zarinpal' }}
        >
          <Text style={s.chipLabel}>زرین‌پال</Text>
        </Pressable>
      )}
      {showVandar && (
        <Pressable
          onPress={() => onChange('vandar')}
          style={[s.chip, gateway === 'vandar' && s.chipActive]}
          accessibilityRole="button"
          accessibilityState={{ selected: gateway === 'vandar' }}
        >
          <Text style={s.chipLabel}>وندار</Text>
        </Pressable>
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
