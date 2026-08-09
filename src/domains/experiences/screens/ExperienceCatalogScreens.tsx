import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import { useTheme } from '@react-navigation/native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as React from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { fetchExperienceCategories } from '@/domains/experiences/api/experiencesApi';
import {
  ExperienceCard,
  type ExperienceKind,
} from '@/domains/experiences/components/ExperienceCard';
import { WritingSubmissionForm } from '@/domains/experiences/components/WritingSubmissionForm';
import { useInfiniteCatalogItems } from '@/shared/catalog/hooks/useInfiniteCatalogItems';
import type { CatalogItem } from '@/shared/catalog/model/entities';
import { catalogKeys } from '@/shared/catalog/model/queryKeys';
import { Text } from '@/shared/ui/Text';
import { ListFooterLoader } from '@/shared/ui/list-states/ListFooterLoader';
import { ListStateView } from '@/shared/ui/list-states/ListStateView';

const CATEGORY_IDS: Record<ExperienceKind, number> = {
  meditation: 4,
  reading: 5,
  listening: 6,
  writing: 7,
};

const EXPERIENCE_CATEGORY_KEY = ['public', 'experience-categories'] as const;

function keyExtractor(item: CatalogItem): string {
  return String(item.id);
}

function ExperienceCatalog({ kind }: { kind: ExperienceKind }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const categoryId = CATEGORY_IDS[kind];
  const categoryQuery = useQuery({
    queryKey: EXPERIENCE_CATEGORY_KEY,
    queryFn: fetchExperienceCategories,
    staleTime: 10 * 60 * 1000,
  });
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
  } = useInfiniteCatalogItems({
    categoryId,
    perPage: kind === 'meditation' || kind === 'listening' ? 6 : 5,
  });

  const category = categoryQuery.data?.find(item => item.id === categoryId);

  const renderItem = React.useCallback<ListRenderItem<CatalogItem>>(
    ({ item }) => <ExperienceCard item={item} kind={kind} />,
    [kind],
  );

  const refresh = React.useCallback(() => {
    Promise.all([
      queryClient.invalidateQueries({ queryKey: catalogKeys.all }),
      queryClient.invalidateQueries({ queryKey: EXPERIENCE_CATEGORY_KEY }),
    ]).catch(() => {});
  }, [queryClient]);

  const retry = React.useCallback(() => {
    Promise.all([refetch(), categoryQuery.refetch()]).catch(() => {});
  }, [categoryQuery, refetch]);

  const renderHeader = React.useCallback(
    () => (
      <View style={styles.header}>
        <Text style={[styles.heading, { color: colors.text }]}>
          {category?.title ?? ''}
        </Text>
        {category?.list_title ? (
          <Text style={[styles.description, { color: colors.text }]}>
            {category.list_title}
          </Text>
        ) : null}
        {kind === 'writing' ? <WritingSubmissionForm /> : null}
      </View>
    ),
    [category?.list_title, category?.title, colors.text, kind],
  );

  const renderFooter = React.useCallback(
    () => (
      <View>
        <ListFooterLoader visible={isFetchingNextPage} />
      </View>
    ),
    [isFetchingNextPage],
  );

  const renderList = React.useCallback(
    () => (
      <FlashList<CatalogItem>
        data={flatData}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        estimatedItemSize={
          kind === 'meditation' || kind === 'listening' ? 720 : 620
        }
        ItemSeparatorComponent={Separator}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        onEndReached={() => {
          fetchNextPage().catch(() => {});
        }}
        onEndReachedThreshold={0.35}
        refreshControl={
          <RefreshControl
            refreshing={isSuccess && flatData.length > 0 && isRefetching}
            onRefresh={refresh}
            tintColor={colors.primary}
          />
        }
      />
    ),
    [
      colors.primary,
      fetchNextPage,
      flatData,
      isRefetching,
      isSuccess,
      kind,
      refresh,
      renderFooter,
      renderHeader,
      renderItem,
    ],
  );

  return (
    <ListStateView
      isLoading={isPending || categoryQuery.isPending}
      isError={isError || categoryQuery.isError}
      error={error ?? categoryQuery.error}
      isEmpty={isSuccess && flatData.length === 0}
      onRetry={retry}
      renderList={renderList}
      loadingMessage={t('screens.experienceCatalog.loading')}
      errorTitle={t('screens.experienceCatalog.error')}
      emptyTitle={t('screens.experienceCatalog.empty')}
      retryLabel={t('listStates.retry')}
      safeAreaEdges={['left', 'right', 'bottom']}
    />
  );
}

const Separator = React.memo(function Separator() {
  return <View style={styles.separator} />;
});

export const MeditationScreen = React.memo(() => (
  <ExperienceCatalog kind="meditation" />
));
export const ReadingScreen = React.memo(() => (
  <ExperienceCatalog kind="reading" />
));
export const ListeningScreen = React.memo(() => (
  <ExperienceCatalog kind="listening" />
));
export const WritingScreen = React.memo(() => (
  <ExperienceCatalog kind="writing" />
));

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 40,
  },
  header: { gap: 8, marginBottom: 22 },
  heading: { textAlign: 'right', fontSize: 25, fontWeight: '800' },
  description: {
    textAlign: 'justify',
    writingDirection: 'rtl',
    lineHeight: 28,
  },
  separator: { height: 18 },
});
