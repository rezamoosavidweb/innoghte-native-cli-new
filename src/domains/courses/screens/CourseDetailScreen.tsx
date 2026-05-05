import { useQueryClient } from '@tanstack/react-query';
import * as React from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  type ListRenderItem,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  useRoute,
  useTheme,
  type RouteProp,
  type Theme,
} from '@react-navigation/native';

import { useCatalogItemDetail } from '@/shared/catalog/hooks/useCatalogItemDetail';
import type { CatalogItemDetail } from '@/shared/catalog/model/catalogItemDetail.schema';
import { catalogKeys } from '@/shared/catalog/model/queryKeys';
import {
  createCoverFallbackBgStyles,
  createCoverPlaceholderGlyphStyles,
} from '@/domains/courses/ui/courseCoverPlaceholder.styles';
import { CourseChapterMediaArea } from '@/domains/courses/ui/course-detail/CourseChapterMediaArea';
import { pickCoverSrc } from '@/domains/courses/utils/pickCoverSrc';
import type { DrawerParamList } from '@/shared/contracts/navigationApp';
import { useAppNavigation } from '@/shared/lib/navigation/useAppNavigation';
import { hexAlpha } from '@/ui/theme/utils/colorUtils';
import { DashboardCommentSection } from '@/shared/ui/comments';
import { ListStateView } from '@/shared/ui/list-states/ListStateView';
import { Text } from '@/shared/ui/Text';
import { Button } from '@/ui/components/Button';

type Chapter = NonNullable<CatalogItemDetail['chapters']>[number];

function createCourseDetailSurfaceStyles(colors: Theme['colors']) {
  return StyleSheet.create({
    headerTitle: { color: colors.text },
    headerShort: { color: colors.text },
    headerFull: { color: colors.text },
    headerH4: { color: colors.text },
    nextHint: { color: hexAlpha(colors.text, 0.6) },
    boxTitle: { color: colors.text },
    commentsBorder: { borderTopColor: colors.border },
    lockedBody: { color: colors.text },
  });
}

function createChapterRowStyles(colors: Theme['colors'], active: boolean) {
  return StyleSheet.create({
    face: {
      backgroundColor: active ? hexAlpha(colors.primary, 0.13) : 'transparent',
      borderColor: colors.border,
    },
    pressed: { opacity: 0.85 },
    idle: { opacity: 1 },
    title: { color: colors.text },
    bullet: { color: active ? colors.primary : hexAlpha(colors.text, 0.53) },
  });
}

const ChapterRow = React.memo(function ChapterRow({
  chapter,
  active,
  onSelect,
}: {
  chapter: Chapter;
  active: boolean;
  onSelect: (c: Chapter) => void;
}) {
  const { colors } = useTheme();
  const themed = createChapterRowStyles(colors, active);

  return (
    <Button
      layout="auto"
      variant="text"
      title={chapter.title_fa}
      onPress={() => {
        onSelect(chapter);
      }}
      style={[styles.chapterRow, themed.face]}
      contentStyle={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
      }}
    >
      <Text style={[styles.chapterTitle, themed.title]} numberOfLines={2}>
        {chapter.title_fa}
      </Text>
      <Text style={themed.bullet}>{active ? '●' : '▶'}</Text>
    </Button>
  );
});
ChapterRow.displayName = 'ChapterRow';

