import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import { useQueryClient } from '@tanstack/react-query';

import * as React from 'react';

import { useTranslation } from 'react-i18next';

import { RefreshControl, View } from 'react-native';

import { PUBLIC_ALBUM_CATEGORY_ID } from '@/domains/media/model/publicCatalog';

import type { PublicAlbumTrack } from '@/domains/media/model';

import { useInfinitePublicAlbumTracks } from '@/domains/media/hooks/useInfinitePublicAlbumTracks';
import { publicAlbumInfiniteKeys } from '@/domains/media/model/queryKeys';

import { PublicAlbumTrackCard } from '@/domains/media/ui/cards/PublicAlbumTrackCard';

import { useListPerformanceProfile } from '@/shared/infra/device/listPerformanceProfile';

import { ListFooterLoader } from '@/shared/ui/list-states/ListFooterLoader';

import { ListStateView } from '@/shared/ui/list-states/ListStateView';

import {
  flashListContentGutters,
  flashListEstimatedItemSize,
  flashListRowSeparators,
} from '@/ui/theme';

const Separator = React.memo(function PublicAlbumsListSeparator() {
  return <View style={flashListRowSeparators.h12} />;
});

Separator.displayName = 'PublicAlbumsListSeparator';

function keyExtractor(item: PublicAlbumTrack): string {
  return String(item.id);
}

const PublicAlbumsScreenComponent = () => {
  const perf = useListPerformanceProfile();
  const queryClient = useQueryClient();

  const renderAlbumItem = React.useCallback<ListRenderItem<PublicAlbumTrack>>(
    ({ item }) => <PublicAlbumTrackCard item={item} />,
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
  } = useInfinitePublicAlbumTracks({ categoryId: PUBLIC_ALBUM_CATEGORY_ID });

  const { t } = useTranslation();

  const estimatedItemSize = React.useMemo(
    () =>
      Math.max(
        80,

        Math.round(
          flashListEstimatedItemSize.publicAlbumTrack *
            perf.estimatedItemSizeFactor,
        ),
      ),

    [perf.estimatedItemSizeFactor],
  );

  const showFullBleedLoading = isPending;

  const isEmpty = isSuccess && flatData.length === 0;

  const refreshing = Boolean(isSuccess && flatData.length > 0 && isRefetching);

  const refresh = React.useCallback(() => {
    queryClient
      .invalidateQueries({ queryKey: publicAlbumInfiniteKeys.all })
      .catch(() => {});
  }, [queryClient]);

  const { captureRef, scrollPropsForFlashList, shouldSuppressEndReached } =
    flashListScrollMemory;

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
      <FlashList<PublicAlbumTrack>
        ref={captureRef}
        keyExtractor={keyExtractor}
        renderItem={renderAlbumItem}
        data={flatData}
        estimatedItemSize={estimatedItemSize}
        ItemSeparatorComponent={Separator}
        contentContainerStyle={flashListContentGutters.standard}
        showsVerticalScrollIndicator={false}
        onEndReached={handleEndReached}
        onEndReachedThreshold={perf.onEndReachedThreshold}
        {...scrollPropsForFlashList}
        scrollEventThrottle={perf.scrollEventThrottle}
        decelerationRate={perf.decelerationRate}
        ListFooterComponent={listFooter}
        refreshControl={refreshControl}
      />
    );
  }, [
    captureRef,
    estimatedItemSize,
    flatData,
    handleEndReached,
    listFooter,
    perf.decelerationRate,
    perf.onEndReachedThreshold,
    perf.scrollEventThrottle,
    refreshControl,
    renderAlbumItem,
    scrollPropsForFlashList,
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
      loadingMessage={t('screens.publicAlbums.loading')}
      errorTitle={t('screens.publicAlbums.error')}
      emptyTitle={t('screens.publicAlbums.empty')}
      retryLabel={t('listStates.retry')}
      safeAreaEdges={['left', 'right', 'bottom']}
    />
  );
};

export const PublicAlbumsScreen = React.memo(PublicAlbumsScreenComponent);

PublicAlbumsScreen.displayName = 'PublicAlbumsScreen';
