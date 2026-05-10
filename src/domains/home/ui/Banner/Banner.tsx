import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import {
  StyleSheet,
  View,
  useWindowDimensions,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
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
  /** Full-bleed first-screen hero vs compact inset "card". */
  variant?: BannerVariant;
  /** Single hero slide (layered image + copy). */
  item: BannerItemData;
  /**
   * Viewport height. Defaults to window height (`hero`) or {@link BANNER_DEFAULT_HEIGHT} (`card`).
   */
  height?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

function BannerComponent({
  variant = 'card',
  item,
  height: heightProp,
  style,
  testID,
}: BannerProps) {
  const { colors } = useTheme();
  const styles = useBannerStyles(colors, variant);
  const { width: screenWidth, height: windowHeight } = useWindowDimensions();

  const resolvedHeight =
    heightProp ?? (variant === 'hero' ? windowHeight : BANNER_DEFAULT_HEIGHT);

  const viewportHeight = createBannerViewportHeight(resolvedHeight);

  return (
    <View style={[styles.container, style]} testID={testID}>
      <View style={[styles.viewportFill, viewportHeight.viewport]}>
        <BannerItem item={item} styles={styles} />
        {variant === 'hero' ? (
          <HeroTopScrim width={screenWidth} bannerHeight={resolvedHeight} />
        ) : null}
      </View>
    </View>
  );
}

export const Banner = React.memo(BannerComponent);
Banner.displayName = 'Banner';
