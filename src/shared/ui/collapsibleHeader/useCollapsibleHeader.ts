import * as React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  useAnimatedScrollHandler,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';

import { transparentVariant } from '@/shared/ui/collapsibleHeader/colorUtils';
import {
  COLLAPSIBLE_HEADER_DEFAULT_BAR_HEIGHT,
  COLLAPSIBLE_HEADER_DEFAULT_THRESHOLD,
  type UseCollapsibleHeaderOptions,
} from '@/shared/ui/collapsibleHeader/types';

export type CollapsibleHeaderScrollConfig = {
  scrollY: SharedValue<number>;
  onScroll: ReturnType<typeof useAnimatedScrollHandler>;
  threshold: number;
  backgroundColor: string;
  expandedBackgroundColor: string;
  barHeight: number;
  /** Apply to scrollable `contentContainerStyle.paddingTop` when the header is overlayed. */
  contentPaddingTop: number;
};

/**
 * Scroll wiring for {@link CollapsibleHeader}. Updates `scrollY` on the UI thread
 * (no React re-renders per frame). Pair with `CollapsibleHeaderScrollView` / `FlatList`
 * or attach `onScroll` to your own `Animated` scrollable from `react-native-reanimated`.
 */
export function useCollapsibleHeader(
  options: UseCollapsibleHeaderOptions,
): CollapsibleHeaderScrollConfig {
  const insets = useSafeAreaInsets();
  const {
    scrollY: externalScrollY,
    backgroundColor,
    threshold: thresholdOption = COLLAPSIBLE_HEADER_DEFAULT_THRESHOLD,
    expandedBackgroundColor: expandedBg,
    barHeight = COLLAPSIBLE_HEADER_DEFAULT_BAR_HEIGHT,
  } = options;

  const internalY = useSharedValue(0);
  const scrollY = externalScrollY ?? internalY;

  const onScroll = useAnimatedScrollHandler(
    {
      onScroll: (e) => {
        scrollY.value = e.contentOffset.y;
      },
    },
    [scrollY],
  );

  const expandedBackgroundColor = React.useMemo(
    () => expandedBg ?? transparentVariant(backgroundColor),
    [expandedBg, backgroundColor],
  );

  const contentPaddingTop = insets.top + barHeight;

  const threshold =
    thresholdOption === 'headerHeight'
      ? contentPaddingTop
      : thresholdOption;

  return {
    scrollY,
    onScroll,
    threshold,
    backgroundColor,
    expandedBackgroundColor,
    barHeight,
    contentPaddingTop,
  };
}
