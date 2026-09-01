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
import { AlbumChapterMediaArea } from '@/domains/albums/ui/albumChapterMediaArea';
import { resolveAlbumChapterAudio } from '@/domains/albums/utils/resolveAlbumChapterAudio';
import { pickCoverSrc } from '@/domains/courses/utils/pickCoverSrc';
import type { DrawerParamList } from '@/shared/contracts/navigationApp';
import { formatNumberForApp } from '@/shared/infra/i18n/formatLocaleNumbers';
import { useAppNavigation } from '@/shared/lib/navigation/useAppNavigation';
import { hexAlpha } from '@/ui/theme/utils/colorUtils';
import { DashboardCommentSection } from '@/shared/ui/comments';
import { ListStateView } from '@/shared/ui/list-states/ListStateView';
import { Text } from '@/shared/ui/Text';
import { Button } from '@/ui/components/Button';

type Chapter = NonNullable<CatalogItemDetail['chapters']>[number];

function plainText(value: string): string {
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function createAlbumDetailSurfaceStyles(colors: Theme['colors']) {
  return StyleSheet.create({
    title: { color: colors.text },
    body: { color: colors.text },
    subtle: { color: hexAlpha(colors.text, 0.62) },
    stage: {
      backgroundColor: hexAlpha(colors.text, 0.07),
      borderColor: colors.border,
    },
    activePanel: {
      backgroundColor: colors.card,
      borderColor: colors.border,
    },
    commentsBorder: { borderTopColor: colors.border },
    lockedBody: { color: colors.text },
  });
}

function createChapterRowStyles(colors: Theme['colors'], active: boolean) {
  return StyleSheet.create({
    face: {
      backgroundColor: active ? hexAlpha(colors.primary, 0.14) : colors.card,
      borderColor: active ? hexAlpha(colors.primary, 0.62) : colors.border,
    },
    title: { color: colors.text },
    meta: { color: hexAlpha(colors.text, 0.58) },
    play: {
      color: active ? colors.primary : hexAlpha(colors.text, 0.58),
      borderColor: active ? colors.primary : hexAlpha(colors.text, 0.35),
    },
  });
}

const ChapterRow = React.memo(function ChapterRow({
  chapter,
  index,
  active,
  onSelect,
}: {
  chapter: Chapter;
  index: number;
  active: boolean;
  onSelect: (c: Chapter) => void;
}) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const themed = createChapterRowStyles(colors, active);

  return (
    <Button
      layout="auto"
      variant="text"
      title={chapter.title_fa}
      accessibilityState={{ selected: active }}
      onPress={() => {
        onSelect(chapter);
      }}
      style={[styles.chapterRow, themed.face]}
      contentStyle={styles.chapterContent}
    >
      <View style={styles.chapterIdentity}>
        <Text style={[styles.chapterTitle, themed.title]} numberOfLines={2}>
          {chapter.title_fa}
        </Text>
        <Text style={[styles.chapterMeta, themed.meta]}>
          {t('screens.albumDetail.trackNumber', {
            number: formatNumberForApp(index + 1),
          })}
        </Text>
      </View>
      <View style={styles.chapterTrailing}>
        {chapter.duration ? (
          <Text style={[styles.duration, themed.meta]}>{chapter.duration}</Text>
        ) : null}
        <View style={[styles.playCircle, { borderColor: themed.play.borderColor }]}>
          <Text style={[styles.playIcon, { color: themed.play.color }]}>
            {active ? '♫' : '▶'}
          </Text>
        </View>
      </View>
    </Button>
  );
});
ChapterRow.displayName = 'ChapterRow';

