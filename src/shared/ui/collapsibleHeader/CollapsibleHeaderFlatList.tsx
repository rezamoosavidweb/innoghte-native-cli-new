import * as React from 'react';
import Animated from 'react-native-reanimated';

const SCROLL_THROTTLE = 16;

export type CollapsibleHeaderFlatListProps<ItemT> = React.ComponentProps<
  typeof Animated.FlatList<ItemT>
>;

/**
 * `Animated.FlatList` preconfigured for collapsible header scroll tracking.
 * Pass `onScroll` from {@link useCollapsibleHeader}.
 */
function CollapsibleHeaderFlatListInner<ItemT = unknown>(
  { scrollEventThrottle = SCROLL_THROTTLE, ...rest }: CollapsibleHeaderFlatListProps<ItemT>,
  ref: React.ForwardedRef<Animated.FlatList<ItemT>>,
) {
  return (
    <Animated.FlatList<ItemT>
      ref={ref}
      scrollEventThrottle={scrollEventThrottle}
      {...rest}
    />
  );
}

export const CollapsibleHeaderFlatList = React.memo(
  React.forwardRef(CollapsibleHeaderFlatListInner),
) as <ItemT>(
  props: CollapsibleHeaderFlatListProps<ItemT> & {
    ref?: React.ForwardedRef<Animated.FlatList<ItemT>>;
  },
) => React.ReactElement | null;
