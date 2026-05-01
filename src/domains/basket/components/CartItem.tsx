import * as React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle
} from 'react-native';
import { Text } from '@/shared/ui/Text';

import type { CartDto } from '@/domains/basket/model/schemas';
import {
  asCourseLike,
  coursePrimaryImageSrc,
} from '@/domains/basket/model/courseGuards';
import { formatTomanFa } from '@/domains/basket/utils/formatTomanFa';
import {
  useThemeColors,
  fontSize,
  fontWeight,
  radius,
  spacing,
} from '@/ui/theme';
import { isDotIr, scopeHeader } from '@/shared/config/resolveIsDotIr';

export type CartItemProps = {
  item: CartDto;
  giftsCourseIds: readonly number[];
  onRemove: (cartLineId: number) => void;
  onViewCourse: (courseId: number) => void;
  containerStyle?: StyleProp<ViewStyle>;
};

export const CartItem = React.memo(function CartItem({
  item,
  giftsCourseIds,
  onRemove,
  onViewCourse,
  containerStyle,
}: CartItemProps) {
  const colors = useThemeColors();
  const course = asCourseLike(item.course);
  const imageSrc = coursePrimaryImageSrc(item.course);
  const isGift = giftsCourseIds.includes(item.course_id);
  const isDisabled = !isGift && Boolean(course?.is_accessible);
  const title = course?.title_fa ?? '—';
  console.log({ isDisabled: course, isDotIr, scopeHeader });

  const s = React.useMemo(
    () =>
      StyleSheet.create({
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: spacing.md,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.border,
        },
        grow: { flex: 1, flexDirection: 'row', alignItems: 'center' },
        thumbWrap: {
          width: 72,
          height: 72,
          borderRadius: radius.sm,
          borderWidth: 2,
          borderColor: colors.border,
          marginHorizontal: spacing.sm,
          overflow: 'hidden',
          padding: 3,
        },
        thumb: { width: '100%', height: '100%', borderRadius: 4 },
        muted: { opacity: 0.35 },
        title: {
          flex: 1,
          fontSize: fontSize.base + 1,
          fontWeight: fontWeight.medium,
          color: colors.text,
        },
        removeHit: { padding: spacing.sm },
        remove: { fontSize: fontSize.lg, color: colors.textSecondary },
        qty: {
          fontSize: fontSize.sm,
          color: colors.textSecondary,
          marginTop: 4,
        },
        priceCol: { alignItems: 'flex-end' },
        price: {
          fontSize: fontSize.base,
          fontWeight: fontWeight.semibold,
          color: colors.text,
        },
        strike: {
          fontSize: fontSize.sm,
          textDecorationLine: 'line-through',
          color: colors.textMuted,
        },
        pill: {
          marginTop: spacing.sm,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.xs,
          borderRadius: radius.full,
          backgroundColor: colors.primarySoft,
        },
        pillText: {
          color: colors.primary,
          fontWeight: fontWeight.medium,
          fontSize: fontSize.sm,
        },
      }),
    [colors],
  );

  const onRemovePress = React.useCallback(() => {
    onRemove(item.id);
  }, [item.id, onRemove]);

  const onViewPress = React.useCallback(() => {
    if (course?.id != null) {
      onViewCourse(course.id);
    }
  }, [course?.id, onViewCourse]);

  return (
    <View style={[s.row, containerStyle]}>
      <Pressable
        onPress={onRemovePress}
        style={s.removeHit}
        accessibilityRole="button"
        accessibilityLabel="حذف از سبد"
      >
        <Text style={s.remove}>×</Text>
      </Pressable>
      <View style={s.grow}>
        <View style={[s.thumbWrap, isDisabled && s.muted]}>
          {imageSrc ? (
            <Image
              source={{ uri: imageSrc }}
              style={s.thumb}
              resizeMode="cover"
            />
          ) : (
            <View
              style={[s.thumb, { backgroundColor: colors.surfaceSecondary }]}
            />
          )}
        </View>
        <View style={[s.grow, isDisabled && s.muted]}>
          <Text style={s.title}>
            {title}
            {isDisabled ? ' (خریداری شده)' : ''}
          </Text>
          <Text style={s.qty}>تعداد: ۱</Text>
        </View>
      </View>
      {isDisabled ? (
        <Pressable
          onPress={onViewPress}
          style={s.pill}
          accessibilityRole="button"
          accessibilityLabel="مشاهده دوره"
        >
          <Text style={s.pillText}>مشاهده دوره</Text>
        </Pressable>
      ) : (
        <View style={s.priceCol}>
          {course?.discount_price != null &&
          course.discount_price !== course.price ? (
            <>
              <Text style={s.strike}>{formatTomanFa(course.price ?? 0)}</Text>
              <Text style={s.price}>
                {formatTomanFa(course.discount_price)}
              </Text>
            </>
          ) : (
            <Text style={s.price}>{formatTomanFa(course?.price ?? 0)}</Text>
          )}
        </View>
      )}
    </View>
  );
});
