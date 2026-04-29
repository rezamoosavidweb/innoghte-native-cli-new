import * as React from 'react';
import { Platform } from 'react-native';

/**
 * Lightweight tier for FlashList virtualization tuning — no native modules or extra deps.
 * Android ≤ API 29 (~pre-Android 11) biases toward budget devices without claiming CPU/RAM probing.
 *
 * Tune thresholds conservatively so high-end tiers keep current UX.
 */
export type ListPerformanceTier = 'low' | 'normal';

export type ListPerformanceFlashListTune = Readonly<{
  tier: ListPerformanceTier;
  /** Multiply into base `estimatedItemSize` (slightly under-estimate often helps FlashList on slow chips). */
  estimatedItemSizeFactor: number;
  onEndReachedThreshold: number;
  scrollEventThrottle: number;
  /** Mirrors `ScrollView` — snappier deceleration on constrained devices. */
  decelerationRate: 'normal' | 'fast';
}>;

function resolveListPerformanceProfile(): ListPerformanceFlashListTune {
  if (
    Platform.OS === 'android' &&
    typeof Platform.Version === 'number' &&
    Platform.Version <= 29
  ) {
    return {
      tier: 'low',
      estimatedItemSizeFactor: 0.92,
      onEndReachedThreshold: 0.35,
      scrollEventThrottle: 48,
      decelerationRate: 'fast',
    };
  }
  return {
    tier: 'normal',
    estimatedItemSizeFactor: 1,
    onEndReachedThreshold: 0.5,
    scrollEventThrottle: 16,
    decelerationRate: 'normal',
  };
}

/** Stable per mount — device class does not change during a session. */
export function useListPerformanceProfile(): ListPerformanceFlashListTune {
  return React.useMemo(() => resolveListPerformanceProfile(), []);
}
