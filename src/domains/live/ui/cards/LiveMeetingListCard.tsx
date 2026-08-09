import {useTheme} from '@react-navigation/native';
import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';

import type {LiveMeetingType} from '@/domains/live/model/liveMeeting.entities';
import {formatPriceForApp} from '@/shared/infra/i18n/formatLocaleNumbers';
import {useAppNavigation} from '@/shared/lib/navigation/useAppNavigation';
import {CatalogListItemCard} from '@/shared/ui/cards/CatalogListItemCard';
import type {ProductListCardStyles} from '@/shared/ui/cards/productListCard.styles';
import {createProductListCardStyles} from '@/shared/ui/cards/productListCard.styles';
import {CartMainButtons} from '@/shared/ui/cart/CartMainButtons';
import {Text} from '@/shared/ui/Text';

const PRICE_DISPLAY_DIVISOR = 10;

type Props = {item: LiveMeetingType};

const TypeBadge = React.memo(function TypeBadge({
  isPackage,
  s,
}: {
  isPackage: boolean;
  s: ProductListCardStyles;
}) {
  const {t} = useTranslation();
  return (
    <View style={[s.badge, isPackage ? s.badgePackage : null]}>
      <Text style={s.badgeText}>
        {isPackage ? t('courses.package') : t('courses.normal')}
      </Text>
    </View>
  );
});
TypeBadge.displayName = 'TypeBadge';

const LiveMeetingListCardComponent = ({item}: Props) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const s = React.useMemo(
    () => createProductListCardStyles(theme.colors, theme),
    [theme],
  );
  const navigation = useAppNavigation();

  const price = formatPriceForApp(
    (item.price ?? 0) / PRICE_DISPLAY_DIVISOR,
    t('courses.currency'),
  );

  const onPressPrimary = React.useCallback(() => {
    navigation.navigate('CourseDetail', {courseId: item.id});
  }, [item.id, navigation]);

  const onPressSecondary = React.useCallback(() => {
    navigation.navigate('PublicCourseDetail', {courseId: item.id});
  }, [item.id, navigation]);

  const metaBlock = (
    <>
      <View style={s.infoRow}>
        <Text style={s.infoLabel}>{t('courses.productType')}</Text>
        <TypeBadge isPackage={!!item.package} s={s} />
      </View>
      <View style={s.infoRow}>
        <Text style={s.infoLabel}>{t('courses.price')}</Text>
        <Text style={s.infoValue}>{price}</Text>
      </View>
    </>
  );

  return (
    <CatalogListItemCard
      title={item.title_fa}
      imageUri={item.image_media[0]?.src}
      showSecondaryButton={!item.is_accessible}
      styles={s}
      metaBlock={metaBlock}
      cartSlot={
        <CartMainButtons
          courseId={item.id}
          isFull={false}
          isAccessible={item.is_accessible}
          onPressPrimary={onPressPrimary}
        />
      }
      secondaryButtonText={t('courses.moreInformation')}
      onPressSecondary={onPressSecondary}
    />
  );
};

export const LiveMeetingListCard = React.memo(LiveMeetingListCardComponent);
LiveMeetingListCard.displayName = 'LiveMeetingListCard';