const AlbumDetailScreenComponent = () => {
  const navigation = useAppNavigation();
  const route = useRoute<RouteProp<DrawerParamList, 'AlbumDetail'>>();
  const courseId = route.params.albumId;
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

  const [activeChapter, setActiveChapter] = React.useState<Chapter>();
  const chapters = React.useMemo(() => data?.chapters ?? [], [data?.chapters]);

  React.useEffect(() => {
    if (chapters.length) {
      setActiveChapter(previous =>
        chapters.some(chapter => chapter.id === previous?.id)
          ? previous
          : chapters[0],
      );
    }
  }, [chapters]);

  const activeIndex = React.useMemo(
    () =>
      activeChapter
        ? chapters.findIndex(chapter => chapter.id === activeChapter.id)
        : -1,
    [activeChapter, chapters],
  );
  const activeMedia = React.useMemo(
    () =>
      activeChapter && activeIndex >= 0
        ? resolveAlbumChapterAudio(activeChapter, activeIndex, data?.medias)
        : '',
    [activeChapter, activeIndex, data?.medias],
  );

  const coverUri = React.useMemo(
    () => (data ? pickCoverSrc(data) : ''),
    [data],
  );
  const [imgFailed, setImgFailed] = React.useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: data?.title_fa ?? t('screens.albumDetail.title'),
    });
  }, [data?.title_fa, navigation, t]);

  const showNext = activeIndex >= 0 && activeIndex < chapters.length - 1;
  const nextTitle = showNext ? chapters[activeIndex + 1]?.title_fa ?? '' : '';

  const listHeader = React.useMemo(() => {
    if (!data) {
      return null;
    }

    const surf = createAlbumDetailSurfaceStyles(colors);
    const coverFallbackBg = createCoverFallbackBgStyles(colors.border);
    const coverPlaceholderGlyph = createCoverPlaceholderGlyphStyles(colors.text);

    return (
      <View style={styles.headerBlock}>
        <View style={[styles.artworkStage, surf.stage]}>
          {!imgFailed && coverUri ? (
            <>
              <Image
                accessibilityIgnoresInvertColors
                source={{ uri: coverUri }}
                style={styles.backdrop}
                blurRadius={18}
              />
              <Image
                accessibilityIgnoresInvertColors
                source={{ uri: coverUri }}
                style={styles.cover}
                onError={() => {
                  setImgFailed(true);
                }}
              />
            </>
          ) : (
            <View style={[styles.cover, styles.coverPh, coverFallbackBg.bg]}>
              <Text style={coverPlaceholderGlyph.glyph}>♫</Text>
            </View>
          )}
        </View>

        <Text style={[styles.title, surf.title]}>{data.title_fa}</Text>
        {data.short_info ? (
          <Text style={[styles.short, surf.body]}>{plainText(data.short_info)}</Text>
        ) : null}

        <View style={[styles.activePanel, surf.activePanel]}>
          <View style={styles.activeHeading}>
            <View style={styles.activeTitleBlock}>
              <Text style={[styles.activeTitle, surf.title]}>
                {activeChapter?.title_fa ?? ''}
              </Text>
              {activeIndex >= 0 ? (
                <Text style={[styles.activeMeta, surf.subtle]}>
                  {t('screens.albumDetail.trackNumber', {
                    number: formatNumberForApp(activeIndex + 1),
                  })}
                </Text>
              ) : null}
            </View>
            {activeChapter?.duration ? (
              <Text style={[styles.activeDuration, surf.subtle]}>
                {activeChapter.duration}
              </Text>
            ) : null}
          </View>

          <AlbumChapterMediaArea activeChapterMedia={activeMedia} />

          {showNext ? (
            <Text style={[styles.nextHint, surf.subtle]}>
              {t('screens.albumDetail.nextTrack', { title: nextTitle })}
            </Text>
          ) : null}
          {activeChapter?.short_info ? (
            <Text style={[styles.chapterDescription, surf.body]}>
              {activeChapter.short_info}
            </Text>
          ) : null}
        </View>

        <Text style={[styles.boxTitle, surf.title]}>
          {t('screens.albumDetail.chaptersHeading', { title: data.title_fa })}
        </Text>
      </View>
    );
  }, [
    activeChapter,
    activeIndex,
    activeMedia,
    colors,
    coverUri,
    data,
    imgFailed,
    nextTitle,
    showNext,
    t,
  ]);

  const listFooter = React.useMemo(() => {
    const surf = createAlbumDetailSurfaceStyles(colors);
    return (
      <View style={[styles.commentsBlock, surf.commentsBorder]}>
        <DashboardCommentSection
          courseId={courseId}
          title={t('comments.entityAlbum')}
        />
      </View>
    );
  }, [colors, courseId, t]);

  const renderItem = React.useCallback<ListRenderItem<Chapter>>(
    ({ item, index }) => (
      <ChapterRow
        chapter={item}
        index={index}
        active={item.id === activeChapter?.id}
        onSelect={setActiveChapter}
      />
    ),
    [activeChapter?.id],
  );

  const renderList = React.useCallback(() => {
    if (!data) {
      return <></>;
    }
    if (!data.is_accessible) {
      const surf = createAlbumDetailSurfaceStyles(colors);
      return (
        <ScrollView
          style={styles.scrollFlex}
          contentContainerStyle={styles.lockedScrollContent}
          refreshControl={refreshControl}
        >
          <Text style={[styles.lockedText, surf.lockedBody]}>
            {t('screens.albumDetail.notAccessible')}
          </Text>
        </ScrollView>
      );
    }

    return (
      <FlatList
        data={chapters}
        keyExtractor={item => String(item.id)}
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
    listFooter,
    listHeader,
    refreshControl,
    renderItem,
    t,
  ]);

  return (
    <ListStateView
      isLoading={isPending}
      isError={Boolean(isError)}
      error={error}
      isEmpty={Boolean(!isPending && !data)}
      onRetry={() => {
        refetch().catch(() => {});
      }}
      renderList={renderList}
      loadingMessage={t('screens.albumDetail.loading')}
      errorTitle={t('screens.albumDetail.error')}
      emptyTitle={t('screens.albumDetail.empty')}
      retryLabel={t('listStates.retry')}
      safeAreaEdges={['left', 'right', 'bottom']}
    />
  );
};

