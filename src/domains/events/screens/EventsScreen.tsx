import * as React from 'react';
import { View } from 'react-native';
import type { DrawerScreenProps } from '@react-navigation/drawer';
import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import { useTranslation } from 'react-i18next';

import { EventListCard } from '@/domains/events/ui/cards/EventListCard';
import type { EventType } from '@/domains/events/model/event.entities';
import { useEvents } from '@/domains/events/hooks/useEvents';
import type { DrawerParamList } from '@/shared/contracts/navigationApp';
import { ListStateView } from '@/shared/ui/list-states/ListStateView';
import {
  flashListContentGutters,
  flashListEstimatedItemSize,
  flashListRowSeparators,
} from '@/ui/theme';

type Props = DrawerScreenProps<DrawerParamList, 'Events'>;

const Sep = React.memo(function Sep() {
  return <View style={flashListRowSeparators.h12} />;
});
Sep.displayName = 'EventsListSeparator';

const renderItem: ListRenderItem<EventType> = ({ item }) => (
  <EventListCard item={item} />
);

function keyExtractor(item: EventType): string {
  return String(item.id);
}

const EventsScreenComponent = (_props: Props) => {
  const { data, isPending, isError, error, refetch, isSuccess } = useEvents();
  const { t } = useTranslation();

  const listData = data ?? [];

  const showFullBleedLoading = isPending;

  const isEmpty = isSuccess && listData.length === 0;

  const retryOrRefetch = React.useCallback(() => {
    refetch().catch(() => {});
  }, [refetch]);

  const renderList = React.useCallback(() => {
    return (
      <FlashList<EventType>
        data={listData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        estimatedItemSize={flashListEstimatedItemSize.event}
        ItemSeparatorComponent={Sep}
        contentContainerStyle={flashListContentGutters.standard}
        showsVerticalScrollIndicator={false}
      />
    );
  }, [listData]);

  return (
    <ListStateView
      isLoading={showFullBleedLoading}
      isError={Boolean(isError)}
      error={error}
      isEmpty={isEmpty}
      onRetry={retryOrRefetch}
      renderList={renderList}
      loadingMessage={t('screens.events.loading')}
      errorTitle={t('screens.events.error')}
      emptyTitle={t('screens.events.empty')}
      retryLabel={t('listStates.retry')}
      safeAreaEdges={['left', 'right', 'bottom']}
    />
  );
};

export const EventsScreen = React.memo(EventsScreenComponent);
EventsScreen.displayName = 'EventsScreen';
