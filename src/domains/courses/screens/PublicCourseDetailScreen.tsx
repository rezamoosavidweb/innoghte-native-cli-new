import { useRoute, useTheme, type RouteProp } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';

import { createCourseDetailBodyTextStyles } from '@/domains/courses/ui/courseDetailBody.styles';
import { pickCoverSrc } from '@/domains/courses/utils/pickCoverSrc';
import { useCatalogItemDetail } from '@/shared/catalog/hooks/useCatalogItemDetail';
import { catalogKeys } from '@/shared/catalog/model/queryKeys';
import type { DrawerParamList } from '@/shared/contracts/navigationApp';
import { useAppNavigation } from '@/shared/lib/navigation/useAppNavigation';
import { CartMainButtons } from '@/shared/ui/cart/CartMainButtons';
import { ClientCommentsSection } from '@/shared/ui/comments';
import { Text } from '@/shared/ui/Text';
import BackgroundLayer from '@/ui/components/BackgroundLayer';
import { fontSize, fontWeight, spacing } from '@/ui/theme';
import RenderHTML from 'react-native-render-html';
import type { CustomRenderer } from 'react-native-render-html';
import type { TBlock } from '@native-html/transient-render-engine';
import DiamondIcon from '@/assets/icons/diamond.svg';
import Star2Icon from '@/assets/icons/star2.svg';
import { isDotIr } from '@/shared/config/resolveIsDotIr';
import { splitText } from '@/shared/utils/splitText';
import { Button } from '@/ui/components/Button';
import { CatalogItemDetail } from '@/shared/catalog/model/catalogItemDetail.schema';
import { SvgXml } from 'react-native-svg';
import { KavimoPlayer } from '@/ui/components/KavimoPlayer';

const formatPrice = (value: number) => {
  const numValue = value || 0;
  if (isDotIr) {
    return (numValue / 10).toLocaleString('fa');
  }
  return numValue.toLocaleString();
};

const getCurrencySymbol = (showCurrency: boolean = true) => {
  if (!showCurrency) return '';
  return isDotIr ? ' تومان' : '$';
};

/** SVG data URIs must use SvgXml; RN `Image` does not decode `data:image/svg+xml`. */
const decodeSvgDataUri = (dataUri: string): string | null => {
  if (!dataUri.startsWith('data:image/svg+xml')) {
    return null;
  }
  const comma = dataUri.indexOf(',');
  if (comma === -1) {
    return null;
  }
  const payload = dataUri.slice(comma + 1);
  try {
    // Backend sends percent-encoded (`%3Csvg...`); `;base64` is rare for inline SVG.
    if (dataUri.slice(0, comma).includes('base64')) {
      return null;
    }
    return decodeURIComponent(payload);
  } catch {
    return null;
  }
};

