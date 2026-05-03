import * as React from 'react';
import { FlatList, StyleSheet, View, type ListRenderItem } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@react-navigation/native';
import type { z } from 'zod';

import { useCourseCommentsPage } from '@/domains/courses/hooks/useCourseCommentsPage';
import { commentSchema } from '@/domains/home/model/comments.schema';
import { Text } from '@/shared/ui/Text';

import {
  createClientCommentStyles,
  createCommentCardBg,
} from '@/shared/ui/comments/clientComments.styles';
import { CommentsPagination } from '@/shared/ui/comments/CommentsPagination';
import { CommentsSkeleton } from '@/shared/ui/comments/CommentsSkeleton';

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

const starGlyphsStatic = StyleSheet.create({
  glyphs: { writingDirection: 'ltr', letterSpacing: 1 },
});

function formatCommentDate(value: string | undefined, locale: string): string {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  try {
    return new Intl.DateTimeFormat(locale || 'fa-IR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return date.toISOString().slice(0, 10);
  }
}

function StarRow({ points }: { points: number }) {
  const filled = Math.min(5, Math.max(0, Math.round(points)));
  const label = `${'★'.repeat(filled)}${'☆'.repeat(5 - filled)}`;
  return <Text style={starGlyphsStatic.glyphs}>{label}</Text>;
}

const CommentCard = React.memo(function CommentCard({
  comment,
  withExtraInfo,
  bgcolor,
  locale,
}: {
  comment: CommentDto;
  withExtraInfo: boolean;
  bgcolor: string;
  locale: string;
}) {
  const { colors } = useTheme();
  const dateLabel = formatCommentDate(comment.created_at, locale);
  const surface = createCommentCardBg(bgcolor);
  const themed = createClientCommentStyles(colors);
  const courseTitle =
    comment.course &&
    typeof comment.course === 'object' &&
    'title_fa' in comment.course
      ? String((comment.course as { title_fa?: string }).title_fa ?? '')
      : '';

  return (
    <View style={[styles.card, surface.bg]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.name, themed.name]}>
          {comment.user?.full_name?.trim()
            ? comment.user.full_name
            : '—'}
        </Text>
        <View style={styles.headerMeta}>
          {withExtraInfo && courseTitle ? (
            <Text style={[styles.meta, themed.meta]}>{courseTitle}</Text>
          ) : null}
          <StarRow points={comment.points ?? 0} />
        </View>
      </View>
      {withExtraInfo && dateLabel ? (
        <Text style={[styles.dateRow, themed.dateRow]}>{dateLabel}</Text>
      ) : null}
      <Text style={[styles.body, themed.body]}>{comment.comment}</Text>
    </View>
  );
});
CommentCard.displayName = 'CommentCard';

const keyExtractor = (item: CommentDto) => String(item.id);

function ClientCommentsSectionComponent({
  title,
  withExtraInfo = false,
  courseId,
  categoryId,
  bgcolor = '#fff',
  perPage = 10,
  shoIfEmpty = false,
}: ClientCommentsSectionProps) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const { i18n } = useTranslation();
  const { colors } = useTheme();

  const { data, isFetching } = useCourseCommentsPage(
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
    ({ item }) => (
      <CommentCard
        comment={item}
        withExtraInfo={withExtraInfo}
        bgcolor={bgcolor}
        locale={i18n.language}
      />
    ),
    [bgcolor, i18n.language, withExtraInfo],
  );

  const listFooter =
    showPagination && totalPage > 1 ? (
      <CommentsPagination
        currentPage={currentPage}
        totalPages={totalPage}
        onPageChange={onPageChange}
      />
    ) : null;

  const hideWhenEmpty =
    !shoIfEmpty && !isFetching && pageData.length === 0;

  if (hideWhenEmpty) {
    return null;
  }

  return (
    <View style={styles.wrap}>
      <FlatList
        data={isFetching ? [] : pageData}
        keyExtractor={keyExtractor}
        ListHeaderComponent={
          <Text style={[styles.sectionTitle, clientCommentStyles.sectionTitleColored]}>
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
    paddingVertical: 16,
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
