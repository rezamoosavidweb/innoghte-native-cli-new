import type { Theme } from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet, type ViewStyle } from 'react-native';

import type { HubMenuRowStyleSet } from '@/ui/components/HubMenuRow';
import {
  fontSize,
  fontWeight,
  pickSemantic,
  radius,
  spacing,
} from '@/ui/theme';
import { palette } from '@/ui/theme/colors';

export type ProfileScreenShellStyleSet = ReturnType<typeof createProfileShellStyles>;

export type ProfileScreenMenuStyleSet = HubMenuRowStyleSet & {
  list: { gap: number };
  scrollContent: ViewStyle;
  loadedStack: { gap: number };
  sectionSpacing: { marginTop: number };
};

export type ProfileHeaderStyleSet = ReturnType<typeof createProfileHeaderStyles>;

function createProfileShellStyles(
  colors: Theme['colors'],
  sSemantic: ReturnType<typeof pickSemantic>,
) {
  return StyleSheet.create({
    centered: {
      minHeight: 120,
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.md,
      width: '100%',
      maxWidth: 440,
    },
    errorTitleAlign: {
      textAlign: 'center',
      alignSelf: 'center',
    },
    errorRetryDisabled: {
      opacity: 0.5,
    },
    accountMeta: {
      gap: spacing.xs,
      paddingTop: spacing.sm,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
    },
    accountMetaLabel: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.semibold,
      color: sSemantic.textSecondary,
    },
    accountMetaValue: {
      fontSize: fontSize.sm,
      color: colors.text,
      writingDirection: 'ltr',
    },
    accountMetaFooter: {
      fontSize: fontSize.sm,
      color: sSemantic.textMuted,
    },
  });
}

function createProfileHeaderStyles(
  colors: Theme['colors'],
  sSemantic: ReturnType<typeof pickSemantic>,
) {
  return StyleSheet.create({
    surface: {
      width: '100%',
      backgroundColor: colors.card,
      borderRadius: radius.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      padding: spacing['2xl'],
      gap: spacing.lg,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.lg,
    },
    avatar: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: sSemantic.tabActive,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarImage: {
      width: 72,
      height: 72,
      borderRadius: 36,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    initials: {
      color: palette.white,
      fontSize: fontSize['2xl'],
      fontWeight: fontWeight.bold,
    },
    nameColumn: {
      flex: 1,
      minWidth: 0,
      gap: spacing.sm,
    },
    fullName: {
      fontSize: fontSize['2xl'],
      fontWeight: fontWeight.bold,
      color: colors.text,
    },
    infoRows: {
      gap: spacing.xs,
    },
    userInfoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      minHeight: fontSize.base + fontSize.sm + spacing.xs,
    },
    userInfoTextBlock: {
      flex: 1,
      minWidth: 0,
      gap: 2,
    },
    userInfoLabel: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.semibold,
      color: sSemantic.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.3,
    },
    userInfoValue: {
      fontSize: fontSize.sm,
      color: sSemantic.textSecondary,
      writingDirection: 'ltr',
    },
    userInfoTrailing: {
      flexShrink: 0,
      minWidth: 96,
      maxWidth: '44%',
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
    needsVerificationButton: {
      paddingVertical: 6,
      paddingHorizontal: 8,
      borderRadius: radius.sm,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: palette.primary[500],
      backgroundColor: 'transparent',
    },
    needsVerificationButtonPressed: {
      opacity: 0.82,
    },
    needsVerificationLabel: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.semibold,
      color: palette.primary[500],
      textAlign: 'right',
    },
    actionRow: {
      flexDirection: 'row',
      alignItems: 'stretch',
      gap: spacing.sm,
    },
    actionButton: {
      flex: 1,
      minWidth: 0,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xs,
      borderRadius: radius.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      backgroundColor: colors.card,
      alignItems: 'center',
      justifyContent: 'center',
    },
    actionButtonPressed: {
      opacity: 0.88,
    },
    actionButtonLabel: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.semibold,
      color: colors.text,
      textAlign: 'center',
    },
  });
}

function createMenuStyles(
  themeColors: Theme['colors'],
): ProfileScreenMenuStyleSet {
  return {
    menuRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 14,
      paddingHorizontal: 14,
      borderRadius: radius.lg,
      borderWidth: StyleSheet.hairlineWidth,
      backgroundColor: themeColors.card,
      borderColor: themeColors.border,
    },
    menuRowPressed: { opacity: 0.92 },
    menuRowLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      flex: 1,
    },
    menuIcon: { fontSize: fontSize['2xl'] },
    menuTitle: {
      fontSize: fontSize.base,
      fontWeight: fontWeight.semibold,
      color: themeColors.text,
    },
    chevron: {
      fontSize: fontSize['2xl'],
      fontWeight: fontWeight.light,
      opacity: 0.55,
      color: themeColors.text,
    },
    list: {
      gap: spacing.md,
    },
    scrollContent: {
      flexGrow: 1,
      padding: spacing.xl,
    },
    loadedStack: {
      gap: spacing.lg,
    },
    sectionSpacing: {
      marginTop: spacing.sm,
    },
  };
}

export function useProfileShellStyles(colors: Theme['colors'], theme: Theme) {
  const sSemantic = pickSemantic(theme);
  return React.useMemo(
    () => createProfileShellStyles(colors, sSemantic),
    [colors, sSemantic],
  );
}

export function useProfileHeaderStyles(colors: Theme['colors'], theme: Theme) {
  const sSemantic = pickSemantic(theme);
  return React.useMemo(
    () => createProfileHeaderStyles(colors, sSemantic),
    [colors, sSemantic],
  );
}

export function useProfileMenuStyles(colors: Theme['colors']) {
  return React.useMemo(() => createMenuStyles(colors), [colors]);
}
