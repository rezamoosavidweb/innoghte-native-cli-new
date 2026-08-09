import {HeaderButton} from '@react-navigation/elements';
import * as React from 'react';
import {View} from 'react-native';

import BasketIcon from '@/assets/icons/shopping-trolly.svg';
import {protectedNavigate} from '@/app/bridge/auth/protectedNavigation';
import {useBasketCart} from '@/domains/basket/hooks/useBasketCart';
import {formatNumberForApp} from '@/shared/infra/i18n/formatLocaleNumbers';
import {useAppNavigation} from '@/shared/lib/navigation/useAppNavigation';
import {Text} from '@/shared/ui/Text';
import {basketHeaderButtonStyles as s} from './basketHeaderButton.styles';

type Props = {tintColor?: string};

/** Shared purchase-screen header action with the exact live cart line count. */
export const BasketHeaderButton = React.memo(function BasketHeaderButton({
  tintColor,
}: Props) {
  const navigation = useAppNavigation();
  const {cartList} = useBasketCart();
  const count = cartList.length;

  const handlePress = React.useCallback(() => {
    protectedNavigate(navigation, 'Cart');
  }, [navigation]);

  return (
    <HeaderButton
      accessibilityLabel={`سبد خرید، ${formatNumberForApp(count)} کالا`}
      onPress={handlePress}
    >
      <View style={s.container}>
        <BasketIcon width={25} height={25} color={tintColor} />
        {count > 0 ? (
          <View style={s.badge}>
            <Text style={s.badgeText} numberOfLines={1}>
              {formatNumberForApp(count)}
            </Text>
          </View>
        ) : null}
      </View>
    </HeaderButton>
  );
});
BasketHeaderButton.displayName = 'BasketHeaderButton';
