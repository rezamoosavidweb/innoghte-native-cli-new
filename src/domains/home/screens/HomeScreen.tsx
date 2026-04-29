import { useTheme } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  RefreshControl,
  ScrollView,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { homeKeys } from '@/domains/home/model/queryKeys';
import { HOME_BANNER_MOCK } from '@/domains/home/model/banner.mock';
import { Banner, type BannerItemData } from '@/domains/home/ui/Banner';
import { Comments } from '@/domains/home/ui/Comments';
import { useHomeScreenStyles } from '@/domains/home/ui/homeScreen.styles';
import { QuickAccess } from '@/domains/home/ui/QuickAccess';
import { ErrorBoundary } from '@/ui/components/ErrorBoundary';

const HomeScreenComponent = () => {
  const { colors } = useTheme();
  const styles = useHomeScreenStyles(colors);
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = React.useState(false);

  const scrollRef = React.useRef<ScrollView>(null);
  const quickAccessOffsetRef = React.useRef(0);

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
    scrollRef.current?.scrollTo({
      y: Math.max(0, quickAccessOffsetRef.current - 8),
      animated: true,
    });
  }, []);

  const bannerItems = React.useMemo<ReadonlyArray<BannerItemData>>(
    () =>
      HOME_BANNER_MOCK.map((item) => ({
        ...item,
        cta: t('screens.home.banner.cta'),
        onPress: handleBannerCta,
      })),
    [handleBannerCta, t],
  );

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <ErrorBoundary>
        <ScrollView
          ref={scrollRef}
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        >
          <Banner variant="hero" items={bannerItems} autoplay loop />
          <View onLayout={handleQuickAccessLayout}>
            <QuickAccess />
          </View>
          <Comments />
          {/* Future home sections plug in here. */}
        </ScrollView>
      </ErrorBoundary>
    </SafeAreaView>
  );
};

export const HomeScreen = React.memo(HomeScreenComponent);
HomeScreen.displayName = 'HomeScreen';