const styles = StyleSheet.create({
  scrollFlex: { flex: 1 },
  lockedScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  headerBlock: {
    gap: 10,
    paddingTop: 12,
    paddingBottom: 8,
  },
  artworkStage: {
    height: 258,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0.24,
    transform: [{ scale: 1.15 }],
  },
  cover: {
    width: 198,
    height: 198,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.72)',
  },
  coverPh: { alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 21, fontWeight: '800', textAlign: 'center' },
  short: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    opacity: 0.88,
    paddingHorizontal: 8,
  },
  activePanel: {
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 12,
    gap: 9,
  },
  activeHeading: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activeTitleBlock: { flex: 1, gap: 2 },
  activeTitle: { fontSize: 17, fontWeight: '700' },
  activeMeta: { fontSize: 12 },
  activeDuration: { fontSize: 13, marginStart: 12 },
  nextHint: { fontSize: 13, textAlign: 'right' },
  chapterDescription: { fontSize: 14, lineHeight: 21 },
  boxTitle: {
    marginTop: 8,
    marginBottom: 2,
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  chapterRow: {
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 7,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  chapterContent: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chapterIdentity: { flex: 1, gap: 2 },
  chapterTitle: { fontSize: 15, fontWeight: '700' },
  chapterMeta: { fontSize: 11 },
  chapterTrailing: {
    marginStart: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  duration: { fontSize: 12, writingDirection: 'ltr' },
  playCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    fontSize: 11,
    lineHeight: 15,
    includeFontPadding: false,
    textAlign: 'center',
  },
  commentsBlock: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  lockedText: { fontSize: 16, textAlign: 'center' },
});

AlbumDetailScreenComponent.displayName = 'AlbumDetailScreen';
export const AlbumDetailScreen = AlbumDetailScreenComponent;
