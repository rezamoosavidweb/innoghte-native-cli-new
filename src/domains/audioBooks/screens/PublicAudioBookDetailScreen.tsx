import { useRoute, useTheme, type RouteProp } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';

import { pickCoverSrc } from '@/domains/courses/utils/pickCoverSrc';
import { useCatalogItemDetail } from '@/shared/catalog/hooks/useCatalogItemDetail';
import { catalogKeys } from '@/shared/catalog/model/queryKeys';
import type { DrawerParamList } from '@/shared/contracts/navigationApp';
import { formatPriceForApp } from '@/shared/infra/i18n/formatLocaleNumbers';
import { useAppNavigation } from '@/shared/lib/navigation/useAppNavigation';
import { CartMainButtons } from '@/shared/ui/cart/CartMainButtons';
import { ClientCommentsSection } from '@/shared/ui/comments';
import { ListStateView } from '@/shared/ui/list-states/ListStateView';
import { Text } from '@/shared/ui/Text';

const IR_PRICE_DIVISOR = 10;

function escapeHtmlAttribute(value: string): string {
  return value.replace(
    /[&<>"']/g,
    char =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[char] ?? char,
  );
}

function AudioPreview({ url }: { url: string }) {
  const html = React.useMemo(
    () => `<!doctype html><html dir="rtl"><head><meta name="viewport" content="width=device-width,initial-scale=1" /></head><body style="margin:0;background:transparent;display:flex;align-items:center;height:68px"><audio controls preload="metadata" style="width:100%" src="${escapeHtmlAttribute(url)}"></audio></body></html>`,
    [url],
  );
  return (
    <WebView
      originWhitelist={['https://*']}
      source={{ html }}
      style={styles.audio}
      scrollEnabled={false}
      mediaPlaybackRequiresUserAction
      allowsInlineMediaPlayback
    />
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.infoRow}>
      <Text style={[styles.infoLabel, { color: colors.text }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: colors.primary }]}>{value}</Text>
    </View>
  );
}

function CopySection({ title, body }: { title?: string | null; body?: string | null }) {
  const { colors } = useTheme();
  if (!title && !body) return null;
  return (
    <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {title ? <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text> : null}
      {body ? <Text style={[styles.sectionBody, { color: colors.text }]}>{body}</Text> : null}
    </View>
  );
}

