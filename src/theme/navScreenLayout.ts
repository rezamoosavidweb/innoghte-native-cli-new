import * as React from 'react';
import { StyleSheet } from 'react-native';
import type { Theme } from '@react-navigation/native';

/** FlashList / ScrollView content insets (no theme tokens). */
export const flashListContentGutters = StyleSheet.create({
  standard: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  /** Slightly wider horizontal padding for drawer list screens. */
  drawerWide: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 28,
  },
});

/** FlashList `ItemSeparatorComponent` heights (static). */
export const flashListRowSeparators = StyleSheet.create({
  h10: { height: 10 },
  h12: { height: 12 },
  h14: { height: 14 },
});

export function useNavScreenShellStyles(colors: Theme['colors']) {
  return React.useMemo(
    () =>
      StyleSheet.create({
        safe: { flex: 1, backgroundColor: colors.background },
        centered: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          gap: 12,
          backgroundColor: colors.background,
        },
        loadingText: { fontSize: 16, fontWeight: '600', color: colors.text },
        errorText: {
          fontSize: 16,
          fontWeight: '700',
          textAlign: 'center',
          color: colors.text,
        },
        errorDetail: {
          fontSize: 13,
          textAlign: 'center',
          opacity: 0.75,
          color: colors.text,
        },
      }),
    [colors.background, colors.text],
  );
}

export function useScreenScaffoldStyles(colors: Theme['colors']) {
  return React.useMemo(
    () =>
      StyleSheet.create({
        root: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 24,
          gap: 12,
          backgroundColor: colors.background,
        },
        title: { fontSize: 22, fontWeight: '700', color: colors.text },
        subtitle: {
          fontSize: 15,
          textAlign: 'center',
          opacity: 0.72,
          color: colors.text,
        },
        /** Section heading on settings-like drawer screens. */
        sectionTitle: {
          fontSize: 16,
          fontWeight: '700',
          alignSelf: 'flex-start',
          color: colors.text,
        },
      }),
    [colors.background, colors.text],
  );
}
