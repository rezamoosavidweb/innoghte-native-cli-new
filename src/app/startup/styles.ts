import * as React from 'react';
import { Dimensions, StyleSheet } from 'react-native';

import type { ThemeColors } from '@/ui/theme/types';
import { fontSize, fontWeight, radius, spacing } from '@/ui/theme';

const { height: SCREEN_H } = Dimensions.get('window');

export function useStartupScreenStyles(colors: ThemeColors) {
  return React.useMemo(
    () =>
      StyleSheet.create({
        root: {
          flex: 1,
          backgroundColor: '#0B1120',
        },
        /* Decorative background orbs */
        orbTopLeft: {
          position: 'absolute',
          width: 260,
          height: 260,
          borderRadius: 130,
          top: -80,
          left: -80,
          backgroundColor: '#0ABBB5',
          opacity: 0.06,
        },
        orbBottomRight: {
          position: 'absolute',
          width: 300,
          height: 300,
          borderRadius: 150,
          bottom: -100,
          right: -100,
          backgroundColor: '#FF984C',
          opacity: 0.07,
        },
        orbCenter: {
          position: 'absolute',
          width: 380,
          height: 380,
          borderRadius: 190,
          top: SCREEN_H * 0.18,
          alignSelf: 'center',
          backgroundColor: '#1E2D4A',
          opacity: 0.45,
        },

        /* Breathing ring wrapper (animated externally) */
        breathingRing: {
          position: 'absolute',
          width: 300,
          height: 300,
          borderRadius: 150,
          borderWidth: 1.5,
          borderColor: '#0ABBB5',
          opacity: 0.18,
          alignSelf: 'center',
        },
        breathingRingOuter: {
          position: 'absolute',
          width: 340,
          height: 340,
          borderRadius: 170,
          borderWidth: 1,
          borderColor: '#FF984C',
          opacity: 0.10,
          alignSelf: 'center',
        },

        /* Layout */
        scroll: {
          flexGrow: 1,
          paddingTop: spacing['3xl'],
          paddingBottom: spacing['10xl'],
          alignItems: 'center',
        },

        /* Brand badge at top */
        badge: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          paddingHorizontal: spacing.base,
          paddingVertical: spacing.sm,
          borderRadius: radius.full,
          borderWidth: 1,
          borderColor: 'rgba(10,187,181,0.25)',
          backgroundColor: 'rgba(10,187,181,0.07)',
          marginBottom: spacing['3xl'],
        },
        badgeDot: {
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: '#0ABBB5',
        },
        badgeText: {
          fontSize: fontSize.sm,
          fontWeight: fontWeight.medium,
          color: '#0ABBB5',
          letterSpacing: 1.2,
          textTransform: 'uppercase',
        },

        /* Illustration zone */
        illustrationZone: {
          width: 300,
          height: 300,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: spacing['3xl'],
        },

        /* Text content */
        textBlock: {
          alignItems: 'center',
          paddingHorizontal: spacing['5xl'],
          gap: spacing.md,
          marginBottom: spacing['10xl'],
        },
        appName: {
          fontSize: fontSize['4xl'],
          fontWeight: fontWeight.heavy,
          color: '#FFFFFF',
          letterSpacing: 6,
          textTransform: 'uppercase',
        },
        tagline: {
          fontSize: fontSize.base,
          fontWeight: fontWeight.light,
          color: 'rgba(255,255,255,0.60)',
          textAlign: 'center',
          lineHeight: 24,
        },
        divider: {
          width: 40,
          height: 2,
          borderRadius: 1,
          backgroundColor: '#FF984C',
          opacity: 0.7,
          marginVertical: spacing.sm,
        },

        /* Buttons */
        actions: {
          width: '100%',
          paddingHorizontal: spacing['3xl'],
          gap: spacing.md,
        },
        btnPrimary: {
          height: 54,
          borderRadius: radius.lg,
          backgroundColor: '#FF984C',
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#FF984C',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.38,
          shadowRadius: 16,
          elevation: 8,
        },
        btnPrimaryText: {
          fontSize: fontSize.base,
          fontWeight: fontWeight.bold,
          color: '#FFFFFF',
          letterSpacing: 0.5,
        },
        btnSecondary: {
          height: 54,
          borderRadius: radius.lg,
          borderWidth: 1.5,
          borderColor: 'rgba(255,255,255,0.18)',
          backgroundColor: 'rgba(255,255,255,0.05)',
          alignItems: 'center',
          justifyContent: 'center',
        },
        btnSecondaryText: {
          fontSize: fontSize.base,
          fontWeight: fontWeight.medium,
          color: 'rgba(255,255,255,0.75)',
          letterSpacing: 0.3,
        },

        /* Footer hint */
        footer: {
          marginTop: spacing['3xl'],
          alignItems: 'center',
        },
        footerText: {
          fontSize: fontSize.xs,
          color: 'rgba(255,255,255,0.28)',
          letterSpacing: 0.5,
        },
      }),
    // colors is intentionally kept as a dep so the hook signature stays stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [colors],
  );
}
