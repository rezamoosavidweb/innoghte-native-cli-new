import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import { useQueryClient } from '@tanstack/react-query';
import * as React from 'react';
import { RefreshControl, View } from 'react-native';

import { useInfiniteCatalogItems } from '@/shared/catalog/hooks/useInfiniteCatalogItems';
import type { CatalogItem } from '@/shared/catalog/model/entities';
import { catalogKeys } from '@/shared/catalog/model/queryKeys';
import { useListPerformanceProfile } from '@/shared/infra/device/listPerformanceProfile';
import { CourseListCard } from '@/shared/ui/cards/CourseListCard';
import { ListFooterLoader } from '@/shared/ui/list-states/ListFooterLoader';
import { ListStateView } from '@/shared/ui/list-states/ListStateView';
import {
  flashListContentGutters,
  flashListEstimatedItemSize,
  flashListRowSeparators,
} from '@/ui/theme';

export type CategoryCatalogCopy = Readonly<{
  loading: string;
  error: string;
  empty: string;
  retry: string;
}>;

export type CategoryCatalogScreenProps = Readonly<{
  categoryId: number;
  copy: CategoryCatalogCopy;
  detailKind?: 'course' | 'audioBook';
}>;

const Separator = React.memo(function CategoryCatalogSeparator() {
  return <View style={flashListRowSeparators.h12} />;
});

function keyExtractor(item: CatalogItem): string {
  return String(item.id);
}

export function CategoryCatalogScreen({
  categoryId,
  copy,
  detailKind = 'course',
}: CategoryCatalogScreenProps) {
  const perf = useListPerformanceProfile();
  const queryClient = useQueryClient();
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
  } = useInfiniteCatalogItems({ categoryId });

  const renderItem = React.useCallback<ListRenderItem<CatalogItem>>(
    ({ item }) => (
      <CourseListCard course={item} detailKind={detailKind} />
    ),
    [detailKind],
  );

  const estimatedItemSize = Math.max(
    80,
    Math.round(
      flashListEstimatedItemSize.course * perf.estimatedItemSizeFactor,
    ),
  );
  const refreshing = isSuccess && flatData.length > 0 && isRefetching;
  const { captureRef, scrollPropsForFlashList, shouldSuppressEndReached } =
    flashListScrollMemory;

  const refresh = React.useCallback(() => {
    queryClient
      .invalidateQueries({ queryKey: catalogKeys.all })
      .catch(() => {});
  }, [queryClient]);

  const onEndReached = React.useCallback(() => {
    if (!shouldSuppressEndReached()) {
      fetchNextPage().catch(() => {});
    }
  }, [fetchNextPage, shouldSuppressEndReached]);

  const retry = React.useCallback(() => {
    refetch().catch(() => {});
  }, [refetch]);

  const renderList = React.useCallback(
    () => (
      <FlashList<CatalogItem>
        ref={captureRef}
        data={flatData}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        estimatedItemSize={estimatedItemSize}
        ItemSeparatorComponent={Separator}
        contentContainerStyle={flashListContentGutters.standard}
        showsVerticalScrollIndicator={false}
        onEndReached={onEndReached}
        onEndReachedThreshold={perf.onEndReachedThreshold}
        {...scrollPropsForFlashList}
        scrollEventThrottle={perf.scrollEventThrottle}
        decelerationRate={perf.decelerationRate}
        ListFooterComponent={
          <ListFooterLoader visible={isFetchingNextPage} />
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
      />
    ),
    [
      captureRef,
      estimatedItemSize,
      flatData,
      isFetchingNextPage,
      onEndReached,
      perf.decelerationRate,
      perf.onEndReachedThreshold,
      perf.scrollEventThrottle,
      refresh,
      refreshing,
      renderItem,
      scrollPropsForFlashList,
    ],
  );

  return (
    <ListStateView
      isLoading={isPending}
      isError={Boolean(isError)}
      error={error}
      isEmpty={isSuccess && flatData.length === 0}
      onRetry={retry}
      renderList={renderList}
      loadingMessage={copy.loading}
      errorTitle={copy.error}
      emptyTitle={copy.empty}
      retryLabel={copy.retry}
      safeAreaEdges={['left', 'right', 'bottom']}
    />
  );
}
