import { useTheme, type Theme } from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet } from 'react-native';

import {
  colors,
  fontSize,
  fontWeight,
  pickSemantic,
  radius,
  spacing,
} from '@/shared/styles/theme';

/** Dark “hero card” surface: primitive `colors` scales only. */
const album = {
  cardBg: colors.dark[3],
  cardBorder: colors.dark[1],
  heroBg: colors.dark[4],
  heroPlaceholder: colors.dark[5],
  title: colors.white,
  label: colors.charcoal[300],
  value: colors.grayscale[200],
  heroGlyph: colors.charcoal[400],
} as const;

const HERO_HEIGHT = 180;

export type PublicAlbumTrackStyles = ReturnType<
  typeof createPublicAlbumTrackStyles
>;

export function createPublicAlbumTrackStyles(
  themeColors: Theme['colors'],
  s: ReturnType<typeof pickSemantic>,
) {
  return StyleSheet.create({
    card: {
      borderRadius: radius.lg,
      borderWidth: StyleSheet.hairlineWidth,
      padding: spacing.md,
      width: '100%',
      borderColor: album.cardBorder,
      backgroundColor: album.cardBg,
    },
    hero: {
      width: '100%',
      height: HERO_HEIGHT,
      borderRadius: radius.full,
      marginBottom: spacing.md,
      backgroundColor: album.heroBg,
    },
    heroPh: { alignItems: 'center', justifyContent: 'center' },
    heroPhText: {
      fontSize: fontSize['3xl'] + 8,
      color: album.heroGlyph,
      opacity: 0.6,
    },
    title: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: album.title,
      marginBottom: spacing.md - 2,
    },
    rows: { gap: spacing.md - 2 },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    label: {
      color: album.label,
      fontSize: fontSize.md,
      fontWeight: fontWeight.medium,
    },
    value: {
      color: album.value,
      fontSize: fontSize.md,
      flex: 1,
      textAlign: 'right',
    },
    actions: {
      flexDirection: 'row',
      gap: spacing.md - 2,
      marginTop: 14,
    },
    primaryBtn: {
      flex: 1,
      borderRadius: radius.lg - 2,
      paddingVertical: spacing.md,
      alignItems: 'center',
      backgroundColor: themeColors.primary,
    },
    outline: {
      flex: 1,
      borderRadius: radius.lg - 2,
      paddingVertical: spacing.md,
      alignItems: 'center',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: themeColors.primary,
    },
    outlineTxt: {
      fontWeight: fontWeight.bold,
      fontSize: fontSize.md,
      color: themeColors.primary,
    },
    success: {
      flex: 1,
      borderRadius: radius.lg - 2,
      paddingVertical: spacing.md,
      alignItems: 'center',
      backgroundColor: s.success,
    },
    primaryBtnText: {
      color: s.onPrimary,
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
    },
    successBtnText: {
      color: colors.white,
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
    },
    pressed: { opacity: 0.88 },
  });
}

export function usePublicAlbumTrackStyles(themeColors: Theme['colors']) {
  const { dark } = useTheme();
  const sem = pickSemantic(dark);
  return React.useMemo(
    () => createPublicAlbumTrackStyles(themeColors, sem),
    [themeColors, sem],
  );
}
