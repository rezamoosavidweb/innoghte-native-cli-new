import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import {
  I18nManager,
  StyleSheet,
  View,
  useWindowDimensions,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

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

const heroTopScrimStyles = StyleSheet.create({
  shell: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 1,
  },
});

function createHeroTopScrimWrapHeight(height: number) {
  return StyleSheet.create({
    measured: { height },
  });
}

function createBannerViewportHeight(height: number) {
  return StyleSheet.create({
    viewport: { height },
  });
}

/**
 * Static top gradient — darkens the upper hero slightly so overlaid chrome stays readable
 * without per-image analysis. Fades out before mid-banner so imagery stays prominent.
 */
function HeroTopScrim({ width, bannerHeight }: { width: number; bannerHeight: number }) {
  const gradientId = React.useId().replace(/:/g, '');
  const scrimHeight = Math.min(200, Math.max(96, Math.round(bannerHeight * 0.34)));
  const scrimWrap = createHeroTopScrimWrapHeight(scrimHeight);

  return (
    <View
      pointerEvents="none"
      style={[heroTopScrimStyles.shell, scrimWrap.measured]}
    >
      <Svg width={width} height={scrimHeight}>
        <Defs>
          <LinearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#000000" stopOpacity={0.48} />
            <Stop offset="42%" stopColor="#000000" stopOpacity={0.14} />
            <Stop offset="100%" stopColor="#000000" stopOpacity={0} />
          </LinearGradient>
        </Defs>
        <Rect x={0} y={0} width={width} height={scrimHeight} fill={`url(#${gradientId})`} />
      </Svg>
    </View>
  );
}

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

  const viewportHeight = createBannerViewportHeight(resolvedHeight);

  if (itemCount === 0) return null;

  if (itemCount === 1) {
    return (
      <View style={[styles.container, style]} testID={testID}>
        <View style={[styles.viewportFill, viewportHeight.viewport]}>
          <BannerItem item={items[0]} styles={styles} />
          {variant === 'hero' ? (
            <HeroTopScrim width={screenWidth} bannerHeight={resolvedHeight} />
          ) : null}
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
      <View style={[styles.container, viewportHeight.viewport, style]} testID={testID}>
        <View style={[styles.carouselHeroShell, viewportHeight.viewport]}>
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
          <HeroTopScrim width={screenWidth} bannerHeight={resolvedHeight} />
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
