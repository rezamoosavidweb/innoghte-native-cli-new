import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {
  BREATHING_VISUAL,
  type BreathingPhase,
} from '@/domains/breathing/constants/breathingConstants';
import { fontSize, fontWeight, spacing } from '@/ui/theme';

const EASE = Easing.inOut(Easing.quad);

export type BreathingCircleProps = {
  phase: BreathingPhase;
  isRunning: boolean;
  /** Must match JS phase timer duration so motion ends as the phase advances. */
  phaseDurationMs: number;
  /** Increments on start/resume to re-trigger timing when phase label is unchanged. */
  animationEpoch: number;
  /** Seconds remaining in the current phase (shown inside the orb). */
  countdownValue: number;
  primaryColor: string;
  onPrimaryColor: string;
  surfaceColor: string;
};

/**
 * Motion uses Reanimated only (`withTiming` + scale). Duration props mirror `useBreathing`
 * phase timeouts so the orb finishes expanding/contracting exactly when the phase flips.
 * A static outer ring uses semantic border fill for a subtle halo without fading the countdown.
 */
export const BreathingCircle = React.memo(function BreathingCircle({
  phase,
  isRunning,
  phaseDurationMs,
  animationEpoch,
  countdownValue,
  primaryColor,
  onPrimaryColor,
  surfaceColor,
}: BreathingCircleProps) {
  const scale = useSharedValue<number>(BREATHING_VISUAL.scaleMin);

  React.useEffect(() => {
    if (!isRunning) {
      cancelAnimation(scale);
      return;
    }

    if (phase === 'inhale') {
      scale.value = BREATHING_VISUAL.scaleMin;
      scale.value = withTiming(BREATHING_VISUAL.scaleMax, {
        duration: phaseDurationMs,
        easing: EASE,
      });
      return;
    }

    if (phase === 'hold') {
      cancelAnimation(scale);
      scale.value = BREATHING_VISUAL.scaleMax;
      return;
    }

    scale.value = withTiming(BREATHING_VISUAL.scaleMin, {
      duration: phaseDurationMs,
      easing: EASE,
    });
  }, [phase, isRunning, phaseDurationMs, animationEpoch, scale]);

  const orbStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const size = 240;

  return (
    <View style={styles.wrap} accessibilityRole="none">
      <Animated.View
        style={[
          styles.orbOuter,
          {
            width: size + spacing.xl,
            height: size + spacing.xl,
            borderColor: primaryColor,
            backgroundColor: surfaceColor,
          },
          orbStyle,
        ]}
      >
        <View
          style={[
            styles.orbInner,
            {
              width: size,
              height: size,
              backgroundColor: primaryColor,
            },
          ]}
        >
          <Text style={[styles.countdown, { color: onPrimaryColor }]}>
            {countdownValue}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
});

BreathingCircle.displayName = 'BreathingCircle';

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: spacing.md,
  },
  orbOuter: {
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth * 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbInner: {
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdown: {
    fontSize: fontSize['4xl'],
    fontVariant: ['tabular-nums'],
    fontWeight: fontWeight.bold,
  },
});
