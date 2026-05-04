import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {View} from 'react-native';
import { Text } from '@/shared/ui/Text';

import { SafeHtmlContent } from '@/shared/ui/html';

import { TicketLabelValue } from '@/domains/support/components/TicketLabelValue';
import { TicketStatusBadge } from '@/domains/support/components/TicketStatusBadge';
import type { Ticket } from '@/domains/support/model/ticket.types';
import { createTicketScreenStyles } from '@/domains/support/ui/ticketScreen.styles';
import { formatTsIso } from '@/shared/utils/formatTsIso';
import { Button } from '@/ui/components/Button';

export type TicketCardProps = {
  ticket: Ticket;
  onOpen: (id: number) => void;
};

export const TicketCard = React.memo(function TicketCard({
  ticket,
  onOpen,
}: TicketCardProps) {
  const { colors } = useTheme();
  const styles = React.useMemo(
    () => createTicketScreenStyles(colors),
    [colors],
  );
  const { t, i18n } = useTranslation();

  const formattedCreatedAt = React.useMemo(
    () => formatTsIso(ticket.createdAt, i18n.language),
    [i18n.language, ticket.createdAt],
  );

  const onViewPress = React.useCallback(() => {
    onOpen(ticket.id);
  }, [onOpen, ticket.id]);

  return (
    <View style={styles.ticketCardOuter}>
      <View style={styles.ticketCard}>
        <View style={styles.ticketCardHeaderRow}>
          <SafeHtmlContent
            html={ticket.title}
            style={styles.ticketCardTitleText}
            numberOfLines={2}
          />
          <TicketStatusBadge status={ticket.status} styles={styles} />
        </View>

        <View style={styles.ticketCardFields}>
          <TicketLabelValue
            label={t('screens.support.tickets.card.ticketId')}
            value={ticket.ticketNumber}
            styles={styles}
          />
          <TicketLabelValue
            label={t('screens.support.tickets.card.category')}
            value={
              ticket.category.length > 0
                ? ticket.category
                : t('screens.support.tickets.card.categoryEmpty')
            }
            styles={styles}
          />
          <TicketLabelValue
            label={t('screens.support.tickets.card.submittedAt')}
            value={formattedCreatedAt}
            styles={styles}
          />
        </View>

        <Button
          layout="auto"
          variant="filled"
          title={t('screens.support.tickets.card.view')}
          accessibilityLabel={t('screens.support.tickets.card.view')}
          accessibilityHint={ticket.title}
          onPress={onViewPress}
          style={styles.ticketCardViewButton}
          contentStyle={{ width: '100%' }}
        >
          <Text style={styles.ticketCardViewButtonLabel}>
            {t('screens.support.tickets.card.view')}
          </Text>
        </Button>
      </View>
    </View>
  );
});
TicketCard.displayName = 'TicketCard';
