import { StyleSheet } from 'react-native';

import { fontSize, fontWeight, lineHeight, radius, spacing } from '@/ui/theme';
import type { ThemeColors } from '@/ui/theme/types';

export function createLoginScreenStyles(colors: ThemeColors) {
  return StyleSheet.create({
    flex: { flex: 1 },
    overlay: {
      ...StyleSheet.absoluteFill,
    },
    inner: {
      flex: 1,
      padding: spacing.xl,
      justifyContent: 'flex-end',
      gap: spacing.md,
      maxWidth: 400,
      alignSelf: 'center',
      width: '100%',
    },
    title: {
      fontSize: 26,
      fontWeight: fontWeight.bold,
      textAlign: 'center',
      color: '#fff',
    },
    sub: {
      fontSize: fontSize.md,
      lineHeight: lineHeight.snug,
      textAlign: 'center',
      opacity: 0.8,
      marginBottom: spacing.sm,
      color: '#fff',
    },
    input: {
      borderWidth: StyleSheet.hairlineWidth,
      borderRadius: radius.lg - 2,
      paddingHorizontal: 14,
      paddingVertical: spacing.md,
      fontSize: fontSize.base,
      borderColor: colors.border,
      color: colors.text,
      backgroundColor: colors.inputBackground,
    },
    row: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    modeButton: {
      flex: 1,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      borderRadius: radius.lg - 4,
      paddingVertical: spacing.sm,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.card,
    },
    modeButtonActive: {
      borderColor: colors.primary,
    },
    modeText: {
      color: colors.text,
      fontSize: fontSize.md,
      fontWeight: fontWeight.semibold,
    },
    helperText: {
      color: colors.text,
      opacity: 0.7,
      fontSize: fontSize.sm,
    },
    errorText: {
      color: colors.errorText,
      fontSize: fontSize.sm,
      lineHeight: lineHeight.normal,
    },
    registerCta: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: spacing.xs,
      marginTop: spacing.sm,
    },
    registerCtaText: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: fontSize.sm,
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
