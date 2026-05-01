import { useAppNavigation } from '@/shared/lib/navigation/useAppNavigation';
import * as React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/shared/ui/Text';

import { CollapsibleHeader } from '@/shared/ui/collapsibleHeader/CollapsibleHeader';
import { CollapsibleHeaderScrollView } from '@/shared/ui/collapsibleHeader/CollapsibleHeaderScrollView';
import { useCollapsibleHeader } from '@/shared/ui/collapsibleHeader/useCollapsibleHeader';

const ROWS = Array.from({ length: 48 }, (_, i) => `Row ${i + 1}`);

/**
 * Opt-in collapsible header demo (ScrollView). For FlatList, swap the scrollable to
 * `CollapsibleHeaderFlatList`, pass the same `onScroll` and set
 * `contentContainerStyle={{ paddingTop: ch.contentPaddingTop }}` (and wire `data` / `renderItem`).
 *
 * Add to a stack and disable the stack header for this route, or use `setOptions` below.
 */
export const CollapsibleHeaderExampleScreen = () => {
  const navigation = useAppNavigation();
  const ch = useCollapsibleHeader({
    backgroundColor: '#1B2838',
    threshold: 80,
    barHeight: 52,
  });

  const scrollContentStyle = React.useMemo(
    () => [
      styles.scrollContentBase,
      { paddingTop: ch.contentPaddingTop },
    ],
    [ch.contentPaddingTop],
  );

  const onActionPress = React.useCallback(() => {}, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false, title: '' });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom', 'left', 'right']}>
      <CollapsibleHeader
        scrollY={ch.scrollY}
        backgroundColor={ch.backgroundColor}
        expandedBackgroundColor={ch.expandedBackgroundColor}
        threshold={ch.threshold}
        height={ch.barHeight}
        title="Transparent header"
        adaptiveTitleColor
      >
        <Pressable
          accessibilityRole="button"
          onPress={onActionPress}
          style={styles.chip}
        >
          <Text style={styles.chipLabel}>Action</Text>
        </Pressable>
      </CollapsibleHeader>
      <CollapsibleHeaderScrollView
        onScroll={ch.onScroll}
        contentContainerStyle={scrollContentStyle}
      >
        {ROWS.map((line) => (
          <View key={line} style={styles.row}>
            <Text style={styles.rowLabel}>{line}</Text>
          </View>
        ))}
      </CollapsibleHeaderScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0F3460',
  },
  scrollContentBase: {
    paddingBottom: 24,
  },
  row: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.12)',
  },
  rowLabel: {
    color: '#E8E8E8',
    fontSize: 16,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  chipLabel: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
});
