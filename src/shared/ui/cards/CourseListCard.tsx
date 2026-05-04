import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Text } from '@/shared/ui/Text';

import type { CatalogItem } from '@/shared/catalog/model/entities';
import {
  formatNumberForApp,
  formatPriceForApp,
} from '@/shared/infra/i18n/formatLocaleNumbers';
import { useAppNavigation } from '@/shared/lib/navigation/useAppNavigation';
import { CatalogListItemCard } from '@/shared/ui/cards/CatalogListItemCard';
import type { ProductListCardStyles } from '@/shared/ui/cards/productListCard.styles';
import { createProductListCardStyles } from '@/shared/ui/cards/productListCard.styles';
import { CartMainButtons } from '@/shared/ui/cart/CartMainButtons';
import { protectedNavigate } from '@/app/bridge/auth';

const PRICE_DISPLAY_DIVISOR = 10;

type CourseListCardProps = {
  course: CatalogItem;
};

function buildStarString(points: number): string {
  const filled = Math.min(5, Math.max(0, Math.round(points)));
  const empty = 5 - filled;
  return `${'★'.repeat(filled)}${'☆'.repeat(empty)}`;
}

const CourseTypeBadge = React.memo(function CourseTypeBadge({
  isPackage,
  s,
}: {
  isPackage: boolean;
  s: ProductListCardStyles;
}) {
  const { t } = useTranslation();
  const label = isPackage ? t('courses.package') : t('courses.normal');

  return (
    <View style={[s.badge, isPackage ? s.badgePackage : null]}>
      <Text style={s.badgeText}>{label}</Text>
    </View>
  );
});
CourseTypeBadge.displayName = 'CourseTypeBadge';

const CourseInfoRow = React.memo(function CourseInfoRow({
  label,
  value,
  s,
}: {
  label: string;
  value: string | React.ReactNode;
  s: ProductListCardStyles;
}) {
  return (
    <View style={s.infoRow}>
      <Text style={s.infoLabel}>{label}</Text>
      {typeof value === 'string' ? (
        <Text style={s.infoValue} numberOfLines={3} ellipsizeMode="tail">
          {value}
        </Text>
      ) : (
        value
      )}
    </View>
  );
});
CourseInfoRow.displayName = 'CourseInfoRow';

const CourseListCardComponent = ({ course }: CourseListCardProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { colors } = theme;
  const s = React.useMemo(
    () => createProductListCardStyles(colors, theme),
    [colors, theme],
  );
  const navigation = useAppNavigation();

  const onPressPrimary = React.useCallback(() => {
    protectedNavigate(navigation, 'CourseDetail', { courseId: course.id });
  }, [course.id, navigation]);

  const onPressSecondary = React.useCallback(() => {
    navigation.navigate('PublicCourseDetail', { courseId: course.id });
  }, [navigation, course.id]);

  const imageUri = course.image_media[0]?.src;
  const displayPrice = formatPriceForApp(
    (course.price ?? 0) / PRICE_DISPLAY_DIVISOR,
    t('courses.currency'),
  );
  const chapters = formatNumberForApp(course.itemsCount);

  const metaBlock = React.useMemo(
    () => (
      <>
        <CourseInfoRow
          label={t('courses.productType')}
          value={<CourseTypeBadge isPackage={!!course.package} s={s} />}
          s={s}
        />
        <CourseInfoRow
          label={t('courses.chaptersCount')}
          value={chapters}
          s={s}
        />
        <CourseInfoRow label={t('courses.price')} value={displayPrice} s={s} />
      </>
    ),
    [chapters, course.package, displayPrice, s, t],
  );

  const cartSlot = React.useMemo(
    () => (
      <CartMainButtons
        courseId={course.id}
        isFull={course.remainCapacity === 0}
        isAccessible={course.isAccessible}
        onPressPrimary={onPressPrimary}
        iconLeftAddToBasket={null}
        iconRightAddToBasket={null}
        iconLeftInBasket={null}
        iconRightInBasket={null}
      />
    ),
    [course.id, course.isAccessible, course.remainCapacity, onPressPrimary],
  );

  return (
    <CatalogListItemCard
      title={course.title_fa}
      imageUri={imageUri}
      starLabel={buildStarString(course.points)}
      styles={s}
      metaBlock={metaBlock}
      cartSlot={cartSlot}
      showSecondaryButton={!course.isAccessible}
      secondaryButtonText={t('courses.moreInformation')}
      onPressSecondary={onPressSecondary}
    />
  );
};

export const CourseListCard = React.memo(CourseListCardComponent);
CourseListCard.displayName = 'CourseListCard';
