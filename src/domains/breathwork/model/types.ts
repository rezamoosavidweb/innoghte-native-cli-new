/** Guided breathing phases (box / 4-7-8 style timing is configured via durations). */
export type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'holdOut';

/** Device integration surface — extend when wiring HealthKit / Health Connect. */
export type HeartRateConnectionStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'error';

export type BreathCycleConfig = {
  inhaleMs: number;
  holdAfterInhaleMs: number;
  exhaleMs: number;
  holdAfterExhaleMs: number;
};

export const DEFAULT_BREATH_CYCLE: BreathCycleConfig = {
  inhaleMs: 4000,
  holdAfterInhaleMs: 2000,
  exhaleMs: 5000,
  holdAfterExhaleMs: 500,
};

export type HeartRateSample = {
  bpm: number;
  timestampMs: number;
};
