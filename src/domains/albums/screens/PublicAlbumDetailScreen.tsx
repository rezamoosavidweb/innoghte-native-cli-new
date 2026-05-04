import { useQueryClient } from '@tanstack/react-query';
import * as React from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRoute, useTheme, type RouteProp } from '@react-navigation/native';

import { usePublicCourseDetail } from '@/domains/courses/hooks/usePublicCourseDetail';
import { coursesKeys } from '@/domains/courses/model/queryKeys';
import { createCourseDetailBodyTextStyles } from '@/domains/courses/ui/courseDetailBody.styles';
import {
  createCoverFallbackBgStyles,
  createCoverPlaceholderGlyphStyles,
} from '@/domains/courses/ui/courseCoverPlaceholder.styles';
import { pickCoverSrc } from '@/domains/courses/utils/pickCoverSrc';
import type { DrawerParamList } from '@/shared/contracts/navigationApp';
import { useAppNavigation } from '@/shared/lib/navigation/useAppNavigation';
import { CartMainButtons } from '@/shared/ui/cart/CartMainButtons';
import { ClientCommentsSection } from '@/shared/ui/comments';
import { ListStateView } from '@/shared/ui/list-states/ListStateView';
import { Text } from '@/shared/ui/Text';
import { protectedNavigate } from '@/app/bridge/auth';

const PublicAlbumDetailScreenComponent = () => {
  const navigation = useAppNavigation();
  const route = useRoute<RouteProp<DrawerParamList, 'PublicAlbumDetail'>>();
  const albumId = route.params.albumId;
  const { colors } = useTheme();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data, isPending, isError, error, refetch, isSuccess, isRefetching } =
    usePublicCourseDetail(albumId);

  const refreshing = Boolean(isSuccess && data != null && isRefetching);

  const refresh = React.useCallback(() => {
    queryClient
      .invalidateQueries({ queryKey: coursesKeys.detail(albumId) })
      .catch(() => {});
  }, [queryClient, albumId]);

  const refreshControl = React.useMemo(
    () => <RefreshControl refreshing={refreshing} onRefresh={refresh} />,
    [refreshing, refresh],
  );

  const coverUri = React.useMemo(
    () => (data ? pickCoverSrc(data) : ''),
    [data],
  );

  const onRetry = React.useCallback(() => {
    refetch().catch(() => {});
  }, [refetch]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: data?.title_fa ?? t('screens.publicAlbumDetail.title'),
    });
  }, [data?.title_fa, navigation, t]);

  const [imgFailed, setImgFailed] = React.useState(false);

  const purchased = Boolean(data?.is_accessible);

  const onPressPrimary = React.useCallback(() => {
    protectedNavigate(navigation, 'AlbumDetail', { albumId });
  }, [albumId, navigation]);

  const renderBody = React.useCallback(() => {
    if (!data) {
      return <></>;
    }

    const coverFallbackBg = createCoverFallbackBgStyles(colors.border);
    const coverPlaceholderGlyph = createCoverPlaceholderGlyphStyles(
      colors.text,
    );
    const bodyText = createCourseDetailBodyTextStyles(colors);

    return (
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        refreshControl={refreshControl}
      >
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

        <Text style={[styles.title, bodyText.title]}>{data.title_fa}</Text>
        <Text style={[styles.short, bodyText.short]}>{data.short_info}</Text>
        <Text style={[styles.full, bodyText.full]}>{data.full_info}</Text>

        <View style={styles.actions}>
          <CartMainButtons
            courseId={albumId}
            isFull={(data.remain_capacity ?? 1) === 0}
            isAccessible={purchased}
            showBtnText={t('screens.albums.viewAlbum')}
            fullWidth={false}
            onPressPrimary={onPressPrimary}
          />
        </View>

        <ClientCommentsSection
          title={t('screens.publicAlbumDetail.commentsTitle')}
          courseId={albumId}
          bgcolor={`${colors.card}`}
        />
      </ScrollView>
    );
  }, [
    albumId,
    colors,
    coverUri,
    data,
    imgFailed,
    onPressPrimary,
    purchased,
    refreshControl,
    t,
  ]);

  return (
    <ListStateView
      isLoading={isPending}
      isError={Boolean(isError)}
      error={error}
      isEmpty={Boolean(!isPending && !data)}
      onRetry={onRetry}
      renderList={renderBody}
      loadingMessage={t('screens.publicAlbumDetail.loading')}
      errorTitle={t('screens.publicAlbumDetail.error')}
      emptyTitle={t('screens.publicAlbumDetail.empty')}
      retryLabel={t('listStates.retry')}
      safeAreaEdges={['left', 'right', 'bottom']}
    />
  );
};

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 28,
    gap: 12,
  },
  cover: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginTop: 8,
  },
  coverPh: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginTop: 4,
    textAlign: 'center',
  },
  short: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    opacity: 0.9,
  },
  full: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'justify',
    opacity: 0.85,
  },
  actions: {
    marginTop: 8,
    alignItems: 'stretch',
  },
});

PublicAlbumDetailScreenComponent.displayName = 'PublicAlbumDetailScreen';
export const PublicAlbumDetailScreen = PublicAlbumDetailScreenComponent;
