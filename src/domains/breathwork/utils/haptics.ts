import { Platform } from 'react-native';
import {
  HapticFeedbackTypes,
  trigger,
} from 'react-native-haptic-feedback';

import type { BreathingPhase } from '@/domains/breathwork/model/types';

/**
 * Fires once per phase edge. Wrapped in runOnJS from the UI thread.
 * Keeps tactile feedback independent of JS frame budget.
 */
export function triggerBreathPhaseHaptic(phase: BreathingPhase) {
  try {
    const method =
      phase === 'hold'
        ? HapticFeedbackTypes.selection
        : Platform.OS === 'ios'
          ? HapticFeedbackTypes.impactLight
          : HapticFeedbackTypes.soft;
    trigger(method, {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
  } catch {
    /* native module optional in some builds */
  }
}
