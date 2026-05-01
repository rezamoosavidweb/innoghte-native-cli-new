import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import { useQueryClient } from '@tanstack/react-query';

import * as React from 'react';

import { useTranslation } from 'react-i18next';

import { RefreshControl, View } from 'react-native';

import { CourseListCard } from '@/domains/courses/ui/cards/CourseListCard';

import type { Course } from '@/domains/courses/model/entities';

import { useInfiniteCourses } from '@/domains/courses/hooks/useInfiniteCourses';
import { coursesKeys } from '@/domains/courses/model/queryKeys';

import { useListPerformanceProfile } from '@/shared/infra/device/listPerformanceProfile';

import { ListFooterLoader } from '@/shared/ui/list-states/ListFooterLoader';

import { ListStateView } from '@/shared/ui/list-states/ListStateView';

import {
  flashListContentGutters,
  flashListEstimatedItemSize,
  flashListRowSeparators,
} from '@/ui/theme';

const Separator = React.memo(function CoursesListSeparator() {
  return <View style={flashListRowSeparators.h12} />;
});

Separator.displayName = 'CoursesListSeparator';

function keyExtractor(item: Course): string {
  return String(item.id);
}

const CoursesScreenComponent = () => {
  const perf = useListPerformanceProfile();
  const queryClient = useQueryClient();

  const renderCourseItem = React.useCallback<ListRenderItem<Course>>(
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
  } = useInfiniteCourses({ categoryId: 1 });

  const { t } = useTranslation();

  const estimatedItemSize = React.useMemo(
    () =>
      Math.max(
        80,
        Math.round(flashListEstimatedItemSize.course * perf.estimatedItemSizeFactor),
      ),
    [perf.estimatedItemSizeFactor],
  );

  const showFullBleedLoading = isPending;

  const isEmpty = isSuccess && flatData.length === 0;

  const refreshing = Boolean(isSuccess && flatData.length > 0 && isRefetching);

  const refresh = React.useCallback(() => {
    queryClient
      .invalidateQueries({ queryKey: coursesKeys.all })
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
      <FlashList<Course>
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
    scrollPropsForFlashList,
    perf.onEndReachedThreshold,
    perf.scrollEventThrottle,
    perf.decelerationRate,
    refreshControl,
    renderCourseItem,
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

export const CoursesScreen = React.memo(CoursesScreenComponent);

CoursesScreen.displayName = 'CoursesScreen';
