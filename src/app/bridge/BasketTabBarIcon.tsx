import * as React from 'react';

import { TabBarGlyph } from '@/app/navigation/tabBarConfig';
import { useBasketCart } from '@/domains/basket/hooks/useBasketCart';

type TabBarIconArgs = {
  color: string;
  focused: boolean;
  size: number;
};

/** Cart tab only: badge count from `useBasketCart` (other tabs unchanged). */
export const BasketTabBarIcon = React.memo(function BasketTabBarIcon({
  color,
  focused,
  size,
}: TabBarIconArgs) {
  const { cartList } = useBasketCart();
  const badgeCount = cartList.length;

  return (
    <TabBarGlyph
      routeName="Cart"
      focused={focused}
      color={color}
      size={size}
      badgeCount={badgeCount}
    />
  );
});
BasketTabBarIcon.displayName = 'BasketTabBarIcon';

/** Stable `tabBarIcon` callback reference for the bottom tab navigator. */
export function cartTabBarIcon(props: TabBarIconArgs) {
  return <BasketTabBarIcon {...props} />;
}
