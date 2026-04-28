import { useTheme } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import * as React from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { homeKeys } from '@/domains/home/model/queryKeys';
import { useHomeScreenStyles } from '@/domains/home/ui/homeScreen.styles';
import { QuickAccess } from '@/domains/home/ui/QuickAccess';
import { ErrorBoundary } from '@/ui/components/ErrorBoundary';

const HomeScreenComponent = () => {
  const { colors } = useTheme();
  const styles = useHomeScreenStyles(colors);
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: homeKeys.all });
    } finally {
      setRefreshing(false);
    }
  }, [queryClient]);

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <ErrorBoundary>
        <ScrollView
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
          <QuickAccess />
          {/* Future home sections plug in here. */}
        </ScrollView>
      </ErrorBoundary>
    </SafeAreaView>
  );
};

export const HomeScreen = React.memo(HomeScreenComponent);
HomeScreen.displayName = 'HomeScreen';
