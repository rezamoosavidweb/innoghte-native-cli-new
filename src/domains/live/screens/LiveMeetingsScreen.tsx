import type { DrawerScreenProps } from '@react-navigation/drawer';
import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { LiveMeetingListCard } from '@/domains/live/ui/cards/LiveMeetingListCard';
import type { LiveMeetingType } from '@/domains/live/model/liveMeeting.entities';
import { useLiveMeetings } from '@/domains/live/hooks/useLiveMeetings';
import type { DrawerParamList } from '@/shared/contracts/navigationApp';
import { ListStateView } from '@/shared/ui/list-states/ListStateView';
import {
  flashListContentGutters,
  flashListEstimatedItemSize,
  flashListRowSeparators,
} from '@/ui/theme';

type Props = DrawerScreenProps<DrawerParamList, 'LiveMeetings'>;

const Sep = React.memo(function Sep() {
  return <View style={flashListRowSeparators.h12} />;
});
Sep.displayName = 'LiveMeetingsListSeparator';

const renderItem: ListRenderItem<LiveMeetingType> = ({ item }) => (
  <LiveMeetingListCard item={item} />
);

function keyExtractor(item: LiveMeetingType): string {
  return String(item.id);
}

const LiveMeetingsScreenComponent = (_props: Props) => {
  const { data, isPending, isError, error, refetch, isSuccess } =
    useLiveMeetings();
  const { t } = useTranslation();

  const listData = data ?? [];

  const showFullBleedLoading = isPending;

  const isEmpty = isSuccess && listData.length === 0;

  const retryOrRefetch = React.useCallback(() => {
    refetch().catch(() => {});
  }, [refetch]);

  const renderList = React.useCallback(() => {
    return (
      <FlashList<LiveMeetingType>
        data={listData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        estimatedItemSize={flashListEstimatedItemSize.liveMeeting}
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
      loadingMessage={t('screens.liveMeetings.loading')}
      errorTitle={t('screens.liveMeetings.error')}
      emptyTitle={t('screens.liveMeetings.empty')}
      retryLabel={t('listStates.retry')}
      safeAreaEdges={['left', 'right', 'bottom']}
    />
  );
};

export const LiveMeetingsScreen = React.memo(LiveMeetingsScreenComponent);
LiveMeetingsScreen.displayName = 'LiveMeetingsScreen';
