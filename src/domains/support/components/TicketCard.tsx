import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { TicketLabelValue } from '@/domains/support/components/TicketLabelValue';
import { TicketStatusBadge } from '@/domains/support/components/TicketStatusBadge';
import type { Ticket } from '@/domains/support/model/ticket.types';
import { useTicketScreenStyles } from '@/domains/support/ui/ticketScreen.styles';

export type TicketCardProps = {
  ticket: Ticket;
  onOpen: (id: number) => void;
};

function formatTicketDate(iso: string, locale: string): string {
  try {
    return new Date(iso).toLocaleString(locale === 'fa' ? 'fa-IR' : undefined);
  } catch {
    return iso;
  }
}

export const TicketCard = React.memo(function TicketCard({
  ticket,
  onOpen,
}: TicketCardProps) {
  const { colors } = useTheme();
  const styles = useTicketScreenStyles(colors);
  const { t, i18n } = useTranslation();

  const formattedCreatedAt = React.useMemo(
    () => formatTicketDate(ticket.createdAt, i18n.language),
    [i18n.language, ticket.createdAt],
  );

  const onViewPress = React.useCallback(() => {
    onOpen(ticket.id);
  }, [onOpen, ticket.id]);

  return (
    <View style={styles.ticketCardOuter}>
      <View style={styles.ticketCard}>
        <View style={styles.ticketCardHeaderRow}>
          <Text style={styles.ticketCardTitleText} numberOfLines={2}>
            {ticket.title}
          </Text>
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

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('screens.support.tickets.card.view')}
          accessibilityHint={ticket.title}
          onPress={onViewPress}
          style={({ pressed }) => [
            styles.ticketCardViewButton,
            pressed ? styles.ticketCardViewButtonPressed : null,
          ]}
        >
          <Text style={styles.ticketCardViewButtonLabel}>
            {t('screens.support.tickets.card.view')}
          </Text>
        </Pressable>
      </View>
    </View>
  );
});
TicketCard.displayName = 'TicketCard';
