import * as React from 'react';
import { Image, View, type StyleProp, type ViewStyle } from 'react-native';
import { Text } from '@/shared/ui/Text';

import type { CartDto } from '@/domains/basket/model/schemas';
import { createCartItemStyles } from '@/domains/basket/components/cartItem.styles';
import {
  asCourseLike,
  coursePrimaryImageSrc,
} from '@/domains/basket/model/courseGuards';
import { formatTomanFa } from '@/domains/basket/utils/formatTomanFa';
import { useThemeColors } from '@/ui/theme';
import { Button } from '@/ui/components/Button';
import CloseIcon from '@/assets/icons/inn/close.svg';

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
  const payablePrice = course?.discount_price ?? course?.price ?? 0;

  const s = createCartItemStyles(colors);

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
      <Button
        layout="auto"
        variant="text"
        title="حذف از سبد"
        accessibilityLabel="حذف از سبد"
        onPress={onRemovePress}
        hitSlop={10}
        style={s.removeHit}
      >
        <CloseIcon width={16} height={16} color={colors.text} />
      </Button>

      <View style={[s.thumbWrap, isDisabled && s.muted]}>
        {imageSrc ? (
          <Image
            source={{ uri: imageSrc }}
            style={s.thumb}
            resizeMode="cover"
          />
        ) : (
          <View style={[s.thumb, s.thumbPlaceholder]} />
        )}
      </View>

      <View style={[s.info, isDisabled && s.muted]}>
        <Text style={s.title} numberOfLines={2}>
          {title}
          {isDisabled ? ' (خریداری شده)' : ''}
        </Text>
        {!isDisabled && (
          <View style={s.metaRow}>
            <Text style={s.metaLabel}>تعداد:</Text>
            <Text style={s.metaValue}>۱</Text>
          </View>
        )}
        {isDisabled ? (
          <Button
            layout="auto"
            variant="filled"
            title="مشاهده دوره"
            onPress={onViewPress}
            style={s.pill}
            contentStyle={{ width: '100%' }}
          >
            <Text style={s.pillText}>مشاهده دوره</Text>
          </Button>
        ) : (
          <View style={s.metaRow}>
            <Text style={s.metaLabel}>قیمت:</Text>
            <View style={s.priceValue}>
              <Text style={s.price}>{formatTomanFa(payablePrice)}</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
});
