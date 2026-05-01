import { DrawerActions, useTheme } from '@react-navigation/native';
import { HeaderButton } from '@react-navigation/elements';
import { useQueryClient } from '@tanstack/react-query';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Platform,
  RefreshControl,
  StyleSheet,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';

import { homeKeys } from '@/domains/home/model/queryKeys';
import { HOME_BANNER_MOCK } from '@/domains/home/model/banner.mock';
import { Banner, type BannerItemData } from '@/domains/home/ui/Banner';
import { Comments } from '@/domains/home/ui/Comments';
import { useHomeScreenStyles } from '@/domains/home/ui/homeScreen.styles';
import { QuickAccess } from '@/domains/home/ui/QuickAccess';
import { ErrorBoundary } from '@/ui/components/ErrorBoundary';
import { useThemeColors } from '@/ui/theme';
import {
  CollapsibleHeader,
  CollapsibleHeaderScrollView,
  useCollapsibleHeader,
} from '@/shared/ui/collapsibleHeader';
import { useAppNavigation } from '@/shared/lib/navigation/useAppNavigation';

/**
 * Icon color at scroll=0 (transparent header, over hero banner).
 * White stays readable over any banner image in both light and dark themes.
 */
const ICON_EXPANDED_COLOR = '#FFFFFF';

const menuIconBase = StyleSheet.create({
  icon: { fontSize: 22, fontWeight: '600', paddingHorizontal: 4 },
}).icon;

type AnimatedDrawerIconProps = {
  scrollY: SharedValue<number>;
  threshold: number;
  collapsedColor: string;
  contrastShadow?: boolean;
};

/**
 * Drawer toggle icon that interpolates from white → `collapsedColor` as the
 * header transitions from transparent to solid. Runs entirely on the UI thread.
 */
const AnimatedDrawerIcon = React.memo(function AnimatedDrawerIcon({
  scrollY,
  threshold,
  collapsedColor,
  contrastShadow = false,
}: AnimatedDrawerIconProps) {
  const navigation = useAppNavigation();

  const colorStyle = useAnimatedStyle(() => {
    const p = interpolate(
      scrollY.value,
      [0, threshold],
      [0, 1],
      Extrapolation.CLAMP,
    );
    const style: Record<string, unknown> = {
      color: interpolateColor(p, [0, 1], [ICON_EXPANDED_COLOR, collapsedColor]),
    };
    if (contrastShadow) {
      style.textShadowColor = interpolateColor(
        p,
        [0, 1],
        ['rgba(0,0,0,0.52)', 'rgba(0,0,0,0)'],
      );
      style.textShadowOffset = { width: 0, height: 1 };
      style.textShadowRadius = interpolate(p, [0, 1], [6, 0], Extrapolation.CLAMP);
    }
    return style;
  }, [scrollY, threshold, collapsedColor, contrastShadow]);

  return (
    <HeaderButton
      accessibilityLabel="Open navigation menu"
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
    >
      <Animated.Text style={[menuIconBase, colorStyle]}>☰</Animated.Text>
    </HeaderButton>
  );
});
AnimatedDrawerIcon.displayName = 'AnimatedDrawerIcon';

const HomeScreenComponent = () => {
  const { colors } = useTheme();
  const { headerBg, headerForeground } = useThemeColors();
  const styles = useHomeScreenStyles(colors);
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = React.useState(false);

  const scrollRef = React.useRef<Animated.ScrollView>(null);
  const quickAccessOffsetRef = React.useRef(0);

  const {
    scrollY,
    onScroll,
    threshold,
    backgroundColor,
    expandedBackgroundColor,
    barHeight,
    contentPaddingTop,
  } = useCollapsibleHeader({
    backgroundColor: headerBg,
    threshold: 'headerHeight',
  });

  // Only re-creates when the theme's header foreground token changes.
  const leading = React.useMemo(
    () => (
      <AnimatedDrawerIcon
        scrollY={scrollY}
        threshold={threshold}
        collapsedColor={headerForeground}
        contrastShadow
      />
    ),
    [scrollY, threshold, headerForeground],
  );

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: homeKeys.all });
    } finally {
      setRefreshing(false);
    }
  }, [queryClient]);

  const handleQuickAccessLayout = React.useCallback(
    (event: LayoutChangeEvent) => {
      quickAccessOffsetRef.current = event.nativeEvent.layout.y;
    },
    [],
  );

  const handleBannerCta = React.useCallback(() => {
    // Animated.ScrollView exposes scrollTo via the underlying native handle.
    (scrollRef.current as unknown as { scrollTo(opts: { y: number; animated: boolean }): void })
      ?.scrollTo({ y: Math.max(0, quickAccessOffsetRef.current - 8), animated: true });
  }, []);

  const bannerItems = React.useMemo<ReadonlyArray<BannerItemData>>(
    () =>
      HOME_BANNER_MOCK.map(item => ({
        ...item,
        cta: t('screens.home.banner.cta'),
        onPress: handleBannerCta,
      })),
    [handleBannerCta, t],
  );

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <ErrorBoundary>
        {/*
          No paddingTop on the scroll content — the hero banner fills from y=0
          so the transparent header overlays it. `contentPaddingTop` matches the
          collapsible header stack (`safe area top` + `barHeight`) and is used for
          pull-to-refresh offset (Android `progressViewOffset`).
        */}
        <CollapsibleHeaderScrollView
          ref={scrollRef}
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
              progressViewOffset={
                Platform.OS === 'android' ? contentPaddingTop : undefined
              }
            />
          }
        >
          <Banner variant="hero" items={bannerItems} autoplay loop />
          <View onLayout={handleQuickAccessLayout}>
            <QuickAccess />
          </View>
          <Comments />
        </CollapsibleHeaderScrollView>

        <CollapsibleHeader
          scrollY={scrollY}
          threshold={threshold}
          backgroundColor={backgroundColor}
          expandedBackgroundColor={expandedBackgroundColor}
          height={barHeight}
          leading={leading}
          title={t('tabs.home')}
          adaptiveTitleColor
          contrastShadowWhileExpanded
        />
      </ErrorBoundary>
    </SafeAreaView>
  );
};

export const HomeScreen = React.memo(HomeScreenComponent);
HomeScreen.displayName = 'HomeScreen';
