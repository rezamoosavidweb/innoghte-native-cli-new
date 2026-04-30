import * as React from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import {
  navigateToAppLeaf,
  protectedNavigate,
} from '@/app/bridge/auth/protectedNavigation';
import { useBasketCart } from '@/domains/basket/hooks/useBasketCart';
import { useAppNavigation } from '@/shared/lib/navigation/useAppNavigation';
import { pickSemantic, colors as themePalette } from '@/ui/theme';

import { createCartMainButtonsStyles } from './cartMainButtons.styles';

export type CartMainButtonsProps = {
  courseId: number;
  isFull: boolean;
  isAccessible: boolean;
  fullWidth?: boolean;
  showBtnText?: string;
  addToBasketBtnText?: string;
  inBasketBtnText?: string;
  capacityFullText?: string;
  containerStyle?: ViewStyle | ViewStyle[];
  fillCapacityStyle?: ViewStyle | ViewStyle[];
  iconLeftAddToBasket?: React.ReactNode | null;
  iconRightAddToBasket?: React.ReactNode | null;
  iconLeftInBasket?: React.ReactNode | null;
  iconRightInBasket?: React.ReactNode | null;
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
      {left ? <>{left}</> : null}
      <Text style={textStyle} numberOfLines={2}>
        {text}
      </Text>
      {right ? <>{right}</> : null}
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
  const { colors } = theme;
  const themeSemantic = React.useMemo(() => pickSemantic(theme), [theme]);

  const s = React.useMemo(
    () => createCartMainButtonsStyles(colors, themeSemantic),
    [colors, themeSemantic],
  );

  const navigation = useAppNavigation();
  const {
    cartCourseIds,
    addToCart,
    isPendingCreate,
    pendingCreateCourseId,
  } = useBasketCart();

  const isAddedToCart = React.useMemo(
    () => cartCourseIds.has(courseId),
    [cartCourseIds, courseId],
  );

  const addLoading =
    isPendingCreate && pendingCreateCourseId === courseId;

  const onViewOwned = React.useCallback(() => {
    protectedNavigate(navigation, 'MyCourses');
  }, [navigation]);

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
      <Pressable
        accessibilityRole="button"
        onPress={onViewOwned}
        style={({ pressed }) => [
          wrapperStyle,
          s.pressableBase,
          s.primaryBg,
          pressed ? s.pressed : null,
          containerStyle,
        ]}
      >
        <LabelWithIcons
          styles={s}
          text={showBtnText ?? t('cart.showOwned')}
          textStyle={[s.label, s.primaryText]}
          left={null}
          right={null}
        />
      </Pressable>
    );
  }

  if (isFull) {
    return (
      <View
        style={[
          wrapperStyle,
          s.capacityWrap,
          fillCapacityStyle,
        ]}
        accessibilityRole="text"
        accessibilityState={{ disabled: true }}
      >
        <Text style={s.capacityText}>
          {capacityFullText ?? t('cart.capacityFull')}
        </Text>
      </View>
    );
  }

  if (isAddedToCart) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onGoCart}
        style={({ pressed }) => [
          wrapperStyle,
          s.pressableBase,
          s.successBorder,
          pressed ? s.pressed : null,
          containerStyle,
        ]}
      >
        <LabelWithIcons
          styles={s}
          text={inBasketBtnText ?? t('cart.inBasket')}
          textStyle={[s.label, s.successLabel]}
          left={iconLeftInBasket}
          right={iconRightInBasket}
        />
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onAddToCart}
      disabled={addLoading}
      style={({ pressed }) => [
        wrapperStyle,
        s.pressableBase,
        s.successBg,
        pressed && !addLoading ? s.pressed : null,
        containerStyle,
      ]}
    >
      {addLoading ? (
        <ActivityIndicator color={themePalette.white} />
      ) : (
        <LabelWithIcons
          styles={s}
          text={addToBasketBtnText ?? t('cart.addToBasket')}
          textStyle={[s.label, s.successLabel]}
          left={iconLeftAddToBasket}
          right={iconRightAddToBasket}
        />
      )}
    </Pressable>
  );
};

export const CartMainButtons = React.memo(CartMainButtonsComponent);
CartMainButtons.displayName = 'CartMainButtons';
