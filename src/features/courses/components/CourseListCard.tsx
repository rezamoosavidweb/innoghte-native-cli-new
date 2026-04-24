import * as React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import type { ProductListCardStyles } from '../../../theme/productListCardThemed';
import { useProductListCardStyles } from '../../../theme/productListCardThemed';
import {
  formatNumberForApp,
  formatPriceForApp,
} from '../../../lib/formatLocaleNumbers';
import { isPurchasedProduct } from '../../../lib/purchasedProductIds';
import type { Course } from '../data/seedCourses';

const PRICE_DISPLAY_DIVISOR = 10;

function noop(): void {}

type CourseListCardProps = {
  course: Course;
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

const CourseCardHeader = React.memo(function CourseCardHeader({
  title,
  imageUri,
  starLabel,
  s,
}: {
  title: string;
  imageUri: string | undefined;
  starLabel: string;
  s: ProductListCardStyles;
}) {
  const [failed, setFailed] = React.useState(false);

  return (
    <View style={s.headerRow}>
      <View style={s.headerTextCol}>
        <Text style={s.title} numberOfLines={3}>
          {title}
        </Text>
        <Text style={s.stars}>{starLabel}</Text>
      </View>
      {!failed && imageUri ? (
        <Image
          accessibilityIgnoresInvertColors
          source={{ uri: imageUri }}
          style={s.thumb}
          onError={() => {
            setFailed(true);
          }}
        />
      ) : (
        <View style={[s.thumb, s.imagePlaceholder]}>
          <Text style={s.placeholderGlyph}>▣</Text>
        </View>
      )}
    </View>
  );
});
CourseCardHeader.displayName = 'CourseCardHeader';

const CourseListCardComponent = ({ course }: CourseListCardProps) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const s = useProductListCardStyles(colors);
  const purchased = isPurchasedProduct(course.id);
  const imageUri = course.image_media[0]?.src;
  const displayPrice = formatPriceForApp(
    (course.price ?? 0) / PRICE_DISPLAY_DIVISOR,
    t('courses.currency'),
  );
  const chapters = formatNumberForApp(course.count_chapters ?? 0);

  return (
    <View style={s.card}>
      <CourseCardHeader
        title={course.title_fa}
        imageUri={imageUri}
        starLabel={buildStarString(course.points)}
        s={s}
      />

      <View style={s.metaBlock}>
        <CourseInfoRow
          label={t('courses.productType')}
          value={<CourseTypeBadge isPackage={!!course.package} s={s} />}
          s={s}
        />
        <CourseInfoRow label={t('courses.chaptersCount')} value={chapters} s={s} />
        <CourseInfoRow label={t('courses.price')} value={displayPrice} s={s} />
      </View>

      <View style={s.actionsRow}>
        {purchased ? (
          <Pressable
            accessibilityRole="button"
            onPress={noop}
            style={({ pressed }) =>
              pressed ? [s.buttonPrimary, s.pressed] : s.buttonPrimary
            }
          >
            <Text style={s.buttonPrimaryText}>{t('courses.show')}</Text>
          </Pressable>
        ) : (
          <>
            <Pressable
              accessibilityRole="button"
              onPress={noop}
              style={({ pressed }) =>
                pressed ? [s.buttonOutlined, s.pressed] : s.buttonOutlined
              }
            >
              <Text style={s.buttonOutlinedText}>
                {t('courses.moreInformation')}
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={noop}
              style={({ pressed }) =>
                pressed ? [s.buttonSuccess, s.pressed] : s.buttonSuccess
              }
            >
              <Text style={s.buttonPrimaryText}>{t('courses.buy')}</Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
};

export const CourseListCard = React.memo(CourseListCardComponent);
CourseListCard.displayName = 'CourseListCard';
