import * as React from 'react';
import { StyleSheet } from 'react-native';
import type { Theme } from '@react-navigation/native';

const IMAGE_SIZE = 64;
const BORDER_RADIUS = 10;

export function createEventListCardStyles(colors: Theme['colors']) {
  return StyleSheet.create({
    card: {
      borderRadius: BORDER_RADIUS,
      borderWidth: StyleSheet.hairlineWidth,
      padding: 12,
      width: '100%',
      backgroundColor: colors.card,
      borderColor: colors.border,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingBottom: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderStyle: 'dashed',
      borderBottomColor: colors.border,
    },
    title: {
      flex: 1,
      paddingEnd: 12,
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
    },
    thumb: {
      width: IMAGE_SIZE,
      height: IMAGE_SIZE,
      borderRadius: BORDER_RADIUS,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      backgroundColor: colors.card,
    },
    placeholder: { alignItems: 'center', justifyContent: 'center' },
    phGlyph: { fontSize: 22, opacity: 0.35, color: colors.text },
    meta: { paddingTop: 12, gap: 10 },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    },
    label: { fontSize: 14, fontWeight: '500', flexShrink: 0, color: colors.text },
    value: { fontSize: 14, flex: 1, textAlign: 'right', color: colors.text },
    actions: { flexDirection: 'row', gap: 10, marginTop: 12 },
    primaryBtn: {
      flex: 1,
      borderRadius: 10,
      paddingVertical: 12,
      alignItems: 'center',
      backgroundColor: colors.primary,
    },
    outlineBtn: {
      flex: 1,
      borderRadius: 10,
      paddingVertical: 12,
      alignItems: 'center',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.primary,
    },
    successBtn: {
      flex: 1,
      borderRadius: 10,
      paddingVertical: 12,
      alignItems: 'center',
      backgroundColor: '#00a86b',
    },
    btnLight: { color: '#fff', fontSize: 14, fontWeight: '700' },
    outlineTxt: { fontSize: 14, fontWeight: '700', color: colors.primary },
    pressed: { opacity: 0.88 },
  });
}

export function useEventListCardStyles(colors: Theme['colors']) {
  return React.useMemo(
    () => createEventListCardStyles(colors),
    [colors],
  );
}
