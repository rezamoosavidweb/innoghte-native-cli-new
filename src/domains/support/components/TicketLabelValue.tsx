import * as React from 'react';
import {View} from 'react-native';
import { Text } from '@/shared/ui/Text';

import type { TicketScreenStyles } from '@/domains/support/ui/ticketScreen.styles';

export type TicketLabelValueProps = {
  label: string;
  value: string;
  styles: TicketScreenStyles;
};

export const TicketLabelValue = React.memo(function TicketLabelValue({
  label,
  value,
  styles,
}: TicketLabelValueProps) {
  return (
    <View style={styles.ticketLabelValueRow}>
      <Text style={styles.ticketLabelValueLabel}>{label}</Text>
      <Text
        style={styles.ticketLabelValueValue}
        numberOfLines={3}
        ellipsizeMode="tail"
      >
        {value}
      </Text>
    </View>
  );
});
TicketLabelValue.displayName = 'TicketLabelValue';
