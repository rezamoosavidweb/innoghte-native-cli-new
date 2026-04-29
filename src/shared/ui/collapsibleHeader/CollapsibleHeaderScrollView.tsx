import * as React from 'react';
import Animated from 'react-native-reanimated';

const SCROLL_THROTTLE = 16;

export type CollapsibleHeaderScrollViewProps = React.ComponentProps<
  typeof Animated.ScrollView
>;

/**
 * `Animated.ScrollView` preconfigured for collapsible header scroll tracking.
 * Pass `onScroll` from {@link useCollapsibleHeader}.
 */
export const CollapsibleHeaderScrollView = React.memo(
  React.forwardRef<Animated.ScrollView, CollapsibleHeaderScrollViewProps>(
    function CollapsibleHeaderScrollView(
      { scrollEventThrottle = SCROLL_THROTTLE, ...rest },
      ref,
    ) {
      return (
        <Animated.ScrollView
          ref={ref}
          scrollEventThrottle={scrollEventThrottle}
          {...rest}
        />
      );
    },
  ),
);

CollapsibleHeaderScrollView.displayName = 'CollapsibleHeaderScrollView';
