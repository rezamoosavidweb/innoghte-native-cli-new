import { useTheme, type Theme } from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  fontSize,
  fontWeight,
  lineHeight,
  palette,
  pickSemantic,
  radius,
  spacing,
} from '@/ui/theme';
import { hexAlpha } from '@/ui/theme/utils/colorUtils';

/** Inline / compact banner height when not using full-screen hero mode. */
export const BANNER_DEFAULT_HEIGHT = 260;

/**
 * Horizontal inset used by the carousel "card" variant to peek sibling slides.
 */
export const BANNER_HORIZONTAL_INSET = spacing.base;

export type BannerVariant = 'hero' | 'card';

export function useBannerStyles(
  themeColors: Theme['colors'],
  variant: BannerVariant = 'card',
) {
  const { dark } = useTheme();
  const s = pickSemantic(dark);
  const insets = useSafeAreaInsets();

  const heroBodyPaddingBottom = React.useMemo(
    () => Math.max(spacing['3xl'], insets.bottom + spacing.sm),
    [insets.bottom],
  );

  const heroDotsBottom = React.useMemo(
    () => Math.max(spacing.md, insets.bottom),
    [insets.bottom],
  );

  const heroCopyTop = React.useMemo(
    () => insets.top + spacing['10xl'],
    [insets.top],
  );

  return React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          width: '100%',
        },
        viewportFill: {
          width: '100%',
          alignSelf: 'stretch',
        },
        carouselHeroShell: {
          width: '100%',
          overflow: 'hidden',
          position: 'relative',
        },
        dotsOverlay: {
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: heroDotsBottom,
          flexDirection: 'row',
          alignSelf: 'center',
          justifyContent: 'center',
          gap: spacing.xs + 2,
          pointerEvents: 'box-none',
        },
        item: {
          flex: 1,
          marginHorizontal:
            variant === 'hero' ? 0 : BANNER_HORIZONTAL_INSET,
          borderRadius: variant === 'hero' ? 0 : radius.xl,
          overflow: 'hidden',
          backgroundColor: themeColors.card,
        },
        itemPressed: {
          opacity: 0.92,
        },
        layerRoot: {
          flex: 1,
          position: 'relative',
        },
        lampImageFill: {
          width: '100%',
          height: '100%',
        },
        image: {
          flex: 1,
          justifyContent: 'flex-end',
        },
        imageLayered: {
          flex: 1,
          justifyContent: 'flex-start',
        },
        imageContent: {
          borderRadius: variant === 'hero' ? 0 : radius.xl,
        },
        fallback: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: s.drawerMutedSurface,
        },
        fallbackGlyph: {
          fontSize: fontSize['4xl'],
          opacity: 0.35,
          color: themeColors.text,
        },
        overlay: {
          ...StyleSheet.absoluteFill,
          backgroundColor: s.overlay,
        },
        overlaySoft: {
          ...StyleSheet.absoluteFill,
          backgroundColor: hexAlpha('#000000', 0.28),
        },
        heroCopy: {
          position: 'absolute',
          left: 0,
          right: 0,
          top: heroCopyTop,
          zIndex: 2,
          paddingHorizontal: spacing.xl,
          alignItems: 'center',
          gap: spacing.sm,
          pointerEvents: 'box-none',
        },
        titleAccent: {
          color: s.info,
        },
        body: {
          gap: spacing.sm,
          paddingHorizontal: spacing.xl,
          paddingTop: spacing.xl,
          paddingBottom:
            variant === 'hero' ? heroBodyPaddingBottom : spacing.xl,
        },
        title: {
          color: palette.white,
          fontSize: fontSize['2xl'],
          fontWeight: fontWeight.bold,
          lineHeight: lineHeight.relaxed,
          textAlign: 'right',
        },
        subtitle: {
          color: palette.white,
          fontSize: fontSize.md,
          lineHeight: lineHeight.normal,
          opacity: 0.85,
          textAlign: 'right',
        },
        ctaRow: {
          flexDirection: 'row',
          marginTop: spacing.sm,
        },
        ctaRowHero: {
          width: '100%',
          marginTop: spacing.sm,
          alignSelf: 'stretch',
        },
        ctaButton: {
          alignSelf: 'flex-start',
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.sm,
          borderRadius: radius.pill,
          backgroundColor: palette.white,
        },
        ctaButtonHero: {
          alignSelf: 'stretch',
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.sm,
          borderRadius: radius.md,
          backgroundColor: palette.white,
        },
        ctaButtonPressed: {
          opacity: 0.85,
        },
        ctaButtonHeroPressed: {
          opacity: 0.85,
        },
        ctaText: {
          fontSize: fontSize.md,
          fontWeight: fontWeight.bold,
          color: themeColors.background,
        },
        dots: {
          flexDirection: 'row',
          alignSelf: 'center',
          marginTop: spacing.md,
          gap: spacing.xs + 2,
        },
        dot: {
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: themeColors.border,
        },
        dotActive: {
          width: 22,
          backgroundColor: themeColors.primary,
        },
      }),
    [
      heroBodyPaddingBottom,
      heroCopyTop,
      heroDotsBottom,
      s,
      themeColors.background,
      themeColors.border,
      themeColors.card,
      themeColors.primary,
      themeColors.text,
      variant,
    ],
  );
}

export type BannerStyles = ReturnType<typeof useBannerStyles>;
