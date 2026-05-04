import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import { useQueryClient } from '@tanstack/react-query';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshControl, View } from 'react-native';

import { AlbumListCard } from '@/domains/albums/ui/cards/AlbumListCard';
import type { Album } from '@/domains/albums/model';
import { useInfiniteAlbums } from '@/domains/albums/hooks/useInfiniteAlbums';
import { albumsKeys } from '@/domains/albums/model/queryKeys';

import { useListPerformanceProfile } from '@/shared/infra/device/listPerformanceProfile';
import { ListFooterLoader } from '@/shared/ui/list-states/ListFooterLoader';
import { ListStateView } from '@/shared/ui/list-states/ListStateView';
import {
  flashListContentGutters,
  flashListEstimatedItemSize,
  flashListRowSeparators,
} from '@/ui/theme';

const LIST_CATEGORY_ID = 1;

const AlbumsCatalogRowSeparator = React.memo(function AlbumsCatalogRowSeparator() {
  return <View style={flashListRowSeparators.h12} />;
});
AlbumsCatalogRowSeparator.displayName = 'AlbumsCatalogRowSeparator';

function albumRowKeyExtractor(item: Album): string {
  return String(item.id);
}

const AlbumsScreenComponent = () => {
  const perf = useListPerformanceProfile();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const renderAlbumRow = React.useCallback<ListRenderItem<Album>>(
    ({ item }) => <AlbumListCard album={item} />,
    [],
  );

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
  } = useInfiniteAlbums({ categoryId: LIST_CATEGORY_ID });

  const estimatedRowSize = Math.max(
    80,
    Math.round(flashListEstimatedItemSize.album * perf.estimatedItemSizeFactor),
  );

  const showBlockingLoader = isPending;
  const listIsEmpty = isSuccess && flatData.length === 0;
  const pullRefreshing = isSuccess && flatData.length > 0 && isRefetching;

  const onPullRefresh = React.useCallback(() => {
    queryClient.invalidateQueries({ queryKey: albumsKeys.all }).catch(() => {});
  }, [queryClient]);

  const { captureRef, scrollPropsForFlashList, shouldSuppressEndReached } =
    flashListScrollMemory;

  const onListEndApproaching = React.useCallback(() => {
    if (shouldSuppressEndReached()) {
      return;
    }
    fetchNextPage().catch(() => {});
  }, [fetchNextPage, shouldSuppressEndReached]);

  const renderAlbumFlashList = React.useCallback(() => {
    return (
      <FlashList<Album>
        ref={captureRef}
        keyExtractor={albumRowKeyExtractor}
        renderItem={renderAlbumRow}
        data={flatData}
        estimatedItemSize={estimatedRowSize}
        ItemSeparatorComponent={AlbumsCatalogRowSeparator}
        contentContainerStyle={flashListContentGutters.standard}
        showsVerticalScrollIndicator={false}
        onEndReached={onListEndApproaching}
        onEndReachedThreshold={perf.onEndReachedThreshold}
        {...scrollPropsForFlashList}
        scrollEventThrottle={perf.scrollEventThrottle}
        decelerationRate={perf.decelerationRate}
        ListFooterComponent={<ListFooterLoader visible={isFetchingNextPage} />}
        refreshControl={<RefreshControl refreshing={pullRefreshing} onRefresh={onPullRefresh} />}
      />
    );
  }, [
    captureRef,
    estimatedRowSize,
    flatData,
    isFetchingNextPage,
    onListEndApproaching,
    onPullRefresh,
    perf.decelerationRate,
    perf.onEndReachedThreshold,
    perf.scrollEventThrottle,
    pullRefreshing,
    renderAlbumRow,
    scrollPropsForFlashList,
  ]);

  const onRetryList = React.useCallback(() => {
    refetch().catch(() => {});
  }, [refetch]);

  return (
    <ListStateView
      isLoading={showBlockingLoader}
      isError={Boolean(isError)}
      error={error}
      isEmpty={listIsEmpty}
      onRetry={onRetryList}
      renderList={renderAlbumFlashList}
      loadingMessage={t('screens.albums.loading')}
      errorTitle={t('screens.albums.error')}
      emptyTitle={t('screens.albums.empty')}
      retryLabel={t('listStates.retry')}
      safeAreaEdges={['left', 'right', 'bottom']}
    />
  );
};

export const AlbumsScreen = React.memo(AlbumsScreenComponent);
AlbumsScreen.displayName = 'AlbumsScreen';
