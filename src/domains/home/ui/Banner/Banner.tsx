import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import {
  I18nManager,
  View,
  useWindowDimensions,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

import {
  BANNER_DEFAULT_HEIGHT,
  useBannerStyles,
  type BannerVariant,
} from '@/domains/home/ui/Banner/banner.styles';
import {
  BannerItem,
  type BannerItemData,
} from '@/domains/home/ui/Banner/BannerItem';

const DEFAULT_AUTOPLAY_INTERVAL = 4500;
const SCROLL_ANIMATION_MS = 600;

export type BannerProps = {
  /** Full-bleed first-screen hero vs compact inset "card" slides. */
  variant?: BannerVariant;
  /** Banner cards to render. Single-item mode auto-disables swipe & autoplay. */
  items: ReadonlyArray<BannerItemData>;
  /** Auto-rotate slides. Ignored when only one item is provided. */
  autoplay?: boolean;
  /** Auto rotate interval (ms). */
  autoplayInterval?: number;
  /** Loop the carousel infinitely. Ignored for single items. */
  loop?: boolean;
  /**
   * Viewport height. Defaults to window height (`hero`) or {@link BANNER_DEFAULT_HEIGHT} (`card`).
   */
  height?: number;
  /** Show pagination dots when more than one item is present. */
  pagination?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

function BannerComponent({
  variant = 'card',
  items,
  autoplay = false,
  autoplayInterval = DEFAULT_AUTOPLAY_INTERVAL,
  loop = true,
  height: heightProp,
  pagination = true,
  style,
  testID,
}: BannerProps) {
  const { colors } = useTheme();
  const styles = useBannerStyles(colors, variant);
  const { width: screenWidth, height: windowHeight } = useWindowDimensions();

  const resolvedHeight =
    heightProp ??
    (variant === 'hero' ? windowHeight : BANNER_DEFAULT_HEIGHT);

  const itemCount = items.length;
  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => {
    if (activeIndex >= itemCount) setActiveIndex(0);
  }, [activeIndex, itemCount]);

  const handleSnapToItem = React.useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const renderItem = React.useCallback(
    ({ item }: { item: BannerItemData }) => (
      <BannerItem item={item} styles={styles} />
    ),
    [styles],
  );

  const heightStyle = React.useMemo<ViewStyle>(
    () => ({ height: resolvedHeight }),
    [resolvedHeight],
  );

  if (itemCount === 0) return null;

  if (itemCount === 1) {
    return (
      <View style={[styles.container, style]} testID={testID}>
        <View style={[styles.viewportFill, heightStyle]}>
          <BannerItem item={items[0]} styles={styles} />
        </View>
      </View>
    );
  }

  const canLoop = loop && itemCount > 1;
  const canAutoPlay = autoplay && itemCount > 1;

  const dots = pagination ? (
    <View
      style={variant === 'hero' ? styles.dotsOverlay : styles.dots}
      pointerEvents={variant === 'hero' ? 'box-none' : undefined}
    >
      {items.map((it, i) => (
        <View
          key={it.id}
          style={[styles.dot, i === activeIndex ? styles.dotActive : null]}
        />
      ))}
    </View>
  ) : null;

  if (variant === 'hero') {
    return (
      <View style={[styles.container, heightStyle, style]} testID={testID}>
        <View style={[styles.carouselHeroShell, heightStyle]}>
          <Carousel
            data={items as BannerItemData[]}
            width={screenWidth}
            height={resolvedHeight}
            loop={canLoop}
            autoPlay={canAutoPlay}
            autoPlayInterval={autoplayInterval}
            autoPlayReverse={I18nManager.isRTL}
            scrollAnimationDuration={SCROLL_ANIMATION_MS}
            pagingEnabled
            snapEnabled
            windowSize={3}
            onSnapToItem={handleSnapToItem}
            renderItem={renderItem}
          />
          {dots}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]} testID={testID}>
      <Carousel
        data={items as BannerItemData[]}
        width={screenWidth}
        height={resolvedHeight}
        loop={canLoop}
        autoPlay={canAutoPlay}
        autoPlayInterval={autoplayInterval}
        autoPlayReverse={I18nManager.isRTL}
        scrollAnimationDuration={SCROLL_ANIMATION_MS}
        pagingEnabled
        snapEnabled
        windowSize={3}
        onSnapToItem={handleSnapToItem}
        renderItem={renderItem}
      />
      {dots}
    </View>
  );
}

export const Banner = React.memo(BannerComponent);
Banner.displayName = 'Banner';
