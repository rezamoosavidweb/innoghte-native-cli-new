import type { Theme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

import { spacing } from '@/ui/theme/core/spacing';
import { fontSize, fontWeight } from '@/ui/theme/core/typography';

/** FlashList / ScrollView content insets (token-based). */
export const flashListContentGutters = StyleSheet.create({
  standard: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.base,
    paddingBottom: spacing['3xl'],
  },
  /** Slightly wider horizontal padding for drawer list screens. */
  drawerWide: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
    paddingBottom: spacing['5xl'],
  },
  vertical: {
    paddingTop: spacing.xl,
    paddingBottom: spacing['3xl'],
  },
});

/** FlashList `ItemSeparatorComponent` heights (token-based). */
export const flashListRowSeparators = StyleSheet.create({
  h10: { height: spacing.md - 2 },
  h12: { height: spacing.md },
  h14: { height: spacing.md + 2 },
});

/**
 * FlashList `estimatedItemSize` hints per card template (see FlashList docs).
 * Slightly under true average is usually safer for first paint.
 */
export const flashListEstimatedItemSize = {
  course: 300,
  album: 260,
  liveMeeting: 280,
  event: 300,
  publicAlbumTrack: 320,
  faq: 72,
} as const;

export function createNavScreenShellStyles(colors: Theme['colors']) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing['3xl'],
      gap: spacing.md,
      backgroundColor: colors.background,
    },
    loadingText: {
      fontSize: fontSize.base,
      fontWeight: fontWeight.semibold,
      color: colors.text,
    },
    errorText: {
      fontSize: fontSize.base,
      fontWeight: fontWeight.bold,
      textAlign: 'center',
      color: colors.text,
    },
    errorDetail: {
      fontSize: fontSize.sm + 1,
      textAlign: 'center',
      opacity: 0.75,
      color: colors.text,
    },
  });
}

export function createScreenScaffoldStyles(colors: Theme['colors']) {
  return StyleSheet.create({
    root: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'stretch',
      padding: spacing.xl,
      gap: spacing.md,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: fontSize['2xl'],
      fontWeight: fontWeight.bold,
      color: colors.text,
      alignItems: 'center',
    },
    subtitle: {
      fontSize: fontSize.md + 1,
      textAlign: 'center',
      opacity: 0.72,
      color: colors.text,
    },
    /** Section heading on settings-like drawer screens. */
    sectionTitle: {
      fontSize: fontSize.base,
      fontWeight: fontWeight.bold,
      alignSelf: 'flex-start',
      color: colors.text,
    },
  });
}
