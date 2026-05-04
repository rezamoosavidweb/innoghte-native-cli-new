import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  FlatList,
  StyleSheet,
  TextInput,
  View,
  type ListRenderItem,
  type NativeSyntheticEvent,
  type TextInputKeyPressEventData,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@react-navigation/native';
import { z } from 'zod';

import { hexAlpha } from '@/ui/theme/utils/colorUtils';

import { useCourseCommentsPage } from '@/domains/courses/hooks/useCourseCommentsPage';
import { useCreateCourseComment } from '@/domains/courses/hooks/useCreateCourseComment';
import { commentSchema } from '@/domains/home/model/comments.schema';
import { Text } from '@/shared/ui/Text';

import {
  createAvatarInitialStyles,
  createDashboardCommentCardStyles,
  createDashboardFormStyles,
  createStarPickStyles,
} from '@/shared/ui/comments/dashboardComment.styles';
import { CommentsPagination } from '@/shared/ui/comments/CommentsPagination';
import { Button } from '@/ui/components/Button';

export type DashboardCommentFormValues = z.infer<typeof validationSchema>;

const validationSchema = z.object({
  comment: z.string().min(1, 'نظر الزامی است'),
});

export const dashboardCommentResolver = zodResolver(validationSchema);

export type CommentDto = z.infer<typeof commentSchema>;

const AVATAR_COLORS = ['#22c55e', '#ef4444', '#eab308'] as const;
const STAR_VALUES = [1, 2, 3, 4, 5];

function avatarColorFor(userId: number): string {
  return AVATAR_COLORS[Math.abs(userId) % AVATAR_COLORS.length];
}

const StarPickRow = React.memo(function StarPickRow({
  rating,
  onPick,
}: {
  rating: number;
  onPick: (n: number) => void;
}) {
  const { colors } = useTheme();
  const star = createStarPickStyles(colors);

  return (
    <View style={styles.starRow}>
      {STAR_VALUES.map(n => (
        <Button
          key={n}
          layout="auto"
          variant="text"
          title={`star-${n}`}
          accessibilityLabel={`star-${n}`}
          hitSlop={6}
          onPress={() => {
            onPick(n);
          }}
          contentStyle={{ width: '100%' }}
        >
          <Text
            style={[star.glyph, n <= rating ? star.glyphFilled : star.glyphEmpty]}
          >
            ★
          </Text>
        </Button>
      ))}
    </View>
  );
});
StarPickRow.displayName = 'StarPickRow';

const DashboardCommentCard = React.memo(function DashboardCommentCard({
  comment,
}: {
  comment: CommentDto;
}) {
  const { colors } = useTheme();
  const initial = comment.user?.full_name?.trim()?.charAt(0)?.toUpperCase() ?? '';
  const themedCard = createDashboardCommentCardStyles(colors);
  const initialStyles = createAvatarInitialStyles(avatarColorFor(comment.user_id));

  return (
    <View style={[styles.commentCard, themedCard.cardBorder]}>
      <View style={styles.commentHead}>
        {initial ? (
          <View style={[styles.avatar, themedCard.avatarBg]}>
            <Text style={initialStyles.letter}>{initial}</Text>
          </View>
        ) : null}
        <View style={styles.commentHeadText}>
          <View style={styles.commentTitleRow}>
            {comment.user?.full_name ? (
              <Text style={[styles.userName, themedCard.userName]}>
                {comment.user.full_name}
              </Text>
            ) : null}
            <View style={themedCard.starRow}>
              {Array.from({ length: comment.points ?? 0 }).map((_, i) => (
                <Text
                  key={`ds-${comment.id}-${i}`}
                  style={themedCard.starGlyph}
                >
                  ★
                </Text>
              ))}
            </View>
          </View>
        </View>
      </View>
      <Text style={[styles.commentBody, themedCard.commentBody]}>
        {comment.comment}
      </Text>
    </View>
  );
});
DashboardCommentCard.displayName = 'DashboardCommentCard';

const keyExtractor = (item: CommentDto) => String(item.id);

export type DashboardCommentSectionProps = {
  title?: string;
  courseId?: number;
  categoryId?: number;
};

