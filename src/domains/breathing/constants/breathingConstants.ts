/**
 * Single source for timed breathing pattern (inhale → hold → exhale).
 * Durations drive both JS phase scheduling and Reanimated `withTiming` lengths.
 */
export type BreathingPhase = 'inhale' | 'hold' | 'exhale';

export const BREATHING_PHASE_ORDER: readonly BreathingPhase[] = [
  'inhale',
  'hold',
  'exhale',
] as const;

/** Phase durations in milliseconds — must stay in sync with animation segments. */
export const BREATHING_DURATIONS_MS: Readonly<
  Record<BreathingPhase, number>
> = Object.freeze({
  inhale: 4000,
  hold: 4000,
  exhale: 6000,
});

/** Total session length (countdown); resets when the session completes. */
export const DEFAULT_SESSION_DURATION_MS = 60_000;

/** Visual scale range for the breathing orb (Reanimated). */
export const BREATHING_VISUAL = Object.freeze({
  scaleMin: 1,
  scaleMax: 1.22,
});
