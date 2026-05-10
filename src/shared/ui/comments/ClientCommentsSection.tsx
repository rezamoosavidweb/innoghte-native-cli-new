import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { FlatList, StyleSheet, View, type ListRenderItem } from 'react-native';
import type { z } from 'zod';

import { commentSchema } from '@/domains/home/model/comments.schema';
import { useCatalogItemComments } from '@/shared/catalog/hooks/useCatalogItemComments';
import { Text } from '@/shared/ui/Text';

import { createClientCommentStyles } from '@/shared/ui/comments/clientComments.styles';
import { CommentsPagination } from '@/shared/ui/comments/CommentsPagination';
import { CommentsSkeleton } from '@/shared/ui/comments/CommentsSkeleton';
import { CommentCard } from '@/ui/components/CommentCard';
import { spacing } from '@/ui/theme';

export type CommentDto = z.infer<typeof commentSchema>;

export type ClientCommentsSectionProps = {
  title: string;
  withExtraInfo?: boolean;
  bgcolor?: string;
  courseId?: number;
  categoryId?: number;
  perPage?: number;
  shoIfEmpty?: boolean;
};

const keyExtractor = (item: CommentDto) => String(item.id);

function ClientCommentsSectionComponent({
  title,
  courseId,
  categoryId,
  perPage = 10,
  shoIfEmpty = false,
}: ClientCommentsSectionProps) {
  const [currentPage, setCurrentPage] = React.useState(1);

  const { colors } = useTheme();
  const anonymousLabel = 'Anonymous';
  const { data, isFetching } = useCatalogItemComments(
    currentPage,
    perPage,
    courseId,
    categoryId,
  );

  const pageData = data?.data ?? [];
  const pag = data?.pagination as
    | { total?: number; total_items?: number; per_page?: number }
    | undefined;
  const total = Number(pag?.total ?? pag?.total_items ?? 0);
  const per_page = Number(pag?.per_page ?? perPage);
  const totalPage = per_page ? Math.ceil(total / per_page) : 0;

  const onPageChange = React.useCallback((p: number) => {
    setCurrentPage(p);
  }, []);

  const showPagination = total > 0 && per_page > 0 && total > per_page;

  const clientCommentStyles = createClientCommentStyles(colors);

  const renderItem = React.useCallback<ListRenderItem<CommentDto>>(
    ({ item, index }) => (
      <CommentCard
        content={item.comment}
        writer={item.user?.full_name}
        courseTitle={item?.course}
        anonymousLabel={anonymousLabel}
        index={index}
        starColor={colors.primary}
        numberOfLines={12}
      />
    ),
    [colors.primary],
  );

  const listFooter =
    showPagination && totalPage > 1 ? (
      <CommentsPagination
        currentPage={currentPage}
        totalPages={totalPage}
        onPageChange={onPageChange}
      />
    ) : null;

  const hideWhenEmpty = !shoIfEmpty && !isFetching && pageData.length === 0;

  if (hideWhenEmpty) {
    return null;
  }

  return (
    <View style={styles.wrap}>
      <FlatList
        data={isFetching ? [] : pageData}
        keyExtractor={keyExtractor}
        ListHeaderComponent={
          <Text
            style={[
              styles.sectionTitle,
              clientCommentStyles.sectionTitleColored,
            ]}
          >
            {title}
          </Text>
        }
        renderItem={renderItem}
        ListEmptyComponent={isFetching ? <CommentsSkeleton count={4} /> : null}
        ListFooterComponent={listFooter}
        scrollEnabled={false}
        contentContainerStyle={styles.flatContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    padding: spacing.lg,
    marginTop:  spacing.lg,
  },
  flatContent: {
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
  },
  headerMeta: {
    alignItems: 'flex-end',
    gap: 4,
  },
  meta: {
    fontSize: 13,
    opacity: 0.75,
    textAlign: 'right',
  },
  dateRow: {
    fontSize: 13,
    opacity: 0.75,
    marginBottom: 6,
    writingDirection: 'ltr',
    textAlign: 'right',
  },
  body: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'justify',
  },
});

export const ClientCommentsSection = React.memo(ClientCommentsSectionComponent);
ClientCommentsSection.displayName = 'ClientCommentsSection';