function DashboardCommentSectionComponent({
  title = 'دوره',
  courseId,
  categoryId,
}: DashboardCommentSectionProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [successMessage, setSuccessMessage] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [rating, setRating] = React.useState(0);

  const { data: comments } = useCourseCommentsPage(
    currentPage,
    10,
    courseId,
    categoryId,
  );

  const {
    mutateAsync: mutateCreateComment,
    isPending: isPendingCreateComment,
  } = useCreateCourseComment(courseId, categoryId);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DashboardCommentFormValues>({
    resolver: dashboardCommentResolver,
    mode: 'onBlur',
    defaultValues: { comment: '' },
  });

  const onPickStar = React.useCallback((n: number) => {
    setRating(n);
  }, []);

  const onSubmit = React.useCallback(
    async (values: DashboardCommentFormValues) => {
      setSuccessMessage('');
      setErrorMessage('');
      if (rating === 0) {
        setErrorMessage(t('comments.ratingRequired'));
        return;
      }
      try {
        await mutateCreateComment({
          course_id: courseId ?? 1,
          points: rating,
          comment: values.comment,
        });
        setSuccessMessage(t('comments.submitSuccess'));
        reset({ comment: '' });
        setRating(0);
      } catch {
        setErrorMessage(t('comments.submitError'));
      }
    },
    [courseId, mutateCreateComment, rating, reset, t],
  );

  const onInvalid = React.useCallback(() => {
    setErrorMessage(t('comments.commentRequired'));
  }, [t]);

  const onKeyDown = React.useCallback(
    (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      if (e.nativeEvent.key !== 'Enter') {
        return;
      }
      if (isPendingCreateComment || isSubmitting) {
        return;
      }
      handleSubmit(onSubmit, onInvalid)().catch(() => {});
    },
    [handleSubmit, isPendingCreateComment, isSubmitting, onInvalid, onSubmit],
  );

  const commentList = comments?.data ?? [];
  const pag = comments?.pagination as
    | { total?: number; total_items?: number; per_page?: number }
    | undefined;
  const total = Number(pag?.total ?? pag?.total_items ?? 0);
  const per_page = Number(pag?.per_page ?? 0);
  const totalPage =
    per_page > 0 ? Math.ceil(total / per_page) : 0;

  const formTheme = createDashboardFormStyles(colors);

  const onPageChange = React.useCallback((p: number) => {
    setCurrentPage(p);
  }, []);

  const renderItem = React.useCallback<ListRenderItem<CommentDto>>(
    ({ item }) => <DashboardCommentCard comment={item} />,
    [],
  );

  const listFooter =
    total > 0 && per_page > 0 && total > per_page && totalPage > 1 ? (
      <CommentsPagination
        currentPage={currentPage}
        totalPages={totalPage}
        onPageChange={onPageChange}
      />
    ) : null;

  const formBlock = (
    <View style={styles.form}>
      <Text style={[styles.formLabel, formTheme.formLabel]}>
        {t('comments.submitLabel')}
      </Text>
      <Controller
        name="comment"
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.textarea, formTheme.textarea]}
            placeholder={title + t('comments.placeholderSuffix')}
            placeholderTextColor={hexAlpha(colors.text, 0.53)}
            multiline
            maxLength={2000}
            textAlignVertical="top"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            onKeyPress={onKeyDown}
          />
        )}
      />
      {errors.comment?.message ? (
        <Text style={styles.fieldError}>{errors.comment.message}</Text>
      ) : null}
      <View style={styles.ratingRow}>
        <Text style={formTheme.ratingLabel}>{t('comments.yourRating')}</Text>
        <StarPickRow rating={rating} onPick={onPickStar} />
      </View>
      <Button
        variant="filled"
        title={t('comments.send')}
        disabled={isPendingCreateComment || isSubmitting}
        loading={isPendingCreateComment || isSubmitting}
        onPress={() => {
          handleSubmit(onSubmit, onInvalid)().catch(() => {});
        }}
        style={[
          styles.submitBtn,
          formTheme.submitBg,
          isPendingCreateComment || isSubmitting
            ? formTheme.submitOpacityDisabled
            : formTheme.submitOpacityIdle,
        ]}
        contentStyle={{ width: '100%' }}
      >
        <Text style={styles.submitBtnText}>{t('comments.send')}</Text>
      </Button>
      {!isPendingCreateComment && successMessage ? (
        <Text style={styles.successText}>{successMessage}</Text>
      ) : null}
      {!isPendingCreateComment && errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
    </View>
  );

  if (commentList.length === 0) {
    return (
      <View style={styles.wrap}>
        {formBlock}
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      {formBlock}
      <FlatList
        data={commentList}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListFooterComponent={listFooter}
        scrollEnabled={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    marginTop: 8,
  },
  form: {
    gap: 10,
    marginBottom: 12,
  },
  formLabel: {
    fontSize: 18,
    fontWeight: '700',
  },
  textarea: {
    minHeight: 120,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
  },
  fieldError: {
    color: '#f97316',
    fontSize: 13,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  submitBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 4,
  },
  submitBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  successText: {
    color: '#22c55e',
    fontSize: 14,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
  },
  listContent: {
    paddingTop: 8,
    gap: 12,
  },
  commentCard: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
    marginBottom: 4,
  },
  commentHead: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentHeadText: {
    flex: 1,
  },
  commentTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  commentBody: {
    fontSize: 14,
    lineHeight: 22,
  },
});

export const DashboardCommentSection = React.memo(
  DashboardCommentSectionComponent,
);
DashboardCommentSection.displayName = 'DashboardCommentSection';
