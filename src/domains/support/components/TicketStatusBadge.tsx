import * as React from 'react';
import {View} from 'react-native';
import { Text } from '@/shared/ui/Text';

import type { TicketScreenStyles } from '@/domains/support/ui/ticketScreen.styles';

export type TicketStatusBadgeProps = {
  status: string;
  styles: TicketScreenStyles;
};

export const TicketStatusBadge = React.memo(function TicketStatusBadge({
  status,
  styles,
}: TicketStatusBadgeProps) {
  const trimmed = status.trim();

  return (
    <View style={styles.ticketStatusBadge}>
      <Text style={styles.ticketStatusBadgeText} numberOfLines={2}>
        {trimmed.length > 0 ? trimmed : '—'}
      </Text>
    </View>
  );
});
TicketStatusBadge.displayName = 'TicketStatusBadge';
