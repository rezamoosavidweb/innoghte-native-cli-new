import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import {
  Dimensions,
  FlatList,
  I18nManager,
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type ListRenderItem,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { spacing } from '@/ui/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DEFAULT_GAP = spacing.md;

/** Toggle off when the bug is solved. Logs are filterable by `[Swiper]`. */
const DEBUG = true;
const dlog = (...args: unknown[]) => {
  if (DEBUG) {
    console.log('[Swiper]', ...args);
  }
};

export type SwiperRenderItem<T> = (item: T, index: number) => React.ReactNode;

export type SwiperProps<T> = {
  data: ReadonlyArray<T>;
  renderItem: SwiperRenderItem<T>;
  itemWidth: number;
  gap?: number;
  pagination?: boolean;
  keyExtractor?: (item: T, index: number) => string;
  onIndexChange?: (index: number) => void;
  /** Left/right inset; defaults to a "peek" that centers a single card. */
  contentInsetStart?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

function defaultKeyExtractor<T>(item: T, index: number): string {
  const candidate = item as { id?: string | number } | null;
  if (
    candidate &&
    (typeof candidate.id === 'string' || typeof candidate.id === 'number')
  ) {
    return String(candidate.id);
  }
  return String(index);
}

export function Swiper<T>({
  data,
  renderItem,
  itemWidth,
  gap = DEFAULT_GAP,
  pagination = false,
  keyExtractor = defaultKeyExtractor,
  onIndexChange,
  contentInsetStart,
  style,
  testID,
}: SwiperProps<T>) {
  const { colors } = useTheme();
  const listRef = React.useRef<FlatList<T>>(null);
  const indexRef = React.useRef(0);
  const [activeIndex, setActiveIndex] = React.useState(0);

  const itemCount = data.length;
  const snapInterval = itemWidth + gap;
  const sidePadding =
    contentInsetStart ??
    Math.max(spacing.base, (SCREEN_WIDTH - itemWidth) / 2);

  React.useEffect(() => {
    dlog('config', {
      SCREEN_WIDTH,
      isRTL: I18nManager.isRTL,
      itemCount,
      itemWidth,
      gap,
      snapInterval,
      sidePadding,
    });
  }, [gap, itemCount, itemWidth, sidePadding, snapInterval]);

  React.useEffect(() => {
    if (indexRef.current >= itemCount) {
      dlog('itemCount shrunk below indexRef — resetting to 0', {
        prev: indexRef.current,
        itemCount,
      });
      indexRef.current = 0;
      setActiveIndex(0);
      listRef.current?.scrollToOffset({ offset: 0, animated: false });
    }
  }, [itemCount]);

  const onMomentumScrollEnd = React.useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = e.nativeEvent.contentOffset.x;
      const raw = Math.round(offsetX / snapInterval);
      const idx = Math.max(0, Math.min(raw, itemCount - 1));
      const wasIndex = indexRef.current;
      const drift = idx !== wasIndex;
      dlog('onMomentumScrollEnd', {
        offsetX,
        raw,
        idx,
        wasIndex,
        drift,
      });
      if (drift) {
        indexRef.current = idx;
        setActiveIndex(idx);
        onIndexChange?.(idx);
      }
    },
    [itemCount, onIndexChange, snapInterval],
  );

  const cellStyles = React.useMemo(
    () =>
      StyleSheet.create({
        cell: { width: itemWidth, marginRight: gap },
        cellLast: { width: itemWidth, marginRight: 0 },
      }),
    [gap, itemWidth],
  );

  const onCellLayout = React.useCallback(
    (index: number) => (e: LayoutChangeEvent) => {
      const { width: w, height: h, x, y } = e.nativeEvent.layout;
      dlog('cell layout', { index, w, h, x, y });
    },
    [],
  );

  const renderListItem: ListRenderItem<T> = React.useCallback(
    ({ item, index }) => (
      <View
        onLayout={onCellLayout(index)}
        style={
          index === itemCount - 1 ? cellStyles.cellLast : cellStyles.cell
        }
      >
        {renderItem(item, index)}
      </View>
    ),
    [cellStyles, itemCount, onCellLayout, renderItem],
  );

  const getItemLayout = React.useCallback(
    (_: ArrayLike<T> | null | undefined, index: number) => ({
      length: snapInterval,
      offset: snapInterval * index,
      index,
    }),
    [snapInterval],
  );

  const onContentSizeChange = React.useCallback((w: number, h: number) => {
    dlog('contentSize', { width: w, height: h });
  }, []);

  if (itemCount === 0) return null;

  return (
    <View style={style} testID={testID}>
      <FlatList
        ref={listRef}
        data={data as T[]}
        keyExtractor={keyExtractor}
        renderItem={renderListItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={snapInterval}
        snapToAlignment="start"
        decelerationRate="fast"
        getItemLayout={getItemLayout}
        initialNumToRender={3}
        maxToRenderPerBatch={4}
        windowSize={5}
        removeClippedSubviews={false}
        contentContainerStyle={{ paddingHorizontal: sidePadding }}
        onContentSizeChange={onContentSizeChange}
        onMomentumScrollEnd={onMomentumScrollEnd}
      />

      {pagination && itemCount > 1 ? (
        <View style={styles.dots}>
          {data.map((_, i) => {
            const isActive = i === activeIndex;
            return (
              <View
                key={i}
                style={[
                  styles.dot,
                  { backgroundColor: colors.border },
                  isActive
                    ? [styles.dotActive, { backgroundColor: colors.primary }]
                    : null,
                ]}
              />
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  dots: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: spacing.md,
    gap: spacing.xs + 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 22,
  },
});
