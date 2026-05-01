import * as React from 'react';
import type { FrameInfo, SharedValue } from 'react-native-reanimated';
import {
  useAnimatedReaction,
  useFrameCallback,
  useSharedValue,
} from 'react-native-reanimated';

type Args = {
  breathTarget: SharedValue<number>;
  glowTarget: SharedValue<number>;
  cycleT: SharedValue<number>;
  beatPhase: SharedValue<number>;
  beatImpulse: SharedValue<number>;
  physioDrive: SharedValue<number>;
};

/**
 * Per-frame organic inertia: flesh lags bone, asymmetric warp, ripple age, impulse decay — all UI thread.
 */
export function useLivingOrganMotion({
  breathTarget,
  glowTarget,
  cycleT,
  beatPhase,
  beatImpulse,
  physioDrive,
}: Args) {
  const organCore = useSharedValue(1);
  const organMantle = useSharedValue(1);
  const organAura = useSharedValue(1);
  const lagGlow = useSharedValue(0.4);
  const deformX = useSharedValue(1);
  const deformY = useSharedValue(1);
  const rippleAge = useSharedValue(0);
  const ambientDrift = useSharedValue(0);

  useAnimatedReaction(
    () => beatPhase.value,
    (v, pv) => {
      'worklet';
      if (pv !== null && v < pv - 0.35) {
        rippleAge.value = 0;
        beatImpulse.value = Math.min(1, beatImpulse.value + 0.92);
      }
    },
  );

  const onFrame = React.useMemo(
    () => (info: FrameInfo) => {
      'worklet';
      const rawDt = info.timeSincePreviousFrame ?? 16;
      const dt = Math.min(32, Math.max(8, rawDt));
      const tgt = breathTarget.value;
      const v = Math.abs(tgt - organCore.value);
      const chase = 0.11 + v * 0.09 + tgt * 0.02;
      organCore.value += (tgt - organCore.value) * chase;
      organMantle.value += (tgt - organMantle.value) * (chase * 0.62);
      organAura.value += (tgt - organAura.value) * (chase * 0.4);

      const gt = glowTarget.value;
      const phys = physioDrive.value;
      const glowGoal = interpolatePhys(gt, phys);
      lagGlow.value += (glowGoal - lagGlow.value) * 0.085;

      const t = cycleT.value;
      const imp = beatImpulse.value;
      const tim = info.timestamp * 0.001;
      const wA =
        Math.sin(t * Math.PI * 2 * 2.03 + 0.35 + tim * 0.08) * 0.071;
      const wB =
        Math.cos(t * Math.PI * 2 * 1.58 + 1.05 - tim * 0.05) * 0.064;
      const shiver =
        imp * 0.038 * Math.sin(tim * 46 + organCore.value * 12);
      deformX.value = 1 + wA * (0.85 + phys * 0.35) + shiver;
      deformY.value = 1 + wB * (0.85 + phys * 0.35) - shiver * 0.82;

      beatImpulse.value *= 0.876;

      rippleAge.value = Math.min(1, rippleAge.value + dt / 680);

      ambientDrift.value += dt * (0.018 + phys * 0.012 + slowBreath(t) * 0.004);
    },
    [
      ambientDrift,
      beatImpulse,
      breathTarget,
      cycleT,
      deformX,
      deformY,
      glowTarget,
      lagGlow,
      organAura,
      organCore,
      organMantle,
      physioDrive,
      rippleAge,
    ],
  );

  useFrameCallback(onFrame);

  return {
    organCore,
    organMantle,
    organAura,
    lagGlow,
    deformX,
    deformY,
    rippleAge,
    ambientDrift,
  };
}

function interpolatePhys(g: number, p: number): number {
  'worklet';
  const a = g * 0.72 + p * 0.48;
  return Math.min(1, Math.max(0.18, a));
}

function slowBreath(t: number): number {
  'worklet';
  return Math.sin(t * Math.PI * 2 * 0.5);
}
