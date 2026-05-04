import * as React from 'react';
import {
  Image,
  View,
  type StyleProp,
  type ViewStyle
} from 'react-native';
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
        style={s.removeHit}
      >
        <Text style={s.remove}>×</Text>
      </Button>
      <View style={s.grow}>
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
        <View style={[s.grow, isDisabled && s.muted]}>
          <Text style={s.title}>
            {title}
            {isDisabled ? ' (خریداری شده)' : ''}
          </Text>
          <Text style={s.qty}>تعداد: ۱</Text>
        </View>
      </View>
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
