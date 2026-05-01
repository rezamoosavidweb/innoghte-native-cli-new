import * as React from 'react';
import { Dimensions, StyleSheet } from 'react-native';

import type { ThemeColors } from '@/ui/theme/types';
import { fontSize, fontWeight, radius, spacing } from '@/ui/theme';
import { hexAlpha } from '@/ui/theme/utils/colorUtils';

const { height: SCREEN_H } = Dimensions.get('window');

export function useStartupScreenStyles(colors: ThemeColors) {
  return React.useMemo(
    () =>
      StyleSheet.create({
        root: {
          flex: 1,
          backgroundColor: colors.gradientStart,
        },

        // ── Decorative background orbs ───────────────────────────────────
        orbTopLeft: {
          position: 'absolute',
          width: 260,
          height: 260,
          borderRadius: 130,
          top: -80,
          left: -80,
          backgroundColor: colors.ambientOrb1,
          opacity: 0.07,
        },
        orbBottomRight: {
          position: 'absolute',
          width: 300,
          height: 300,
          borderRadius: 150,
          bottom: -100,
          right: -100,
          backgroundColor: colors.ambientOrb2,
          opacity: 0.09,
        },
        orbCenter: {
          position: 'absolute',
          width: 380,
          height: 380,
          borderRadius: 190,
          top: SCREEN_H * 0.18,
          alignSelf: 'center',
          backgroundColor: colors.gradientMid,
          // opacity controlled by ambientStyle animation (starts at 0.45)
        },

        // ── Floating particles (absolute, animated externally) ───────────
        particleA: {
          position: 'absolute',
          bottom: SCREEN_H * 0.30,
          left: '18%',
          width: 5,
          height: 5,
          borderRadius: 2.5,
          backgroundColor: colors.ambientOrb1,
        },
        particleB: {
          position: 'absolute',
          bottom: SCREEN_H * 0.22,
          right: '20%',
          width: 4,
          height: 4,
          borderRadius: 2,
          backgroundColor: colors.ambientOrb2,
        },
        particleC: {
          position: 'absolute',
          bottom: SCREEN_H * 0.38,
          left: '50%',
          width: 3,
          height: 3,
          borderRadius: 1.5,
          backgroundColor: colors.ambientOrb1,
        },

        // ── Illustration zone (animated externally) ──────────────────────
        breathingRing: {
          position: 'absolute',
          width: 300,
          height: 300,
          borderRadius: 150,
          borderWidth: 1.5,
          borderColor: colors.ambientOrb1,
          opacity: 0.18,
          alignSelf: 'center',
        },
        breathingRingOuter: {
          position: 'absolute',
          width: 340,
          height: 340,
          borderRadius: 170,
          borderWidth: 1,
          borderColor: colors.ambientOrb2,
          opacity: 0.11,
          alignSelf: 'center',
        },
        innerGlow: {
          position: 'absolute',
          width: 270,
          height: 270,
          borderRadius: 135,
          backgroundColor: colors.ambientOrb1,
          alignSelf: 'center',
          // opacity controlled by innerGlowStyle animation (0.03 → 0.09)
        },

        // ── Layout ───────────────────────────────────────────────────────
        scroll: {
          flexGrow: 1,
          paddingTop: spacing['3xl'],
          paddingBottom: spacing['10xl'],
          alignItems: 'center',
        },

        // ── Brand badge ──────────────────────────────────────────────────
        badge: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          paddingHorizontal: spacing.base,
          paddingVertical: spacing.sm,
          borderRadius: radius.full,
          borderWidth: 1,
          borderColor: hexAlpha(colors.info, 0.25),
          backgroundColor: hexAlpha(colors.info, 0.07),
          marginBottom: spacing['3xl'],
        },
        badgeDot: {
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: colors.info,
        },
        badgeText: {
          fontSize: fontSize.sm,
          fontWeight: fontWeight.medium,
          color: colors.info,
          letterSpacing: 1.2,
          textTransform: 'uppercase',
        },

        // ── Illustration zone ─────────────────────────────────────────────
        illustrationZone: {
          width: 300,
          height: 300,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: spacing['3xl'],
        },

        // ── Text content ─────────────────────────────────────────────────
        textBlock: {
          alignItems: 'center',
          paddingHorizontal: spacing['5xl'],
          gap: spacing.md,
          marginBottom: spacing['10xl'],
        },
        appName: {
          fontSize: fontSize['4xl'],
          fontWeight: fontWeight.heavy,
          color: colors.text,
          letterSpacing: 6,
          textTransform: 'uppercase',
        },
        tagline: {
          fontSize: fontSize.base,
          fontWeight: fontWeight.light,
          color: hexAlpha(colors.text, 0.60),
          textAlign: 'center',
          lineHeight: 24,
        },
        divider: {
          width: 40,
          height: 2,
          borderRadius: 1,
          backgroundColor: colors.ambientOrb2,
          opacity: 0.7,
          marginVertical: spacing.sm,
        },

        // ── Buttons ──────────────────────────────────────────────────────
        actions: {
          width: '100%',
          paddingHorizontal: spacing['3xl'],
          gap: spacing.md,
        },
        btnPrimary: {
          height: 54,
          borderRadius: radius.lg,
          backgroundColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.38,
          shadowRadius: 16,
          elevation: 8,
        },
        btnPrimaryText: {
          fontSize: fontSize.base,
          fontWeight: fontWeight.bold,
          color: colors.onPrimary,
          letterSpacing: 0.5,
        },
        btnSecondary: {
          height: 54,
          borderRadius: radius.lg,
          borderWidth: 1.5,
          borderColor: hexAlpha(colors.text, 0.18),
          backgroundColor: hexAlpha(colors.text, 0.05),
          alignItems: 'center',
          justifyContent: 'center',
        },
        btnSecondaryText: {
          fontSize: fontSize.base,
          fontWeight: fontWeight.medium,
          color: hexAlpha(colors.text, 0.75),
          letterSpacing: 0.3,
        },

        // ── Footer hint ──────────────────────────────────────────────────
        footer: {
          marginTop: spacing['3xl'],
          alignItems: 'center',
        },
        footerText: {
          fontSize: fontSize.xs,
          color: colors.textMuted,
          letterSpacing: 0.5,
        },
      }),
    [colors],
  );
}
