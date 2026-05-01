import * as React from 'react';
import { FlatList, type ListRenderItem, StyleSheet, View } from 'react-native';

import {
  CartItem,
  type CartItemProps,
} from '@/domains/basket/components/CartItem';
import type { CartDto } from '@/domains/basket/model/schemas';
import { spacing } from '@/ui/theme';

type Props = {
  cartList: readonly CartDto[];
  giftsCourseIds: readonly number[];
  onRemove: CartItemProps['onRemove'];
  onViewCourse: CartItemProps['onViewCourse'];
};

export const CartList = React.memo(function CartList({
  cartList,
  giftsCourseIds,
  onRemove,
  onViewCourse,
}: Props) {
  const renderItem = React.useCallback<ListRenderItem<CartDto>>(
    ({ item }) => (
      <CartItem
        item={item}
        giftsCourseIds={giftsCourseIds}
        onRemove={onRemove}
        onViewCourse={onViewCourse}
      />
    ),
    [giftsCourseIds, onRemove, onViewCourse],
  );

  const keyExtractor = React.useCallback(
    (item: CartDto) => String(item.id),
    [],
  );

  return (
    <View style={styles.wrap}>
      <FlatList
        data={cartList}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        scrollEnabled={false}
        removeClippedSubviews
        windowSize={7}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { marginVertical: spacing.sm },
});
