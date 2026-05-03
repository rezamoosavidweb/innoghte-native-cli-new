import { StyleSheet } from 'react-native';

import { spacing } from '@/ui/theme';
import type { ThemeColors } from '@/ui/theme/types';

export function createAuthEntryScreenStyles(_colors: ThemeColors) {
  return StyleSheet.create({
    flex: { flex: 1 },
    overlay: {
      ...StyleSheet.absoluteFill,
    },
    inner: {
      flex: 1,
      padding: spacing.xl,
      paddingBottom: spacing['3xl'],
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: spacing.md,
      maxWidth: 400,
      alignSelf: 'center',
      width: '100%',
    },
    logoContainer: {
      position: 'absolute',
      top: 48,
      left: 0,
      right: 0,
      alignItems: 'center',
    },
  });
}
