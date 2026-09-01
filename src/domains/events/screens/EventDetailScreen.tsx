import { useQueryClient } from '@tanstack/react-query';
import * as React from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  useRoute,
  useTheme,
  type RouteProp,
} from '@react-navigation/native';
import RenderHTML from 'react-native-render-html';

import { useCatalogItemDetail } from '@/shared/catalog/hooks/useCatalogItemDetail';
import type { CatalogItemDetail } from '@/shared/catalog/model/catalogItemDetail.schema';
import { catalogKeys } from '@/shared/catalog/model/queryKeys';
import type { DrawerParamList } from '@/shared/contracts/navigationApp';
import { useAppNavigation } from '@/shared/lib/navigation/useAppNavigation';
import { CartMainButtons } from '@/shared/ui/cart/CartMainButtons';
import { ClientCommentsSection } from '@/shared/ui/comments';
import { ListStateView } from '@/shared/ui/list-states/ListStateView';
import { Text } from '@/shared/ui/Text';
import { palette } from '@/ui/theme/colors';
import { hexAlpha } from '@/ui/theme/utils/colorUtils';

import {
  formatEventDate,
  formatEventTime,
  isEventPast,
} from '@/domains/events/utils/eventDetailDate';

type Media = NonNullable<CatalogItemDetail['medias']>[number];

const EVENT_SURFACE = '#29292b';
const EVENT_ACCENT = '#f1c31b';
const EVENT_ACTION = '#2f9b55';

function SectionTitle({ title }: { title: string }) {
  return (
    <View style={styles.sectionHeading}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <View style={styles.dividerMarkOuter}>
          <View style={styles.dividerMarkInner} />
        </View>
        <View style={styles.dividerLine} />
      </View>
    </View>
  );
}

function EventMeta({ label, value }: { label: string; value: string }) {
  if (!value) {
    return null;
  }
  return (
    <View style={styles.metaItem}>
      <Text style={styles.metaStar}>✦</Text>
      <View style={styles.metaCopy}>
        <Text style={styles.metaLabel}>{label}</Text>
        <Text style={styles.metaValue}>{value}</Text>
      </View>
    </View>
  );
}

function EventGallery({ items, title }: { items: Media[]; title: string }) {
  if (!items.length) {
    return null;
  }
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.galleryContent}
      accessibilityLabel={title}
    >
      {items.map((item, index) => (
        <Image
          key={item.id ?? `${item.src}-${index}`}
          accessibilityIgnoresInvertColors
          source={{ uri: item.src }}
          style={styles.galleryImage}
          resizeMode="cover"
          accessibilityLabel={`${title} ${index + 1}`}
        />
      ))}
    </ScrollView>
  );
}

