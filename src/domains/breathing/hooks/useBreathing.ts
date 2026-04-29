import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  BREATHING_DURATIONS_MS,
  BREATHING_PHASE_ORDER,
  DEFAULT_SESSION_DURATION_MS,
  type BreathingPhase,
} from '@/domains/breathing/constants/breathingConstants';
import { lightImpact } from '@/shared/infra/haptics/lightImpact';

export type UseBreathingOptions = {
  /** Total guided session length (ms). Countdown hits zero → loop stops and state resets. */
  sessionDurationMs?: number;
};

export type PausedBreathingSnapshot = {
  phase: BreathingPhase;
  phaseRemainingMs: number;
  sessionRemainingMs: number;
};

/**
 * Orchestrates the inhale → hold → exhale loop via chained `setTimeout` calls whose durations
 * match {@link BREATHING_DURATIONS_MS}. Each timeout fires a phase change + haptic tick and
 * reschedules the next segment until the session deadline elapses (then resets to idle).
 *
 * UI countdown reads refs bumped by a lightweight interval timer (`uiTick`); animation stays on Reanimated in `BreathingCircle`.
 */
export function useBreathing(
  options: UseBreathingOptions | undefined = undefined,
): {
  phase: BreathingPhase;
  isRunning: boolean;
  animationEpoch: number;
  phaseDurationMs: number;
  sessionRemainingSec: number;
  phaseRemainingSec: number;
  toggleRunning: () => void;
  resetIdle: () => void;
  isPaused: boolean;
} {
  const sessionDurationMs = options?.sessionDurationMs ?? DEFAULT_SESSION_DURATION_MS;

  const [phase, setPhase] = useState<BreathingPhase>('inhale');
  const [isRunning, setIsRunning] = useState(false);
  const [animationEpoch, setAnimationEpoch] = useState(0);
  const [phaseDurationMsState, setPhaseDurationMsState] = useState(
    BREATHING_DURATIONS_MS.inhale,
  );
  const [uiTick, setUiTick] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const phaseRef = useRef<BreathingPhase>('inhale');
  const isRunningRef = useRef(false);
  const sessionEndsAtRef = useRef<number | null>(null);
  const phaseEndsAtRef = useRef<number>(Date.now());
  const phaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tickTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pausedSnapshotRef = useRef<PausedBreathingSnapshot | null>(null);
  /** First segment after resume uses remaining ms; cleared after one schedule. */
  const pendingPhaseDurationMsRef = useRef<number | null>(null);

  const clearPhaseTimer = useCallback(() => {
    if (phaseTimerRef.current) {
      clearTimeout(phaseTimerRef.current);
      phaseTimerRef.current = null;
    }
  }, []);

  const clearTickTimer = useCallback(() => {
    if (tickTimerRef.current) {
      clearInterval(tickTimerRef.current);
      tickTimerRef.current = null;
    }
  }, []);

  const stopAll = useCallback(() => {
    clearPhaseTimer();
    clearTickTimer();
    sessionEndsAtRef.current = null;
    pausedSnapshotRef.current = null;
    pendingPhaseDurationMsRef.current = null;
    isRunningRef.current = false;
    setIsRunning(false);
    setIsPaused(false);
  }, [clearPhaseTimer, clearTickTimer]);

  const completeSession = useCallback(() => {
    stopAll();
    phaseRef.current = 'inhale';
    setPhase('inhale');
    setPhaseDurationMsState(BREATHING_DURATIONS_MS.inhale);
    setAnimationEpoch(e => e + 1);
  }, [stopAll]);

  const schedulePhaseChain = useCallback(() => {
    clearPhaseTimer();
    const current = phaseRef.current;
    const duration =
      pendingPhaseDurationMsRef.current ?? BREATHING_DURATIONS_MS[current];
    pendingPhaseDurationMsRef.current = null;

    setPhaseDurationMsState(duration);
    const endsAt = Date.now() + duration;
    phaseEndsAtRef.current = endsAt;

    phaseTimerRef.current = setTimeout(() => {
      if (!isRunningRef.current) {
        return;
      }
      if (
        sessionEndsAtRef.current !== null &&
        Date.now() >= sessionEndsAtRef.current
      ) {
        completeSession();
        return;
      }

      const idx = BREATHING_PHASE_ORDER.indexOf(current);
      const next = BREATHING_PHASE_ORDER[(idx + 1) % BREATHING_PHASE_ORDER.length];
      phaseRef.current = next;
      setPhase(next);
      lightImpact();
      schedulePhaseChain();
    }, duration);
  }, [clearPhaseTimer, completeSession]);

  const startUiTicks = useCallback(() => {
    clearTickTimer();
    tickTimerRef.current = setInterval(() => {
      setUiTick(t => t + 1);
    }, 250);
  }, [clearTickTimer]);

  const startFreshSession = useCallback(() => {
    phaseRef.current = 'inhale';
    setPhase('inhale');
    pendingPhaseDurationMsRef.current = null;
    sessionEndsAtRef.current = Date.now() + sessionDurationMs;
    phaseEndsAtRef.current = Date.now() + BREATHING_DURATIONS_MS.inhale;
    setPhaseDurationMsState(BREATHING_DURATIONS_MS.inhale);
    isRunningRef.current = true;
    setIsRunning(true);
    pausedSnapshotRef.current = null;
    setIsPaused(false);
    setAnimationEpoch(e => e + 1);
    startUiTicks();
    schedulePhaseChain();
  }, [schedulePhaseChain, sessionDurationMs, startUiTicks]);

  const pause = useCallback(() => {
    if (!isRunningRef.current) {
      return;
    }
    const sessionEnd = sessionEndsAtRef.current;
    if (sessionEnd === null) {
      return;
    }
    const phaseRemainingMs = Math.max(0, phaseEndsAtRef.current - Date.now());
    const sessionRemainingMs = Math.max(0, sessionEnd - Date.now());
    pausedSnapshotRef.current = {
      phase: phaseRef.current,
      phaseRemainingMs,
      sessionRemainingMs,
    };
    clearPhaseTimer();
    clearTickTimer();
    isRunningRef.current = false;
    setIsRunning(false);
    setIsPaused(true);
    setUiTick(t => t + 1);
  }, [clearPhaseTimer, clearTickTimer]);

  const resume = useCallback(() => {
    const snap = pausedSnapshotRef.current;
    if (!snap) {
      return;
    }
    if (snap.sessionRemainingMs <= 0 || snap.phaseRemainingMs <= 0) {
      completeSession();
      return;
    }
    sessionEndsAtRef.current = Date.now() + snap.sessionRemainingMs;
    phaseRef.current = snap.phase;
    setPhase(snap.phase);
    pendingPhaseDurationMsRef.current = snap.phaseRemainingMs;
    pausedSnapshotRef.current = null;
    isRunningRef.current = true;
    setIsRunning(true);
    setIsPaused(false);
    setAnimationEpoch(e => e + 1);
    startUiTicks();
    schedulePhaseChain();
  }, [completeSession, schedulePhaseChain, startUiTicks]);

  const toggleRunning = useCallback(() => {
    if (isRunningRef.current) {
      pause();
      return;
    }
    if (pausedSnapshotRef.current) {
      resume();
      return;
    }
    startFreshSession();
  }, [pause, resume, startFreshSession]);

  const resetIdle = useCallback(() => {
    stopAll();
    phaseRef.current = 'inhale';
    setPhase('inhale');
    setPhaseDurationMsState(BREATHING_DURATIONS_MS.inhale);
    setAnimationEpoch(e => e + 1);
  }, [stopAll]);

  useEffect(() => {
    return () => {
      clearPhaseTimer();
      clearTickTimer();
    };
  }, [clearPhaseTimer, clearTickTimer]);

  /* eslint-disable react-hooks/exhaustive-deps -- `uiTick` forces recomputation while countdown refs advance */
  const sessionRemainingSec = useMemo(() => {
    if (!isRunning && pausedSnapshotRef.current) {
      return Math.max(
        0,
        Math.ceil(pausedSnapshotRef.current.sessionRemainingMs / 1000),
      );
    }
    if (!isRunning && sessionEndsAtRef.current === null) {
      return Math.ceil(sessionDurationMs / 1000);
    }
    if (sessionEndsAtRef.current === null) {
      return Math.ceil(sessionDurationMs / 1000);
    }
    return Math.max(
      0,
      Math.ceil((sessionEndsAtRef.current - Date.now()) / 1000),
    );
  }, [isRunning, uiTick, sessionDurationMs]);

  const phaseRemainingSec = useMemo(() => {
    if (!isRunning && pausedSnapshotRef.current) {
      return Math.max(
        0,
        Math.ceil(pausedSnapshotRef.current.phaseRemainingMs / 1000),
      );
    }
    if (!isRunning && sessionEndsAtRef.current === null) {
      return Math.ceil(BREATHING_DURATIONS_MS.inhale / 1000);
    }
    return Math.max(
      0,
      Math.ceil((phaseEndsAtRef.current - Date.now()) / 1000),
    );
  }, [isRunning, uiTick]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return {
    phase,
    isRunning,
    animationEpoch,
    phaseDurationMs: phaseDurationMsState,
    sessionRemainingSec,
    phaseRemainingSec,
    toggleRunning,
    resetIdle,
    isPaused,
  };
}
