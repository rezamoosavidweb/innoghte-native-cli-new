import { Platform, Vibration } from 'react-native';

/**
 * Short tactile cue on breathing phase boundaries.
 * Uses a brief Android vibration; iOS needs a native haptics module for equivalent feedback.
 */
export function lightImpact(): void {
  if (Platform.OS === 'android') {
    Vibration.vibrate(12);
  }
}
