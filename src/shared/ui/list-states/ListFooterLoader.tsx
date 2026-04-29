import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { spacing } from '@/ui/theme/core/spacing';

export type ListFooterLoaderProps = {
  /** Typically `isFetchingNextPage` from an infinite query. */
  visible: boolean;
};

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const ListFooterLoaderComponent = ({ visible }: ListFooterLoaderProps) => {
  const { colors } = useTheme();

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.wrap} accessibilityLabel="Loading more">
      <ActivityIndicator color={colors.primary} />
    </View>
  );
};

export const ListFooterLoader = React.memo(ListFooterLoaderComponent);
ListFooterLoader.displayName = 'ListFooterLoader';