const PublicAudioBookDetailScreenComponent = () => {
  const navigation = useAppNavigation();
  const route = useRoute<RouteProp<DrawerParamList, 'PublicAudioBookDetail'>>();
  const audioBookId = route.params.audioBookId;
  const { colors } = useTheme();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { data, isPending, isError, error, refetch, isSuccess, isRefetching } =
    useCatalogItemDetail(audioBookId);
  const [imageFailed, setImageFailed] = React.useState(false);

  const coverUri = React.useMemo(() => (data ? pickCoverSrc(data) : ''), [data]);
  const refreshing = Boolean(isSuccess && data && isRefetching);
  const refresh = React.useCallback(() => {
    queryClient.invalidateQueries({ queryKey: catalogKeys.detail(audioBookId) }).catch(() => {});
  }, [audioBookId, queryClient]);
  const retry = React.useCallback(() => {
    refetch().catch(() => {});
  }, [refetch]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: data?.title_fa ?? t('screens.audioBookDetail.title'),
    });
  }, [data?.title_fa, navigation, t]);

  const openPurchasedBook = React.useCallback(() => {
    navigation.navigate('AudioBookDetail', { courseId: audioBookId });
  }, [audioBookId, navigation]);

  const renderBody = React.useCallback(() => {
    if (!data) return <></>;
    const detail = data.audio_book_detail;
    const displayPrice = (data.discount_price ?? data.price) / IR_PRICE_DIVISOR;
    const originalPrice = data.price / IR_PRICE_DIVISOR;
    return (
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
      >
        {!imageFailed && coverUri ? (
          <Image
            accessibilityIgnoresInvertColors
            source={{ uri: coverUri }}
            style={styles.cover}
            resizeMode="cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <View style={[styles.cover, styles.coverFallback, { backgroundColor: colors.border }]}>
            <Text style={styles.coverGlyph}>▣</Text>
          </View>
        )}

        <Text style={[styles.title, { color: colors.text }]}>{data.title_fa}</Text>
        <Text style={[styles.short, { color: colors.text }]}>{data.short_info}</Text>
        <CopySection body={detail?.section1_description} />

        <View style={[styles.infoBox, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <InfoRow
            label={t('screens.audioBookDetail.downloadable')}
            value={data.is_downloadable ? t('common.yes') : t('common.no')}
          />
          <InfoRow
            label={t('screens.audioBookDetail.accessType')}
            value={data.access_type ?? '—'}
          />
          <InfoRow
            label={t('screens.audioBookDetail.price')}
            value={formatPriceForApp(displayPrice, t('courses.currency'))}
          />
          {data.discount_price && data.discount_price < data.price ? (
            <Text style={[styles.originalPrice, { color: colors.text }]}>
              {formatPriceForApp(originalPrice, t('courses.currency'))}
            </Text>
          ) : null}
          <CartMainButtons
            courseId={audioBookId}
            isFull={(data.remain_capacity ?? 1) === 0}
            isAccessible={Boolean(data.is_accessible)}
            onPressPrimary={openPurchasedBook}
          />
        </View>

        <CopySection title={detail?.section2_title} body={detail?.section2_description} />
        <CopySection title={detail?.section3_title} body={detail?.section3_description} />

        <View style={[styles.preview, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('screens.audioBookDetail.preview')}
          </Text>
          <InfoRow label={t('screens.audioBookDetail.narrator')} value="حسین اُرا" />
          <InfoRow label={t('screens.audioBookDetail.duration')} value={data.duration ?? '—'} />
          {data.demo ? <AudioPreview url={data.demo} /> : null}
        </View>

        <CopySection title={detail?.section4_title} body={detail?.section4_description} />
        <ClientCommentsSection
          title={t('screens.audioBookDetail.comments')}
          courseId={audioBookId}
          bgcolor={`${colors.card}`}
        />
      </ScrollView>
    );
  }, [
    audioBookId,
    colors,
    coverUri,
    data,
    imageFailed,
    openPurchasedBook,
    refresh,
    refreshing,
    t,
  ]);

  return (
    <ListStateView
      isLoading={isPending}
      isError={Boolean(isError)}
      error={error}
      isEmpty={Boolean(!isPending && !data)}
      onRetry={retry}
      renderList={renderBody}
      loadingMessage={t('screens.audioBookDetail.loading')}
      errorTitle={t('screens.audioBookDetail.error')}
      emptyTitle={t('screens.audioBookDetail.empty')}
      retryLabel={t('listStates.retry')}
      safeAreaEdges={['left', 'right', 'bottom']}
    />
  );
};

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 36, gap: 14 },
  cover: { width: '100%', height: 360, borderRadius: 18 },
  coverFallback: { alignItems: 'center', justifyContent: 'center' },
  coverGlyph: { fontSize: 44, opacity: 0.5 },
  title: { fontSize: 24, fontWeight: '800', textAlign: 'center' },
  short: { fontSize: 16, lineHeight: 25, textAlign: 'center' },
  section: { borderWidth: StyleSheet.hairlineWidth, borderRadius: 14, padding: 16, gap: 8 },
  sectionTitle: { fontSize: 19, fontWeight: '800', textAlign: 'center' },
  sectionBody: { fontSize: 15, lineHeight: 25, textAlign: 'justify' },
  infoBox: { borderWidth: StyleSheet.hairlineWidth, borderRadius: 14, padding: 16, gap: 10 },
  infoRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', gap: 12 },
  infoLabel: { flex: 1, fontSize: 14 },
  infoValue: { flex: 1, fontSize: 14, fontWeight: '700' },
  originalPrice: { textDecorationLine: 'line-through', opacity: 0.55, textAlign: 'center' },
  preview: { borderWidth: StyleSheet.hairlineWidth, borderRadius: 14, padding: 14, gap: 10 },
  audio: { height: 68, backgroundColor: 'transparent' },
});

export const PublicAudioBookDetailScreen = React.memo(PublicAudioBookDetailScreenComponent);
PublicAudioBookDetailScreen.displayName = 'PublicAudioBookDetailScreen';
