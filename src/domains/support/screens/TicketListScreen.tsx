import type { DrawerScreenProps } from '@react-navigation/drawer';
import { useTheme } from '@react-navigation/native';
import { FlashList, type ListRenderItem } from '@shopify/flash-list';

import * as React from 'react';

import { useTranslation } from 'react-i18next';

import { Pressable, RefreshControl, Text, View } from 'react-native';

import { TicketCard } from '@/domains/support/components/TicketCard';
import { useInfiniteTickets } from '@/domains/support/hooks/useInfiniteTickets';
import type { Ticket } from '@/domains/support/model/ticket.types';
import { useTicketScreenStyles } from '@/domains/support/ui/ticketScreen.styles';
import type { DrawerParamList } from '@/shared/contracts/navigationApp';
import { useListPerformanceProfile } from '@/shared/infra/device/listPerformanceProfile';
import { useAppNavigation } from '@/shared/lib/navigation/useAppNavigation';
import { ListFooterLoader } from '@/shared/ui/list-states/ListFooterLoader';
import { ListStateView } from '@/shared/ui/list-states/ListStateView';
import {
  flashListContentGutters,
  flashListEstimatedItemSize,
  flashListRowSeparators,
} from '@/ui/theme';

type Props = DrawerScreenProps<DrawerParamList, 'TicketListScreen'>;

function keyExtractor(item: Ticket): string {
  return String(item.id);
}

const Separator = React.memo(function TicketListSeparator() {
  return <View style={flashListRowSeparators.h12} />;
});
Separator.displayName = 'TicketListSeparator';

const TicketListScreenComponent = (_props: Props) => {
  const perf = useListPerformanceProfile();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useAppNavigation();
  const ticketStyles = useTicketScreenStyles(colors);

  const {
    flatData,

    isPending,

    isError,

    isSuccess,

    error,

    refetch,

    fetchNextPage,

    isFetchingNextPage,

    isRefetching,

    flashListScrollMemory,
  } = useInfiniteTickets();

  const onOpenTicket = React.useCallback(
    (id: number) => {
      navigation.navigate('TicketDetailScreen', { id });
    },
    [navigation],
  );

  const onCreateTicket = React.useCallback(() => {
    navigation.navigate('CreateTicketScreen');
  }, [navigation]);

  const renderTicketItem = React.useCallback<ListRenderItem<Ticket>>(
    ({ item }) => <TicketCard ticket={item} onOpen={onOpenTicket} />,
    [onOpenTicket],
  );

  const listHeader = React.useMemo(
    () => (
      <>
        <Text style={ticketStyles.notice}>
          {t('screens.support.tickets.list.notice')}
        </Text>
        <View style={ticketStyles.headerRow}>
          <Text style={ticketStyles.ticketTitle}>
            {t('screens.support.tickets.list.title')}
          </Text>
          <Pressable accessibilityRole="button" onPress={onCreateTicket}>
            <Text style={ticketStyles.createTicketLinkText}>
              {t('screens.support.tickets.list.create')}
            </Text>
          </Pressable>
        </View>
      </>
    ),
    [
      onCreateTicket,
      t,
      ticketStyles.createTicketLinkText,
      ticketStyles.headerRow,
      ticketStyles.notice,
      ticketStyles.ticketTitle,
    ],
  );

  const estimatedItemSize = React.useMemo(
    () =>
      Math.max(
        240,
        Math.round(
          flashListEstimatedItemSize.liveMeeting *
            perf.estimatedItemSizeFactor,
        ),
      ),
    [perf.estimatedItemSizeFactor],
  );

  const showFullBleedLoading = isPending;

  const isEmpty = isSuccess && flatData.length === 0;

  const refreshing = Boolean(isSuccess && flatData.length > 0 && isRefetching);

  const refresh = React.useCallback(() => {
    refetch().catch(() => {});
  }, [refetch]);

  const {
    captureRef,
    scrollPropsForFlashList,
    shouldSuppressEndReached,
  } = flashListScrollMemory;

  const handleEndReached = React.useCallback(() => {
    if (shouldSuppressEndReached()) {
      return;
    }
    fetchNextPage().catch(() => {});
  }, [fetchNextPage, shouldSuppressEndReached]);

  const refreshControl = React.useMemo(
    () => <RefreshControl refreshing={refreshing} onRefresh={refresh} />,
    [refreshing, refresh],
  );

  const listFooter = React.useMemo(
    () => <ListFooterLoader visible={isFetchingNextPage} />,
    [isFetchingNextPage],
  );

  const renderList = React.useCallback(() => {
    return (
      <FlashList<Ticket>
        ref={captureRef}
        keyExtractor={keyExtractor}
        renderItem={renderTicketItem}
        data={flatData}
        estimatedItemSize={estimatedItemSize}
        ItemSeparatorComponent={Separator}
        ListHeaderComponent={listHeader}
        contentContainerStyle={flashListContentGutters.standard}
        showsVerticalScrollIndicator={false}
        onEndReached={handleEndReached}
        onEndReachedThreshold={perf.onEndReachedThreshold}
        {...scrollPropsForFlashList}
        scrollEventThrottle={perf.scrollEventThrottle}
        decelerationRate={perf.decelerationRate}
        ListFooterComponent={listFooter}
        refreshControl={refreshControl}
        style={ticketStyles.listFill}
      />
    );
  }, [
    captureRef,
    estimatedItemSize,
    flatData,
    handleEndReached,
    listFooter,
    listHeader,
    refreshControl,
    renderTicketItem,
    scrollPropsForFlashList,
    perf.decelerationRate,
    perf.onEndReachedThreshold,
    perf.scrollEventThrottle,
    ticketStyles.listFill,
  ]);

  const retryOrRefetch = React.useCallback(() => {
    refetch().catch(() => {});
  }, [refetch]);

  return (
    <ListStateView
      isLoading={showFullBleedLoading}
      isError={Boolean(isError)}
      error={error}
      isEmpty={isEmpty}
      onRetry={retryOrRefetch}
      renderList={renderList}
      loadingMessage={t('screens.support.states.loading')}
      errorTitle={t('screens.support.states.error')}
      emptyTitle={t('screens.support.tickets.list.empty')}
      retryLabel={t('listStates.retry')}
      safeAreaEdges={['left', 'right', 'bottom']}
    />
  );
};

export const TicketListScreen = React.memo(TicketListScreenComponent);
TicketListScreen.displayName = 'TicketListScreen';
