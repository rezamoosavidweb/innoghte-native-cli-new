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

const IMAGE_SIZE = 64;
const CARD_RADIUS = radius.lg - 2;

export function createEventListCardStyles(
  themeColors: Theme['colors'],
  s: ReturnType<typeof pickSemantic>,
) {
  return StyleSheet.create({
    card: {
      borderRadius: CARD_RADIUS,
      borderWidth: StyleSheet.hairlineWidth,
      padding: spacing.md,
      width: '100%',
      backgroundColor: themeColors.card,
      borderColor: themeColors.border,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingBottom: spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderStyle: 'dashed',
      borderBottomColor: themeColors.border,
    },
    title: {
      flex: 1,
      paddingEnd: spacing.md,
      fontSize: fontSize.lg,
      fontWeight: fontWeight.semibold,
      color: themeColors.text,
    },
    thumb: {
      width: IMAGE_SIZE,
      height: IMAGE_SIZE,
      borderRadius: CARD_RADIUS,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: themeColors.border,
      backgroundColor: themeColors.card,
    },
    placeholder: { alignItems: 'center', justifyContent: 'center' },
    phGlyph: {
      fontSize: fontSize['2xl'],
      opacity: 0.35,
      color: themeColors.text,
    },
    meta: { paddingTop: spacing.md, gap: spacing.md - 2 },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.md,
    },
    label: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.medium,
      flexShrink: 0,
      color: themeColors.text,
    },
    value: {
      fontSize: fontSize.md,
      flex: 1,
      textAlign: 'right',
      color: themeColors.text,
    },
    actions: {
      flexDirection: 'row',
      gap: spacing.md - 2,
      marginTop: spacing.md,
    },
    primaryBtn: {
      flex: 1,
      borderRadius: radius.lg - 2,
      paddingVertical: spacing.md,
      alignItems: 'center',
      backgroundColor: themeColors.primary,
    },
    outlineBtn: {
      flex: 1,
      borderRadius: radius.lg - 2,
      paddingVertical: spacing.md,
      alignItems: 'center',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: themeColors.primary,
    },
    successBtn: {
      flex: 1,
      borderRadius: radius.lg - 2,
      paddingVertical: spacing.md,
      alignItems: 'center',
      backgroundColor: s.success,
    },
    btnPrimaryText: {
      color: s.onPrimary,
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
    },
    btnSuccessText: {
      color: colors.white,
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
    },
    outlineTxt: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: themeColors.primary,
    },
    pressed: { opacity: 0.88 },
  });
}

export function useEventListCardStyles(themeColors: Theme['colors']) {
  const { dark } = useTheme();
  const sem = pickSemantic(dark);
  return React.useMemo(
    () => createEventListCardStyles(themeColors, sem),
    [themeColors, sem],
  );
}
