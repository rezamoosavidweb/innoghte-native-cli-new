import type {
  HeartRateConnectionStatus,
  HeartRateSample,
} from '@/domains/breathwork/model/types';

export type HeartRateUnsubscribe = () => void;

export type HeartRateSource = {
  readonly status: HeartRateConnectionStatus;
  subscribe(onSample: (s: HeartRateSample) => void): HeartRateUnsubscribe;
};

export function createNativeHeartRateSource(): HeartRateSource | null {
  return null;
}

type MockOpts = {
  baselineBpm?: number;
};

function clampBpm(n: number): number {
  return Math.min(118, Math.max(48, n));
}

/**
 * Irregular sampling + correlated drift — reads “alive” rather than metronomic mock data.
 */
export function createMockHeartRateSource(opts: MockOpts = {}): HeartRateSource {
  const baseline = opts.baselineBpm ?? 68;
  let slow = baseline;
  let fast = baseline;
  let h = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;

  return {
    status: 'connected',
    subscribe(onSample) {
      const tick = () => {
        h += 0.31 + Math.random() * 0.42;
        const walk = (Math.random() - 0.5) * 2.8;
        const sway = Math.sin(h * 0.9) * 3.2 + Math.cos(h * 0.37) * 1.8;
        const tension = Math.random() < 0.12 ? (Math.random() - 0.5) * 6 : 0;
        const raw = clampBpm(baseline + walk + sway + tension);

        const af = 0.34 + Math.random() * 0.12;
        const as = 0.05 + Math.random() * 0.04;
        fast = af * raw + (1 - af) * fast;
        slow = as * raw + (1 - as) * slow;

        const lead = (fast - slow) * (0.28 + Math.random() * 0.2);
        const display = clampBpm(slow + lead + (Math.random() - 0.5) * 0.8);

        onSample({
          bpm: Math.round(display),
          timestampMs: Date.now(),
        });

        const next = 620 + Math.random() * 1400;
        timer = setTimeout(tick, next);
      };

      onSample({ bpm: Math.round(baseline), timestampMs: Date.now() });
      tick();

      return () => {
        if (timer !== undefined) {
          clearTimeout(timer);
          timer = undefined;
        }
      };
    },
  };
}
