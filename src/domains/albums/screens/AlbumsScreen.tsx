import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import { useQueryClient } from '@tanstack/react-query';

import * as React from 'react';

import { useTranslation } from 'react-i18next';

import { RefreshControl, View } from 'react-native';

import type { CatalogItem } from '@/shared/catalog/model/entities';

import { useInfiniteCatalogItems } from '@/shared/catalog/hooks/useInfiniteCatalogItems';
import { catalogKeys } from '@/shared/catalog/model/queryKeys';

import { useListPerformanceProfile } from '@/shared/infra/device/listPerformanceProfile';

import { ListFooterLoader } from '@/shared/ui/list-states/ListFooterLoader';

import { ListStateView } from '@/shared/ui/list-states/ListStateView';

import {
  flashListContentGutters,
  flashListEstimatedItemSize,
  flashListRowSeparators,
} from '@/ui/theme';
import { CourseListCard } from '@/shared/ui/cards/CourseListCard';

const COURSES_CATEGORY_ID = 9;

const Separator = React.memo(function AlbumsListSeparator() {
  return <View style={flashListRowSeparators.h12} />;
});

Separator.displayName = 'AlbumsListSeparator';

function keyExtractor(item: CatalogItem): string {
  return String(item.id);
}

const AlbumsScreenComponent = () => {
  const perf = useListPerformanceProfile();
  const queryClient = useQueryClient();

  const renderCourseItem = React.useCallback<ListRenderItem<CatalogItem>>(
    ({ item }) => <CourseListCard course={item} />,
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
  } = useInfiniteCatalogItems({ categoryId: COURSES_CATEGORY_ID });

  const { t } = useTranslation();

  const estimatedItemSize = Math.max(
    80,
    Math.round(
      flashListEstimatedItemSize.course * perf.estimatedItemSizeFactor,
    ),
  );

  const showFullBleedLoading = isPending;

  const isEmpty = isSuccess && flatData.length === 0;

  const refreshing = isSuccess && flatData.length > 0 && isRefetching;

  const refresh = React.useCallback(() => {
    queryClient
      .invalidateQueries({ queryKey: catalogKeys.all })
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

  const renderList = React.useCallback(() => {
    return (
      <FlashList<CatalogItem>
        ref={captureRef}
        keyExtractor={keyExtractor}
        renderItem={renderCourseItem}
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
        ListFooterComponent={<ListFooterLoader visible={isFetchingNextPage} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
      />
    );
  }, [
    captureRef,
    estimatedItemSize,
    flatData,
    handleEndReached,
    isFetchingNextPage,
    perf.decelerationRate,
    perf.onEndReachedThreshold,
    perf.scrollEventThrottle,
    refresh,
    refreshing,
    renderCourseItem,
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
      loadingMessage={t('screens.courses.loading')}
      errorTitle={t('screens.courses.error')}
      emptyTitle={t('screens.courses.empty')}
      retryLabel={t('listStates.retry')}
      safeAreaEdges={['left', 'right', 'bottom']}
    />
  );
};

export const AlbumsScreen = React.memo(AlbumsScreenComponent);

AlbumsScreen.displayName = 'AlbumsScreen';
