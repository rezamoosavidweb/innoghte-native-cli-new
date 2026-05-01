import * as React from 'react';
import {
  Easing,
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import type { BreathingPhase } from '@/domains/breathwork/model/types';

import { triggerBreathPhaseHaptic } from '@/domains/breathwork/utils/haptics';

export type UseBreathingAnimationArgs = {
  inhaleMs: number;
  holdAfterInhaleMs: number;
  exhaleMs: number;
  holdAfterExhaleMs: number;
};

function evalBreathScale(
  t: number,
  inhaleEnd: number,
  holdEnd: number,
  exhaleEnd: number,
): number {
  'worklet';
  const minS = 1;
  const maxS = 1.26;
  const organic = (u: number) => {
    const x = interpolate(u, [0, 1], [0, 1], Extrapolation.CLAMP);
    return Easing.bezierFn(0.36, 0, 0.18, 1)(x);
  };
  if (t < inhaleEnd) {
    const u = inhaleEnd > 0 ? t / inhaleEnd : 1;
    return interpolate(organic(u), [0, 1], [minS, maxS]);
  }
  if (t < holdEnd) return maxS;
  if (t < exhaleEnd) {
    const span = exhaleEnd - holdEnd;
    const u = span > 0 ? (t - holdEnd) / span : 1;
    return interpolate(organic(u), [0, 1], [maxS, minS]);
  }
  return minS;
}

function evalGlow(
  t: number,
  inhaleEnd: number,
  holdEnd: number,
  exhaleEnd: number,
): number {
  'worklet';
  if (t < inhaleEnd) {
    const u = inhaleEnd > 0 ? t / inhaleEnd : 1;
    return interpolate(u, [0, 1], [0.32, 1]);
  }
  if (t < holdEnd) return 1;
  if (t < exhaleEnd) {
    const span = exhaleEnd - holdEnd;
    const u = span > 0 ? (t - holdEnd) / span : 1;
    return interpolate(u, [0, 1], [1, 0.28]);
  }
  return 0.28;
}

/**
 * Master clock + ideal breath + glow targets (no smoothing — physics lives in `useLivingOrganMotion`).
 */
export function useBreathingAnimation(args: UseBreathingAnimationArgs) {
  const { inhaleMs, holdAfterInhaleMs, exhaleMs, holdAfterExhaleMs } = args;

  const fractions = React.useMemo(() => {
    const total = inhaleMs + holdAfterInhaleMs + exhaleMs + holdAfterExhaleMs;
    const inhaleEnd = inhaleMs / total;
    const holdEnd = inhaleEnd + holdAfterInhaleMs / total;
    const exhaleEnd = holdEnd + exhaleMs / total;
    return { total, inhaleEnd, holdEnd, exhaleEnd };
  }, [inhaleMs, holdAfterInhaleMs, exhaleMs, holdAfterExhaleMs]);

  const cycleT = useSharedValue(0);
  const breathTarget = useSharedValue(1);
  const glowTarget = useSharedValue(0.5);
  const [phase, setPhase] = React.useState<BreathingPhase>('inhale');

  const setPhaseStable = React.useCallback((next: BreathingPhase) => {
    setPhase(next);
  }, []);

  React.useEffect(() => {
    cycleT.value = withRepeat(
      withTiming(1, {
        duration: fractions.total,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
  }, [cycleT, fractions.total]);

  const { inhaleEnd, holdEnd, exhaleEnd } = fractions;

  const inhaleEndSv = useSharedValue(inhaleEnd);
  const holdEndSv = useSharedValue(holdEnd);
  const exhaleEndSv = useSharedValue(exhaleEnd);

  React.useEffect(() => {
    inhaleEndSv.value = inhaleEnd;
    holdEndSv.value = holdEnd;
    exhaleEndSv.value = exhaleEnd;
  }, [exhaleEnd, holdEnd, inhaleEnd, inhaleEndSv, holdEndSv, exhaleEndSv]);

  useAnimatedReaction(
    () => cycleT.value,
    t => {
      'worklet';
      const ie = inhaleEndSv.value;
      const he = holdEndSv.value;
      const ee = exhaleEndSv.value;
      breathTarget.value = evalBreathScale(t, ie, he, ee);
      glowTarget.value = evalGlow(t, ie, he, ee);
    },
  );

  const onPhaseEdge = React.useCallback((idx: number) => {
    const map: BreathingPhase[] = ['inhale', 'hold', 'exhale', 'holdOut'];
    const next = map[idx];
    if (next != null) {
      setPhaseStable(next);
      triggerBreathPhaseHaptic(next);
    }
  }, [setPhaseStable]);

  useAnimatedReaction(
    () => cycleT.value,
    (t, prev) => {
      'worklet';
      if (prev === null) return;
      const ie = inhaleEndSv.value;
      const he = holdEndSv.value;
      const ee = exhaleEndSv.value;
      const idx = (x: number) => {
        if (x < ie) return 0;
        if (x < he) return 1;
        if (x < ee) return 2;
        return 3;
      };
      const next = idx(t);
      const was = idx(prev);
      if (next !== was) {
        runOnJS(onPhaseEdge)(next);
      }
    },
    [onPhaseEdge],
  );

  return {
    cycleT,
    breathTarget,
    glowTarget,
    phase,
  };
}