const EventDetailScreenComponent = () => {
  const route = useRoute<RouteProp<DrawerParamList, 'PublicEventDetail'>>();
  const navigation = useAppNavigation();
  const eventId = route.params.eventId;
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const queryClient = useQueryClient();

  const { data, isPending, isError, error, refetch, isSuccess, isRefetching } =
    useCatalogItemDetail(eventId);
  const refreshing = Boolean(isSuccess && data != null && isRefetching);
  const event = data?.event_detail;
  const past =
    event?.state === 'past' ||
    (event?.state !== 'ongoing' && isEventPast(event?.start_at));

  React.useLayoutEffect(() => {
    navigation.setOptions({ title: data?.title_fa ?? t('drawer.publicEventDetail') });
  }, [data?.title_fa, navigation, t]);

  const refresh = React.useCallback(() => {
    queryClient
      .invalidateQueries({ queryKey: catalogKeys.detail(eventId) })
      .catch(() => {});
  }, [eventId, queryClient]);
  const refreshControl = React.useMemo(
    () => <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={palette.white} />,
    [refresh, refreshing],
  );

  const mediaGroups = React.useMemo(() => {
    const images = (data?.medias ?? []).filter(media => media.type === 'image');
    return {
      main: images.find(media => media.priority === 1) ?? images[0],
      location: images.filter(media => [3, 4, 5].includes(media.priority ?? -1)),
      registration: images.filter(media => (media.priority ?? 0) > 5),
    };
  }, [data?.medias]);

  const renderHtml = React.useCallback(
    (html: string) => (
      <RenderHTML
        contentWidth={Math.max(width - 48, 240)}
        source={{ html }}
        baseStyle={styles.htmlBase}
        tagsStyles={{
          p: styles.htmlParagraph,
          li: styles.htmlParagraph,
          strong: styles.htmlStrong,
          b: styles.htmlStrong,
          a: styles.htmlLink,
        }}
        ignoredStyles={['color', 'backgroundColor', 'fontFamily', 'fontSize']}
      />
    ),
    [width],
  );

  const renderBody = React.useCallback(() => {
    if (!data) {
      return <></>;
    }

    const showWorkshopPurchase =
      event?.type === 'workshop' && !past && !data.is_accessible;
    const showRegistrationEnded = event?.type === 'retreat' && past;

    return (
      <ScrollView
        style={[styles.scroll, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={refreshControl}
      >
        <View style={styles.intro}>
          <Text style={[styles.title, { color: colors.text }]}>{data.title_fa}</Text>
          {data.short_info ? (
            <Text style={[styles.shortInfo, { color: hexAlpha(colors.text, 0.78) }]}>
              {data.short_info}
            </Text>
          ) : null}
        </View>

        <View style={styles.eventSurface}>
          {mediaGroups.main ? (
            <Image
              accessibilityIgnoresInvertColors
              source={{ uri: mediaGroups.main.src }}
              style={styles.mainImage}
              resizeMode="cover"
            />
          ) : null}

          <View style={styles.metaGrid}>
            <EventMeta
              label={t('screens.eventDetail.location')}
              value={event?.location ?? ''}
            />
            <EventMeta
              label={t('screens.eventDetail.date')}
              value={formatEventDate(event?.start_at)}
            />
            {!past ? (
              <EventMeta
                label={t('screens.eventDetail.time')}
                value={formatEventTime(event?.start_at)}
              />
            ) : null}
          </View>

          {showWorkshopPurchase ? (
            <View style={styles.purchaseAction}>
              <CartMainButtons
                courseId={eventId}
                isFull={(data.remain_capacity ?? 1) === 0}
                isAccessible={false}
                onPressPrimary={() => {}}
                containerStyle={styles.purchaseButton}
              />
            </View>
          ) : null}

          <SectionTitle title={t('screens.eventDetail.schedule')} />
          {data.full_info ? renderHtml(data.full_info) : null}

          {event?.location ? (
            <>
              <SectionTitle title={t('screens.eventDetail.venue')} />
              <Text style={styles.locationName}>{event.location}</Text>
              {event.location_info ? renderHtml(event.location_info) : null}
              <EventGallery
                items={mediaGroups.location}
                title={t('screens.eventDetail.venue')}
              />
            </>
          ) : null}

          {event?.type === 'retreat' && event.registration_info ? (
            <>
              <SectionTitle title={t('screens.eventDetail.registration')} />
              {renderHtml(event.registration_info)}
              <EventGallery
                items={mediaGroups.registration}
                title={t('screens.eventDetail.registration')}
              />
            </>
          ) : null}
        </View>

        {showRegistrationEnded ? (
          <View style={styles.endedNotice}>
            <Text style={styles.endedIcon}>!</Text>
            <Text style={styles.endedText}>
              {t('screens.eventDetail.registrationEnded')}
            </Text>
          </View>
        ) : null}

        <View style={styles.comments}>
          <ClientCommentsSection
            courseId={eventId}
            title={t('screens.eventDetail.comments')}
            bgcolor={colors.card}
          />
        </View>
      </ScrollView>
    );
  }, [
    colors.background,
    colors.card,
    colors.text,
    data,
    event,
    eventId,
    mediaGroups.location,
    mediaGroups.main,
    mediaGroups.registration,
    past,
    refreshControl,
    renderHtml,
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
      renderList={renderBody}
      loadingMessage={t('screens.eventDetail.loading')}
      errorTitle={t('screens.eventDetail.error')}
      emptyTitle={t('screens.eventDetail.empty')}
      retryLabel={t('listStates.retry')}
      safeAreaEdges={['left', 'right', 'bottom']}
    />
  );
};

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 32 },
  intro: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 16, gap: 7 },
  title: { fontSize: 23, fontWeight: '800', textAlign: 'center', lineHeight: 33 },
  shortInfo: { fontSize: 14, lineHeight: 22, textAlign: 'center' },
  eventSurface: {
    backgroundColor: EVENT_SURFACE,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 28,
  },
  mainImage: {
    width: '100%',
    aspectRatio: 4 / 3,
    maxHeight: 400,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: palette.white,
  },
  metaGrid: { gap: 14, paddingVertical: 20 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  metaStar: { color: palette.white, fontSize: 18, width: 22, textAlign: 'center' },
  metaCopy: { flex: 1, flexDirection: 'row', alignItems: 'baseline', gap: 7 },
  metaLabel: { color: palette.white, fontSize: 14, fontWeight: '700' },
  metaValue: { color: EVENT_ACCENT, fontSize: 17, fontWeight: '800', flexShrink: 1 },
  purchaseAction: { marginBottom: 6 },
  purchaseButton: { backgroundColor: EVENT_ACTION, borderRadius: 6 },
  sectionHeading: { alignItems: 'center', marginTop: 23, marginBottom: 12, gap: 4 },
  sectionTitle: { color: palette.white, fontSize: 19, fontWeight: '800', textAlign: 'center' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', width: '100%' },
  dividerLine: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#e0e0e0' },
  dividerMarkOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginHorizontal: 9,
    borderWidth: 1,
    borderColor: '#858585',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dividerMarkInner: { width: 7, height: 7, borderRadius: 4, backgroundColor: EVENT_ACCENT },
  htmlBase: { color: palette.white, fontSize: 15, lineHeight: 25, textAlign: 'center' },
  htmlParagraph: { color: palette.white, fontSize: 15, lineHeight: 25, textAlign: 'center', marginVertical: 4 },
  htmlStrong: { color: palette.white, fontWeight: '700' },
  htmlLink: { color: EVENT_ACCENT },
  locationName: {
    color: palette.white,
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 7,
  },
  galleryContent: { gap: 10, paddingTop: 13, paddingBottom: 4 },
  galleryImage: { width: 280, height: 178, borderRadius: 8, backgroundColor: '#1d1d1f' },
  endedNotice: {
    marginHorizontal: 16,
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  endedIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f87171',
    color: '#f87171',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '800',
  },
  endedText: { color: '#f87171', fontSize: 14, fontWeight: '700', flexShrink: 1 },
  comments: { paddingHorizontal: 16, paddingTop: 22 },
});

EventDetailScreenComponent.displayName = 'EventDetailScreen';
export const EventDetailScreen = EventDetailScreenComponent;
