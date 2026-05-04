import { Text } from '@/shared/ui/Text';
import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { View, type ViewStyle } from 'react-native';

import { navigateToAppLeaf } from '@/app/bridge/auth/protectedNavigation';
import { useBasketCart } from '@/domains/basket/hooks/useBasketCart';
import { useAppNavigation } from '@/shared/lib/navigation/useAppNavigation';
import { Button } from '@/ui/components/Button';
import {
  createCartMainButtonsStyles,
  useCartMainButtonsStyles,
} from './cartMainButtons.styles';

export type CartMainButtonsProps = {
  courseId: number;
  isFull: boolean;
  isAccessible: boolean;
  fullWidth?: boolean;
  showBtnText?: string;
  secondaryButtonText?: string;
  addToBasketBtnText?: string;
  inBasketBtnText?: string;
  capacityFullText?: string;
  containerStyle?: ViewStyle | ViewStyle[];
  fillCapacityStyle?: ViewStyle | ViewStyle[];
  iconLeftAddToBasket?: React.ReactNode | null;
  iconRightAddToBasket?: React.ReactNode | null;
  iconLeftInBasket?: React.ReactNode | null;
  iconRightInBasket?: React.ReactNode | null;
  onPressPrimary: () => void;
  onPressSecondary?: () => void;
};

type LabelProps = {
  text: string;
  textStyle: object;
  left?: React.ReactNode | null;
  right?: React.ReactNode | null;
  styles: ReturnType<typeof createCartMainButtonsStyles>;
};

const LabelWithIcons = React.memo(function LabelWithIcons({
  text,
  textStyle,
  left,
  right,
  styles: s,
}: LabelProps) {
  const hasIcons = Boolean(left) || Boolean(right);
  if (!hasIcons) {
    return (
      <Text style={textStyle} numberOfLines={2}>
        {text}
      </Text>
    );
  }
  return (
    <View style={s.labelRow}>
      {left ?? null}
      <Text style={textStyle} numberOfLines={2}>
        {text}
      </Text>
      {right ?? null}
    </View>
  );
});
LabelWithIcons.displayName = 'LabelWithIcons';

const CartMainButtonsComponent = ({
  courseId,
  isFull,
  isAccessible,
  fullWidth,
  showBtnText,
  secondaryButtonText,
  onPressPrimary,
  onPressSecondary,
  addToBasketBtnText,
  inBasketBtnText,
  capacityFullText,
  containerStyle,
  fillCapacityStyle,
  iconLeftAddToBasket,
  iconRightAddToBasket,
  iconLeftInBasket,
  iconRightInBasket,
}: CartMainButtonsProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const s = useCartMainButtonsStyles(theme);

  const navigation = useAppNavigation();
  const { cartCourseIds, addToCart, isPendingCreate, pendingCreateCourseId } =
    useBasketCart();

  const isAddedToCart = React.useMemo(
    () => cartCourseIds.has(courseId),
    [cartCourseIds, courseId],
  );

  const addLoading = isPendingCreate && pendingCreateCourseId === courseId;

  const onGoCart = React.useCallback(() => {
    navigateToAppLeaf(navigation, 'Cart');
  }, [navigation]);

  const onAddToCart = React.useCallback(() => {
    if (!isAddedToCart) {
      addToCart(courseId);
    }
  }, [addToCart, courseId, isAddedToCart]);

  const wrapperStyle = fullWidth === false ? undefined : s.flex;

  if (isAccessible) {
    return (
      <Button
        layout="auto"
        variant="filled"
        title={showBtnText ?? t('courses.viewCourse')}
        onPress={onPressPrimary}
        style={[wrapperStyle, s.pressableBase, s.primaryBg, containerStyle]}
      >
        <LabelWithIcons
          styles={s}
          text={showBtnText ?? t('courses.viewCourse')}
          textStyle={[s.label, s.primaryText]}
          left={null}
          right={null}
        />
      </Button>
    );
  }

  if (isFull) {
    return (
      <View
        style={[wrapperStyle, s.capacityWrap, fillCapacityStyle]}
        accessibilityRole="text"
        accessibilityState={{ disabled: true }}
      >
        <Text style={s.capacityText}>
          {capacityFullText ?? t('cart.capacityFull')}
        </Text>
      </View>
    );
  }

  const secondarySlot = onPressSecondary ? (
    <Button
      layout="auto"
      variant="outlined"
      title={secondaryButtonText ?? t('courses.moreInformation')}
      onPress={onPressSecondary}
      style={s.buttonOutlined}
    >
      <Text style={s.buttonOutlinedText}>
        {secondaryButtonText ?? t('courses.moreInformation')}
      </Text>
    </Button>
  ) : null;

  if (isAddedToCart) {
    return (
      <View style={s.row}>
        {secondarySlot}
        <Button
          layout="auto"
          variant="filled"
          title={inBasketBtnText ?? t('cart.inBasket')}
          onPress={onGoCart}
          style={[wrapperStyle, s.pressableBase, s.successBorder, containerStyle]}
        >
          <LabelWithIcons
            styles={s}
            text={inBasketBtnText ?? t('cart.inBasket')}
            textStyle={[s.label, s.successLabel]}
            left={iconLeftInBasket}
            right={iconRightInBasket}
          />
        </Button>
      </View>
    );
  }

  return (
    <View style={s.row}>
      {secondarySlot}
      <Button
        layout="auto"
        variant="filled"
        title={addToBasketBtnText ?? t('cart.addToBasket')}
        onPress={onAddToCart}
        loading={addLoading}
        style={[wrapperStyle, s.pressableBase, s.successBg, containerStyle]}
        contentStyle={s.addToCartSlot}
      >
        <LabelWithIcons
          styles={s}
          text={addToBasketBtnText ?? t('cart.addToBasket')}
          textStyle={[s.label, s.successLabel]}
          left={iconLeftAddToBasket}
          right={iconRightAddToBasket}
        />
      </Button>
    </View>
  );
};

export const CartMainButtons = React.memo(CartMainButtonsComponent);
CartMainButtons.displayName = 'CartMainButtons';
