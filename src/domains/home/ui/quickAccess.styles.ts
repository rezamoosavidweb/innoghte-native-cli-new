import { useTheme, type Theme } from '@react-navigation/native';
import * as React from 'react';
import { Dimensions, StyleSheet } from 'react-native';

import {
  fontSize,
  fontWeight,
  lineHeight,
  pickSemantic,
  radius,
  spacing,
} from '@/ui/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;

/** Card width — leaves a peek of the next card on either side. */
export const QUICK_ACCESS_CARD_WIDTH = Math.round(SCREEN_WIDTH * 0.82);
const IMAGE_HEIGHT = Math.round(QUICK_ACCESS_CARD_WIDTH * 1.45);
const STATE_HEIGHT = IMAGE_HEIGHT + 120;

export function useQuickAccessStyles(themeColors: Theme['colors']) {
  const theme = useTheme();
  const s = pickSemantic(theme);

  return React.useMemo(
    () =>
      StyleSheet.create({
        section: {
          width: '100%',
          paddingVertical: spacing.xl,
          gap: spacing.base,
        },
        header: {
          paddingHorizontal: spacing.xl,
          gap: spacing.xs,
        },
        title: {
          fontSize: fontSize['2xl'],
          fontWeight: fontWeight.bold,
          color: themeColors.text,
        },
        subtitle: {
          fontSize: fontSize.md,
          lineHeight: lineHeight.normal,
          color: s.textSecondary,
        },
        stateContainer: {
          height: STATE_HEIGHT,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: spacing.xl,
        },
        stateText: {
          fontSize: fontSize.md,
          color: s.textMuted,
          textAlign: 'center',
        },
        card: {
          width: QUICK_ACCESS_CARD_WIDTH,
          borderRadius: radius.xl,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: themeColors.border,
          backgroundColor: themeColors.card,
          overflow: 'hidden',
        },
        cardPressed: {
          opacity: 0.92,
        },
        image: {
          width: '100%',
          height: IMAGE_HEIGHT,
          backgroundColor: s.drawerMutedSurface,
        },
        imageInner: {
          width: '100%',
          height: '100%',
        },
        imageLoadingOverlay: {
          ...StyleSheet.absoluteFill,
          alignItems: 'center',
          justifyContent: 'center',
        },
        imageFallback: {
          alignItems: 'center',
          justifyContent: 'center',
        },
        imageGlyph: {
          fontSize: fontSize['4xl'],
          opacity: 0.35,
          color: themeColors.text,
        },
        cardBody: {
          paddingHorizontal: spacing.base,
          paddingVertical: spacing.md,
          gap: spacing.xs + 2,
        },
        cardTitle: {
          fontSize: fontSize.lg,
          fontWeight: fontWeight.bold,
          color: themeColors.text,
        },
        cardDescription: {
          fontSize: fontSize.sm,
          lineHeight: lineHeight.snug,
          color: s.textSecondary,
        },
      }),
    [themeColors.border, themeColors.card, themeColors.text, s],
  );
}

export type QuickAccessStyles = ReturnType<typeof useQuickAccessStyles>;
