import { Dimensions, StyleSheet } from 'react-native';

import type { ThemeColors } from '@/ui/theme/types';
import { fontSize, fontWeight, radius, spacing } from '@/ui/theme';
import { hexAlpha } from '@/ui/theme/utils/colorUtils';

const { height: SCREEN_H } = Dimensions.get('window');

/**
 * Startup / first-launch atmosphere. All surfaces resolve through {@link ThemeColors}
 * so light/dark and accent presets stay coherent.
 *
 * Animated layers (`orbCenterFill`, particles, `innerGlow`, breathing rings)
 * own layout + color here; opacity / transforms are driven from the screen via Reanimated.
 */
export function createStartupScreenStyles(colors: ThemeColors) {
  return StyleSheet.create({
        root: {
          flex: 1,
          backgroundColor: colors.gradientStart,
        },

        // ── Decorative background orbs (static layout; optional opacity animation) ──
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
        /** Large mid-screen wash — pair with animated opacity on the wrapping `Animated.View`. */
        orbCenterFill: {
          position: 'absolute',
          width: 380,
          height: 380,
          borderRadius: 190,
          top: SCREEN_H * 0.18,
          alignSelf: 'center',
          backgroundColor: colors.gradientMid,
        },

        // ── Floating particles (animated: translate Y + opacity; absolute in root) ──
        particleA: {
          position: 'absolute',
          bottom: SCREEN_H * 0.30,
          left: '18%',
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: colors.ambientOrb1,
        },
        particleB: {
          position: 'absolute',
          bottom: SCREEN_H * 0.22,
          right: '20%',
          width: 5,
          height: 5,
          borderRadius: 2.5,
          backgroundColor: colors.ambientOrb2,
        },
        particleC: {
          position: 'absolute',
          bottom: SCREEN_H * 0.38,
          left: '50%',
          marginLeft: -24,
          width: 4,
          height: 4,
          borderRadius: 2,
          backgroundColor: hexAlpha(colors.ambientOrb1, 0.42),
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: hexAlpha(colors.ambientOrb2, 0.5),
        },

        /** Soft halo behind illustration — animate scale / opacity */
        innerGlow: {
          position: 'absolute',
          width: 270,
          height: 270,
          borderRadius: 135,
          backgroundColor: colors.shimmer,
          alignSelf: 'center',
        },

        // ── Breathing rings (animated scale / opacity on wrapper) ────────────────
        breathingRing: {
          position: 'absolute',
          width: 300,
          height: 300,
          borderRadius: 150,
          borderWidth: 1.5,
          borderColor: hexAlpha(colors.ambientOrb1, 0.75),
          alignSelf: 'center',
        },
        breathingRingOuter: {
          position: 'absolute',
          width: 340,
          height: 340,
          borderRadius: 170,
          borderWidth: 1,
          borderColor: hexAlpha(colors.ambientOrb2, 0.65),
          alignSelf: 'center',
        },

        // ── Layout ───────────────────────────────────────────────────────────────
        scroll: {
          flexGrow: 1,
          paddingTop: spacing['3xl'],
          paddingBottom: spacing['10xl'],
          alignItems: 'center',
        },

        // ── Brand badge ───────────────────────────────────────────────────────────
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
          color: colors.infoText,
          letterSpacing: 1.2,
          textTransform: 'uppercase',
        },

        // ── Illustration zone ──────────────────────────────────────────────────────
        illustrationZone: {
          width: 300,
          height: 300,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: spacing['3xl'],
        },

        /** App title accent — staggered fade/scale wrapper */
        titleAccentBar: {
          width: 48,
          height: 3,
          borderRadius: radius.sm,
          backgroundColor: colors.primary,
          marginTop: spacing.xs,
          opacity: 0.85,
        },

        // ── Text content ─────────────────────────────────────────────────────────────
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
          color: colors.textSecondary,
          textAlign: 'center',
          lineHeight: 24,
        },
        divider: {
          width: 40,
          height: 2,
          borderRadius: 1,
          backgroundColor: colors.divider,
          marginVertical: spacing.sm,
        },

        // ── Buttons ─────────────────────────────────────────────────────────────────
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
          borderColor: colors.chipBorder,
          backgroundColor: colors.chipBackground,
          alignItems: 'center',
          justifyContent: 'center',
        },
        btnSecondaryText: {
          fontSize: fontSize.base,
          fontWeight: fontWeight.medium,
          color: colors.textSecondary,
          letterSpacing: 0.3,
        },

        // ── Footer ───────────────────────────────────────────────────────────────────
        footer: {
          marginTop: spacing['3xl'],
          alignItems: 'center',
        },
        footerText: {
          fontSize: fontSize.xs,
          color: colors.textMuted,
          letterSpacing: 0.5,
        },
      });
}
