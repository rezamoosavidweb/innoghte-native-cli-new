import * as React from 'react';
import { StyleSheet } from 'react-native';
import type { Theme } from '@react-navigation/native';

const IMAGE_SIZE = 64;
const BORDER_RADIUS = 10;

export function createProductListCardStyles(colors: Theme['colors']) {
  return StyleSheet.create({
    card: {
      borderRadius: BORDER_RADIUS,
      borderWidth: StyleSheet.hairlineWidth,
      padding: 12,
      width: '100%',
      backgroundColor: colors.card,
      borderColor: colors.border,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingBottom: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderStyle: 'dashed',
      borderBottomColor: colors.border,
    },
    headerTextCol: {
      flex: 1,
      paddingEnd: 12,
      gap: 8,
    },
    /** Title column when there is no subtitle row (e.g. live meeting cards). */
    headerTitleOnly: {
      flex: 1,
      paddingEnd: 12,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
    },
    stars: {
      fontSize: 14,
      letterSpacing: 1,
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
    imagePlaceholder: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    placeholderGlyph: {
      fontSize: 22,
      opacity: 0.35,
      color: colors.text,
    },
    metaBlock: {
      paddingTop: 12,
      gap: 10,
      width: '100%',
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      gap: 12,
    },
    infoLabel: {
      fontSize: 14,
      fontWeight: '500',
      flexShrink: 0,
      color: colors.text,
    },
    infoValue: {
      fontSize: 14,
      flex: 1,
      textAlign: 'right',
      color: colors.text,
    },
    badge: {
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: 8,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      backgroundColor: colors.card,
    },
    badgePackage: {
      backgroundColor: 'rgba(0, 168, 107, 0.12)',
    },
    badgeText: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.text,
    },
    actionsRow: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 12,
      width: '100%',
    },
    buttonPrimary: {
      flex: 1,
      borderRadius: 10,
      paddingVertical: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
    },
    buttonOutlined: {
      flex: 1,
      borderRadius: 10,
      paddingVertical: 12,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.primary,
    },
    buttonSuccess: {
      flex: 1,
      borderRadius: 10,
      paddingVertical: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#00a86b',
    },
    buttonPrimaryText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '700',
    },
    buttonOutlinedText: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.primary,
    },
    pressed: {
      opacity: 0.88,
    },
  });
}

export type ProductListCardStyles = ReturnType<typeof createProductListCardStyles>;

export function useProductListCardStyles(colors: Theme['colors']) {
  return React.useMemo(
    () => createProductListCardStyles(colors),
    [colors],
  );
}
