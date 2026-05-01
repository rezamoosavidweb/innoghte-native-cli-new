import type { Theme as NavigationTheme } from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet } from 'react-native';

import {
  colors as colorPrimitives,
  fontSize,
  fontWeight,
  radius,
  spacing,
} from '@/ui/theme';
import type { ThemeColors } from '@/ui/theme/types';

export const staticDrawerStyles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  profileSectionBase: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing['3xl'],
    paddingVertical: spacing.base,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  avatarText: {
    color: colorPrimitives.white,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  profileInfo: {
    marginLeft: 14,
    flex: 1,
  },
  dividerHairline: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: spacing.md,
  },
  scrollContent: {
    paddingTop: spacing.sm,
  },
  footer: {
    paddingBottom: spacing.sm,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: spacing['3xl'],
  },
  footerIconGlyph: {
    fontSize: fontSize.lg,
    marginRight: spacing.md - 2,
  },
  footerItemTextBase: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  versionBase: {
    fontSize: fontSize.sm,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: spacing.sm,
  },
});

export function useCustomDrawerDynamicStyles(
  colors: NavigationTheme['colors'],
  s: ThemeColors,
  isDrawerOnRight: boolean,
) {
  return React.useMemo(
    () => ({
      profileSection: [
        staticDrawerStyles.profileSectionBase,
        { backgroundColor: s.drawerMutedSurface },
      ],
      avatar: [
        staticDrawerStyles.avatar,
        {
          backgroundColor: s.drawerActiveTint,
          borderColor: s.drawerActiveTint,
        },
      ],
      userName: {
        fontSize: fontSize.base + 1,
        fontWeight: fontWeight.bold,
        color: colors.text,
      },
      userEmail: {
        fontSize: fontSize.md,
        color: s.textSecondary,
        marginTop: 2,
      },
      divider: [
        staticDrawerStyles.dividerHairline,
        { backgroundColor: colors.border },
      ],
      footerIconGlyph: [
        staticDrawerStyles.footerIconGlyph,
        { color: s.danger },
      ],
      footerItemText: [
        staticDrawerStyles.footerItemTextBase,
        { color: s.danger },
      ],
      version: [staticDrawerStyles.versionBase, { color: s.textMuted }],
      sheet: {
        flex: 1,
        backgroundColor: colors.card,
        borderTopLeftRadius: isDrawerOnRight ? radius['2xl'] : 0,
        borderBottomLeftRadius: isDrawerOnRight ? radius['2xl'] : 0,
        borderTopRightRadius: isDrawerOnRight ? 0 : radius['2xl'],
        borderBottomRightRadius: isDrawerOnRight ? 0 : radius['2xl'],
        overflow: 'hidden' as const,
      },
    }),
    [
      colors.border,
      colors.card,
      colors.text,
      isDrawerOnRight,
      s.danger,
      s.drawerActiveTint,
      s.drawerMutedSurface,
      s.textMuted,
      s.textSecondary,
    ],
  );
}