const CourseDetailScreenComponent = () => {
  const navigation = useAppNavigation();
  const route = useRoute<RouteProp<DrawerParamList, 'CourseDetail'>>();
  const courseId = route.params.courseId;
  const { colors } = useTheme();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data, isPending, isError, error, refetch, isSuccess, isRefetching } =
    useCatalogItemDetail(courseId);

  const refreshing = Boolean(isSuccess && data != null && isRefetching);

  const refresh = React.useCallback(() => {
    queryClient
      .invalidateQueries({ queryKey: catalogKeys.detail(courseId) })
      .catch(() => {});
  }, [queryClient, courseId]);

  const refreshControl = React.useMemo(
    () => <RefreshControl refreshing={refreshing} onRefresh={refresh} />,
    [refreshing, refresh],
  );

  const [activeChapter, setActiveChapter] = React.useState<Chapter | undefined>(
    undefined,
  );

  React.useEffect(() => {
    if (data?.chapters?.length) {
      setActiveChapter(data.chapters[0]);
    }
  }, [data]);

  const chapters = React.useMemo(() => data?.chapters ?? [], [data]);

  const activeIndex = React.useMemo(() => {
    if (!activeChapter) {
      return -1;
    }
    return chapters.findIndex(c => c.id === activeChapter.id);
  }, [activeChapter, chapters]);

  const onSelectChapter = React.useCallback((c: Chapter) => {
    setActiveChapter(c);
  }, []);

  const onRetry = React.useCallback(() => {
    refetch().catch(() => {});
  }, [refetch]);

  const coverUri = React.useMemo(
    () => (data ? pickCoverSrc(data) : ''),
    [data],
  );

  const [imgFailed, setImgFailed] = React.useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: data?.title_fa ?? t('screens.coursePlayer.title'),
    });
  }, [data?.title_fa, navigation, t]);

  const showNext = activeIndex >= 0 && activeIndex < chapters.length - 1;
  const nextTitle = showNext ? chapters[activeIndex + 1]?.title_fa ?? '' : '';

  const listHeader = React.useMemo(() => {
    if (!data) {
      return null;
    }

    const surf = createCourseDetailSurfaceStyles(colors);
    const coverFallbackBg = createCoverFallbackBgStyles(colors.border);
    const coverPlaceholderGlyph = createCoverPlaceholderGlyphStyles(
      colors.text,
    );

    return (
      <View style={styles.headerBlock}>
        <Text style={[styles.title, surf.headerTitle]}>{data.title_fa}</Text>
        {!imgFailed && coverUri ? (
          <Image
            accessibilityIgnoresInvertColors
            source={{ uri: coverUri }}
            style={styles.cover}
            onError={() => {
              setImgFailed(true);
            }}
          />
        ) : (
          <View style={[styles.cover, styles.coverPh, coverFallbackBg.bg]}>
            <Text style={coverPlaceholderGlyph.glyph}>▣</Text>
          </View>
        )}
        <Text style={[styles.short, surf.headerShort]}>{data.short_info}</Text>
        <CourseChapterMediaArea activeChapterMedia={activeChapter?.url ?? ''} />
        <View style={styles.chapterHeadingRow}>
          <Text style={[styles.h4, surf.headerH4]}>
            {activeChapter?.title_fa}
          </Text>
          {showNext ? (
            <Text style={[styles.nextHint, surf.nextHint]}>
              {t('screens.coursePlayer.nextVideo', { title: nextTitle })}
            </Text>
          ) : null}
        </View>
        <Text style={[styles.short, surf.headerShort]}>
          {activeChapter?.short_info ?? ''}
        </Text>
        <Text style={[styles.full, surf.headerFull]}>
          {activeChapter?.full_info ?? ''}
        </Text>

        <Text style={[styles.boxTitle, surf.boxTitle]}>
          {t('screens.coursePlayer.chaptersHeading', {
            title: data.title_fa,
          })}
        </Text>
      </View>
    );
  }, [
    activeChapter?.full_info,
    activeChapter?.short_info,
    activeChapter?.title_fa,
    activeChapter?.url,
    colors,
    coverUri,
    data,
    imgFailed,
    nextTitle,
    showNext,
    t,
  ]);

  const listFooter = React.useMemo(() => {
    const surf = createCourseDetailSurfaceStyles(colors);
    return (
      <View style={[styles.commentsBlock, surf.commentsBorder]}>
        <DashboardCommentSection
          courseId={courseId}
          title={t('comments.entityCourse')}
        />
      </View>
    );
  }, [colors, courseId, t]);

  const renderItem = React.useCallback<ListRenderItem<Chapter>>(
    ({ item }) => (
      <ChapterRow
        chapter={item}
        active={item.id === activeChapter?.id}
        onSelect={onSelectChapter}
      />
    ),
    [activeChapter?.id, onSelectChapter],
  );

  const keyExtractor = React.useCallback(
    (item: Chapter) => String(item.id),
    [],
  );

  const renderList = React.useCallback(() => {
    if (!data) {
      return <></>;
    }

    if (!data.is_accessible) {
      const surf = createCourseDetailSurfaceStyles(colors);
      return (
        <ScrollView
          style={styles.scrollFlex}
          contentContainerStyle={styles.lockedScrollContent}
          refreshControl={refreshControl}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[styles.lockedText, surf.lockedBody]}>
            {t('screens.coursePlayer.notAccessible')}
          </Text>
        </ScrollView>
      );
    }

    return (
      <FlatList
        data={chapters}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={listHeader}
        ListFooterComponent={listFooter}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={refreshControl}
      />
    );
  }, [
    chapters,
    colors,
    data,
    keyExtractor,
    listFooter,
    listHeader,
    refreshControl,
    renderItem,
    t,
  ]);

  const isEmpty = Boolean(!isPending && !data);

  return (
    <ListStateView
      isLoading={isPending}
      isError={Boolean(isError)}
      error={error}
      isEmpty={isEmpty}
      onRetry={onRetry}
      renderList={renderList}
      loadingMessage={t('screens.coursePlayer.loading')}
      errorTitle={t('screens.coursePlayer.error')}
      emptyTitle={t('screens.coursePlayer.empty')}
      retryLabel={t('listStates.retry')}
      safeAreaEdges={['left', 'right', 'bottom']}
    />
  );
};

const styles = StyleSheet.create({
  scrollFlex: {
    flex: 1,
  },
  lockedScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 8,
  },
  headerBlock: {
    gap: 10,
    marginBottom: 8,
    marginTop: 8,
  },
  cover: {
    width: '100%',
    height: 410,
    borderRadius: 12,
  },
  coverPh: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  short: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    opacity: 0.9,
  },
  full: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'justify',
    opacity: 0.85,
  },
  chapterHeadingRow: {
    gap: 4,
    marginTop: 4,
  },
  h4: {
    fontSize: 17,
    fontWeight: '700',
  },
  nextHint: {
    fontSize: 13,
    textAlign: 'right',
  },
  boxTitle: {
    marginTop: 8,
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  chapterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 6,
  },
  chapterTitle: {
    flex: 1,
    marginRight: 8,
    fontSize: 15,
  },
  commentsBlock: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  lockedText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

CourseDetailScreenComponent.displayName = 'CourseDetailScreen';
export const CourseDetailScreen = CourseDetailScreenComponent;
