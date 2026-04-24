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
} from '@/theme';

const IMAGE_SIZE = 64;
const CARD_RADIUS = radius.lg - 2;

export function createProductListCardStyles(
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
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingBottom: spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderStyle: 'dashed',
      borderBottomColor: themeColors.border,
    },
    headerTextCol: {
      flex: 1,
      paddingEnd: spacing.md,
      gap: spacing.sm,
    },
    headerTitleOnly: {
      flex: 1,
      paddingEnd: spacing.md,
    },
    title: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.semibold,
      color: themeColors.text,
    },
    stars: {
      fontSize: fontSize.md,
      letterSpacing: 1,
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
    imagePlaceholder: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    placeholderGlyph: {
      fontSize: fontSize['2xl'],
      opacity: 0.35,
      color: themeColors.text,
    },
    metaBlock: {
      paddingTop: spacing.md,
      gap: spacing.md - 2,
      width: '100%',
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      gap: spacing.md,
    },
    infoLabel: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.medium,
      flexShrink: 0,
      color: themeColors.text,
    },
    infoValue: {
      fontSize: fontSize.md,
      flex: 1,
      textAlign: 'right',
      color: themeColors.text,
    },
    badge: {
      paddingVertical: spacing.xs,
      paddingHorizontal: 10,
      borderRadius: radius.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: themeColors.border,
      backgroundColor: themeColors.card,
    },
    badgePackage: {
      backgroundColor: s.successMuted,
    },
    badgeText: {
      fontSize: 13,
      fontWeight: fontWeight.semibold,
      color: themeColors.text,
    },
    actionsRow: {
      flexDirection: 'row',
      gap: spacing.md - 2,
      marginTop: spacing.md,
      width: '100%',
    },
    buttonPrimary: {
      flex: 1,
      borderRadius: radius.lg - 2,
      paddingVertical: spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: themeColors.primary,
    },
    buttonOutlined: {
      flex: 1,
      borderRadius: radius.lg - 2,
      paddingVertical: spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: themeColors.primary,
    },
    buttonSuccess: {
      flex: 1,
      borderRadius: radius.lg - 2,
      paddingVertical: spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: s.success,
    },
    buttonPrimaryText: {
      color: s.onPrimary,
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
    },
    buttonSuccessText: {
      color: colors.white,
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
    },
    buttonOutlinedText: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: themeColors.primary,
    },
    pressed: {
      opacity: 0.88,
    },
  });
}

export type ProductListCardStyles = ReturnType<
  typeof createProductListCardStyles
>;

export function useProductListCardStyles(themeColors: Theme['colors']) {
  const { dark } = useTheme();
  const s = pickSemantic(dark);
  return React.useMemo(
    () => createProductListCardStyles(themeColors, s),
    [themeColors, s],
  );
}
