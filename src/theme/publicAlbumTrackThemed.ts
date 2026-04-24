import * as React from 'react';
import { StyleSheet } from 'react-native';
import type { Theme } from '@react-navigation/native';

export type PublicAlbumTrackStyles = ReturnType<typeof createPublicAlbumTrackStyles>;

export function createPublicAlbumTrackStyles(colors: Theme['colors']) {
  return StyleSheet.create({
    card: {
      borderRadius: 12,
      borderWidth: StyleSheet.hairlineWidth,
      padding: 12,
      width: '100%',
      borderColor: '#1a3344',
      backgroundColor: '#122320',
    },
    hero: {
      width: '100%',
      height: 180,
      borderRadius: 9999,
      marginBottom: 12,
      backgroundColor: '#0b1820',
    },
    heroPh: { alignItems: 'center', justifyContent: 'center' },
    heroPhText: { fontSize: 32, color: '#5a7a8f', opacity: 0.6 },
    title: {
      fontSize: 18,
      fontWeight: '700',
      color: '#e8f4ff',
      marginBottom: 10,
    },
    rows: { gap: 10 },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    label: { color: '#9db4c8', fontSize: 14, fontWeight: '500' },
    value: { color: '#dfeaf5', fontSize: 14, flex: 1, textAlign: 'right' },
    actions: { flexDirection: 'row', gap: 10, marginTop: 14 },
    btnLight: {
      flex: 1,
      borderRadius: 10,
      paddingVertical: 12,
      alignItems: 'center',
      backgroundColor: colors.primary,
    },
    outline: {
      flex: 1,
      borderRadius: 10,
      paddingVertical: 12,
      alignItems: 'center',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.primary,
    },
    outlineTxt: {
      fontWeight: '700',
      fontSize: 14,
      color: colors.primary,
    },
    success: {
      flex: 1,
      borderRadius: 10,
      paddingVertical: 12,
      alignItems: 'center',
      backgroundColor: '#00a86b',
    },
    btnLightTxt: { color: '#fff', fontSize: 14, fontWeight: '700' },
    pressed: { opacity: 0.88 },
  });
}

export function usePublicAlbumTrackStyles(colors: Theme['colors']) {
  return React.useMemo(
    () => createPublicAlbumTrackStyles(colors),
    [colors],
  );
}