const parseImgDimension = (value: string | undefined, fallback: number) => {
  if (value == null || value === '') {
    return fallback;
  }
  const n = Number.parseInt(String(value).replace(/px$/i, ''), 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

const htmlImgRenderer: CustomRenderer<TBlock> = props => {
  const { InternalRenderer, tnode } = props;
  const src = tnode.attributes.src ?? '';
  if (src.startsWith('data:image/svg+xml')) {
    const xml = decodeSvgDataUri(src);
    const w = parseImgDimension(tnode.attributes.width, 20);
    const h = parseImgDimension(tnode.attributes.height, w);
    if (!xml) {
      return null;
    }
    return (
      <View style={styles.inlineSvgImg}>
        <SvgXml xml={xml} width={w} height={h} />
      </View>
    );
  }
  return <InternalRenderer {...props} />;
};
interface OptionItemProps {
  label: string;
  value: string | number;
}
const OptionItem = ({ label, value }: OptionItemProps) => {
  const { colors } = useTheme();
  const primaryText = React.useMemo(
    () => ({ color: colors.primary }),
    [colors.primary],
  );
  return (
    <View style={styles.optionItemContainer}>
      <View style={styles.optionItemIconContainer}>
        <Star2Icon width={20} height={20} color="#fff" />
        <Text style={styles.whiteText}>{label}</Text>
      </View>

      <Text style={primaryText}>{value}</Text>
    </View>
  );
};

const Details = ({ data }: { data: CatalogItemDetail['details'] }) => {
  const { width } = useWindowDimensions();

  return (
    <View style={styles.detailsContainer}>
      <View>
        {data?.[0]?.image && (
          <Image
            accessibilityIgnoresInvertColors
            source={{ uri: data?.[0]?.image }}
            style={styles.bigDetailImage}
          />
        )}
        {data?.[0]?.title && (
          <Text style={[styles.whiteText, styles.detailsTitle]}>
            {data?.[0]?.title}
          </Text>
        )}
        {data?.[0]?.info && (
          <RenderHTML
            contentWidth={width}
            source={{
              html: data?.[0]?.info,
            }}
            baseStyle={styles.detailsInfo}
            renderers={{ img: htmlImgRenderer }}
          />
        )}
      </View>
      <View>
        {data?.[1]?.image && (
          <Image
            accessibilityIgnoresInvertColors
            source={{ uri: data?.[1]?.image }}
            style={styles.smallDetailImage}
          />
        )}
        {data?.[1]?.title && (
          <Text style={[styles.whiteText, styles.detailsTitle]}>
            {data?.[1]?.title}
          </Text>
        )}
        {data?.[1]?.info && (
          <RenderHTML
            contentWidth={width}
            source={{
              html: data?.[1]?.info,
            }}
            baseStyle={styles.detailsInfoCenter}
            renderers={{ img: htmlImgRenderer }}
          />
        )}
      </View>
      <View>
        {data?.[2]?.image && (
          <Image
            accessibilityIgnoresInvertColors
            source={{ uri: data?.[2]?.image }}
            style={styles.bigDetailImage}
          />
        )}
        {data?.[2]?.title && (
          <Text style={[styles.whiteText, styles.detailsTitle]}>
            {data?.[2]?.title}
          </Text>
        )}
        {data?.[2]?.info && (
          <RenderHTML
            contentWidth={width - 60}
            source={{
              html: data?.[2]?.info,
            }}
            baseStyle={styles.detailsInfo}
            renderers={{ img: htmlImgRenderer }}
            tagsStyles={{
              p: {
                marginBottom: 12,
                flexDirection: 'row',
                alignItems: 'center',
                fontWeight: fontWeight.bold,
                flexWrap: 'nowrap',
                width: width - 75,
              },
              strong: {
                fontWeight: 'bold',
              },

              ul: {
                marginVertical: 10,
                width: '100%',
                // paddingVertical:spacing.lg
              },

              li: {
                flexDirection: 'row',
                alignItems: 'flex-start',
                marginBottom: 6,
                width: '100%',
              },
            }}
          />
        )}
      </View>
    </View>
  );
};
const PublicCourseDetailScreenComponent = () => {
  const navigation = useAppNavigation();
  const { width } = useWindowDimensions();
  const { colors } = useTheme();
  const route = useRoute<RouteProp<DrawerParamList, 'PublicCourseDetail'>>();
  const courseId = route.params.courseId;

  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data, isPending, isSuccess, isRefetching } =
    useCatalogItemDetail(courseId);

  const splitFullInfo = splitText(data?.full_info || '');
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

  const coverUri = React.useMemo(
    () => (data ? pickCoverSrc(data) : ''),
    [data],
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: data?.title_fa ?? t('screens.courseDetail.title'),
      headerTitleAlign: 'center',
    });
  }, [data?.title_fa, navigation, t]);

  const [imgFailed, setImgFailed] = React.useState(false);

  const purchased = Boolean(data?.is_accessible);

  const onPressPrimary = React.useCallback(() => {
    navigation.navigate('CourseDetail', { courseId });
  }, [navigation, courseId]);

  const bodyText = createCourseDetailBodyTextStyles(colors);

  if (isPending) return <Text>Loading . . .</Text>;

  return (
    <View style={styles.wrapper}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        refreshControl={refreshControl}
        nestedScrollEnabled
      >
        <Text style={[styles.short, bodyText.short]}>{data?.short_info}</Text>
        <View style={styles.container}>
          <BackgroundLayer
            bgColor={data?.is_packge ? '#111123' : '#001605'}
            top={150}
            // bottom={data?.is_packge ? 0 : 150}
          />
          {!imgFailed && coverUri && (
            <Image
              accessibilityIgnoresInvertColors
              source={{ uri: coverUri }}
              style={styles.cover}
              onError={() => {
                setImgFailed(true);
              }}
            />
          )}

          <View style={styles.fullInfo}>
            <DiamondIcon style={styles.diamond} color="#fff" />
            <RenderHTML
              contentWidth={width}
              source={{
                html: splitFullInfo[1] || splitFullInfo[0] || '',
              }}
              baseStyle={styles.htmlWhiteText}
            />
          </View>
          <View style={styles.optionsContainer}>
            <OptionItem
              label={'پیش نیاز'}
              value={data?.requirements || 'ندارد'}
            />
            <OptionItem
              label={'قابلیت دانلود'}
              value={data?.is_downloadable ? 'دارد' : 'ندارد'}
            />
            <OptionItem
              label={'نحوه دسترسی'}
              value={data?.access_type || '-'}
            />
            <OptionItem
              label={'محدودیت دسترسی'}
              value={
                isDotIr ? 'جهت استفاه در کشور ایران' : 'محدودیت دسترسی ندارد'
              }
            />
          </View>
          <View style={styles.actionRow}>
            <Button variant="outlined" style={styles.action}>
              <Text style={styles.whiteText}>سرفصل دوره</Text>
            </Button>
            <Button variant="outlined" title="دموی دوره" style={styles.action}>
              <Text style={styles.whiteText}>دموی دوره</Text>
            </Button>
          </View>
          <Button
            variant="outlined"
            style={[styles.action, styles.actionAlone]}
          >
            <Text style={styles.whiteText}>دیدگاه شرکت کنندگان</Text>
          </Button>
          <Details data={data?.details} />
          <KavimoPlayer activeChapterMedia={data?.demo || ''} />
        </View>
        <ClientCommentsSection
          title={t('screens.courseDetail.commentsTitle')}
          courseId={courseId}
          bgcolor={`${colors.card}`}
        />
      </ScrollView>
      <View style={[styles.floatingAction, { backgroundColor: colors.card }]}>
        <CartMainButtons
          courseId={courseId}
          isFull={(data?.remain_capacity ?? 1) === 0}
          isAccessible={purchased}
          onPressPrimary={onPressPrimary}
          containerStyle={styles.floatingActionBtn}
        />
        <View style={styles.floatingActionPriceContainer}>
          <Text style={styles.floatingActionPriceText}>قیمت</Text>
          {data?.price && (
            <Text style={styles.floatingActionPriceText}>
              {isDotIr ? (
                <>
                  <Text style={styles.price}>{formatPrice(data?.price)}</Text>{' '}
                  {getCurrencySymbol(true)}
                </>
              ) : (
                <>
                  {getCurrencySymbol(true)}{' '}
                  <Text style={styles.price}>{formatPrice(data?.price)}</Text>
                </>
              )}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  scroll: { flex: 1, paddingVertical: spacing.lg },

  scrollContent: {
    paddingBottom: 28,
  },

  container: {
    zIndex: 1,
    paddingHorizontal: spacing.lg,
    position: 'relative',
  },
  cover: {
    width: '100%',
    height: 430,
    borderRadius: 12,
    marginTop: 8,
  },
  coverPh: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingAction: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.base,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.xl,
  },
  floatingActionPriceContainer: {
    flex: 1,
  },
  floatingActionPriceText: {},
  floatingActionBtn: {
    flex: 1.8,
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
    padding: spacing.lg,
  },
  whiteText: {
    color: '#fff',
  },
  htmlWhiteText: {
    color: '#fff',
  },
  fullInfo: {
    alignSelf: 'center',
    marginVertical: spacing.md,
  },
  optionsContainer: {
    gap: spacing.md,
    marginVertical: spacing.xl,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.md,
    flex: 1,
    marginTop: spacing.md,
  },
  actionAlone: {
    marginTop: spacing.md,
    marginBottom: spacing['3xl'],
  },
  action: {
    flex: 1,
    color: '#fff',
    borderColor: '#fff',
  },
  full: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'justify',
    opacity: 0.85,
  },
  optionItemContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  diamond: {
    alignSelf: 'center',
  },
  optionItemIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
  },
  detailsContainer: {
    gap: spacing.md,
    marginVertical: spacing.lg,
  },
  detailsTitle: {
    textAlign: 'center',
    fontWeight: fontWeight.bold,
    marginVertical: spacing.lg,
  },
  detailsTitle2: {
    fontWeight: fontWeight.bold,
    marginVertical: spacing.lg,
  },
  detailsInfo: {
    textAlign: 'justify',
    color: '#fff',
  },
  bigDetailImage: {
    width: '100%',
    height: 330,
    borderRadius: spacing.md,
  },
  price: {
    fontWeight: fontWeight.heavy,
    fontSize: fontSize.base,
  },
  smallDetailImage: {
    width: 70,
    height: 48,
    alignSelf: 'center',
  },
  detailsInfoCenter: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: fontWeight.bold,
  },
  /** Space inline SVG bullets from following text; avoid `gap` (unsupported on some RN Android). */
  inlineSvgImg: {
    marginEnd: spacing.md,
    justifyContent: 'center',
  },
});

PublicCourseDetailScreenComponent.displayName = 'PublicCourseDetailScreen';
export const PublicCourseDetailScreen = PublicCourseDetailScreenComponent;
