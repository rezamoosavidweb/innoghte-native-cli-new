import * as React from 'react';
import type { SharedValue } from 'react-native-reanimated';
import {
  Easing,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import type { HeartRateConnectionStatus } from '@/domains/breathwork/model/types';
import {
  createMockHeartRateSource,
  createNativeHeartRateSource,
} from '@/domains/breathwork/services/heartRateSource';

const FAST_ALPHA = 0.34;
const SLOW_ALPHA = 0.065;

export type UseHeartRateResult = {
  displayBpm: number | null;
  connectionStatus: HeartRateConnectionStatus;
  isLiveDevice: boolean;
  beatPhase: SharedValue<number>;
  beatImpulse: SharedValue<number>;
  physioDrive: SharedValue<number>;
};

export function useHeartRate(): UseHeartRateResult {
  const native = React.useMemo(() => createNativeHeartRateSource(), []);
  const mock = React.useMemo(() => createMockHeartRateSource({ baselineBpm: 68 }), []);

  const source = native ?? mock;
  const beatPhase = useSharedValue(0);
  const beatImpulse = useSharedValue(0);
  const physioDrive = useSharedValue(0.42);

  const [displayBpm, setDisplayBpm] = React.useState<number | null>(
    native ? null : Math.round(68),
  );
  const [connectionStatus, setConnectionStatus] =
    React.useState<HeartRateConnectionStatus>(
      native ? 'connecting' : 'connected',
    );

  const fastRef = React.useRef(68);
  const slowRef = React.useRef(68);

  React.useEffect(() => {
    if (!native) {
      setConnectionStatus('connected');
    } else {
      setConnectionStatus(source.status);
    }

    const unsub = source.subscribe(sample => {
      if (native) {
        const f = FAST_ALPHA * sample.bpm + (1 - FAST_ALPHA) * fastRef.current;
        const s = SLOW_ALPHA * sample.bpm + (1 - SLOW_ALPHA) * slowRef.current;
        fastRef.current = f;
        slowRef.current = s;
        const lead = (f - s) * 0.32;
        const latency = (sample.bpm - s) * 0.08;
        const fused = s + lead + latency;
        const rounded = Math.round(
          Math.min(200, Math.max(45, fused)),
        );
        setDisplayBpm(rounded);
        const norm = (rounded - 52) / 54;
        physioDrive.value = Math.min(1, Math.max(0, norm));
        setConnectionStatus('connected');
      } else {
        setDisplayBpm(sample.bpm);
        const norm = (sample.bpm - 52) / 54;
        physioDrive.value = Math.min(1, Math.max(0, norm));
      }
    });

    return unsub;
  }, [native, physioDrive, source]);

  React.useEffect(() => {
    if (displayBpm == null || displayBpm < 40) {
      beatPhase.value = 0;
      return;
    }
    const period = Math.min(Math.max(60000 / displayBpm, 380), 2100);
    beatPhase.value = 0;
    beatPhase.value = withRepeat(
      withTiming(1, { duration: period, easing: Easing.linear }),
      -1,
      false,
    );
  }, [beatPhase, displayBpm]);

  return {
    displayBpm,
    connectionStatus,
    isLiveDevice: Boolean(native),
    beatPhase,
    beatImpulse,
    physioDrive,
  };
}
