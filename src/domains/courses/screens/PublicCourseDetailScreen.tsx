import { useRoute, useTheme, type RouteProp } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  RefreshControl,
  ScrollView,
  useWindowDimensions,
  View,
} from 'react-native';

import DiamondIcon from '@/assets/icons/diamond.svg';

import { Details } from '@/domains/courses/ui/public-course-detail/Detail';
import { OptionItem } from '@/domains/courses/ui/public-course-detail/OptionIem';
import PublicChapters from '@/domains/courses/ui/public-course-detail/chapter/PublicChapters';
import { createPublicCourseDetailStyles } from '@/domains/courses/ui/public-course-detail/publicCourseDetail.styles';
import { pickCoverSrc } from '@/domains/courses/utils/pickCoverSrc';
import { useCatalogItemDetail } from '@/shared/catalog/hooks/useCatalogItemDetail';
import { catalogKeys } from '@/shared/catalog/model/queryKeys';
import { isDotIr } from '@/shared/config/resolveIsDotIr';
import type { DrawerParamList } from '@/shared/contracts/navigationApp';
import { useAppNavigation } from '@/shared/lib/navigation/useAppNavigation';
import { CartMainButtons } from '@/shared/ui/cart/CartMainButtons';
import { ClientCommentsSection } from '@/shared/ui/comments';
import { Text } from '@/shared/ui/Text';
import { splitText } from '@/shared/utils/splitText';
import BackgroundLayer from '@/ui/components/BackgroundLayer';
import { Button } from '@/ui/components/Button';
import RenderHTML from 'react-native-render-html';

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

  const s = createPublicCourseDetailStyles(colors);

  if (isPending) return <Text>Loading . . .</Text>;

  return (
    <View style={s.wrapper}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        keyboardShouldPersistTaps="handled"
        refreshControl={refreshControl}
        nestedScrollEnabled
      >
        <Text style={[s.short, s.themText]}>{data?.short_info}</Text>
        <View style={s.container}>
          <BackgroundLayer
            bgColor={data?.is_packge ? '#111123' : '#001605'}
            top={150}
            // bottom={data?.is_packge ? 0 : 150}
          />
          {!imgFailed && coverUri && (
            <Image
              accessibilityIgnoresInvertColors
              source={{ uri: coverUri }}
              style={s.cover}
              onError={() => {
                setImgFailed(true);
              }}
            />
          )}

          <View style={s.fullInfo}>
            <DiamondIcon style={s.diamond} color="#fff" />
            <RenderHTML
              contentWidth={width}
              source={{
                html: splitFullInfo[1] || splitFullInfo[0] || '',
              }}
              baseStyle={s.htmlWhiteText}
            />
          </View>
          <View style={s.optionsContainer}>
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
          <View style={s.actionRow}>
            <Button variant="outlined" style={s.action}>
              <Text style={s.whiteText}>سرفصل دوره</Text>
            </Button>
            <Button variant="outlined" title="دموی دوره" style={s.action}>
              <Text style={s.whiteText}>دموی دوره</Text>
            </Button>
          </View>
          <Button variant="outlined" style={[s.action, s.actionAlone]}>
            <Text style={s.whiteText}>دیدگاه شرکت کنندگان</Text>
          </Button>
          <Details data={data?.details} />
          {/* <KavimoPlayer activeChapterMedia={data?.demo || ''} /> */}
        </View>
        <PublicChapters data={data?.chapters || []} />
        <ClientCommentsSection
          title={t('screens.courseDetail.commentsTitle')}
          courseId={courseId}
          bgcolor={`${colors.card}`}
        />
      </ScrollView>
      <View style={[s.floatingAction, { backgroundColor: colors.card }]}>
        <CartMainButtons
          courseId={courseId}
          isFull={(data?.remain_capacity ?? 1) === 0}
          isAccessible={purchased}
          onPressPrimary={onPressPrimary}
          containerStyle={s.floatingActionBtn}
        />
        <View style={s.floatingActionPriceContainer}>
          <Text style={s.floatingActionPriceText}>قیمت</Text>
          {data?.price && (
            <Text style={s.floatingActionPriceText}>
              {isDotIr ? (
                <>
                  <Text style={s.price}>{formatPrice(data?.price)}</Text>{' '}
                  {getCurrencySymbol(true)}
                </>
              ) : (
                <>
                  {getCurrencySymbol(true)}{' '}
                  <Text style={s.price}>{formatPrice(data?.price)}</Text>
                </>
              )}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

PublicCourseDetailScreenComponent.displayName = 'PublicCourseDetailScreen';
export const PublicCourseDetailScreen = PublicCourseDetailScreenComponent;
