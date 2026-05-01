import type { Theme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

import { hexAlpha } from '@/ui/theme/utils/colorUtils';

export function createStarPickStyles(colors: Theme['colors']) {
  return StyleSheet.create({
    glyph: {
      fontSize: 22,
      paddingHorizontal: 2,
    },
    glyphFilled: {
      color: colors.primary,
    },
    glyphEmpty: {
      color: hexAlpha(colors.text, 0.27),
    },
  });
}

export function createAvatarInitialStyles(tint: string) {
  return StyleSheet.create({
    letter: {
      fontSize: 18,
      fontWeight: '700',
      color: tint,
    },
  });
}

export function createDashboardCommentCardStyles(colors: Theme['colors']) {
  return StyleSheet.create({
    cardBorder: {
      borderColor: colors.border,
      backgroundColor: hexAlpha(colors.card, 0.8),
    },
    avatarBg: {
      backgroundColor: hexAlpha(colors.border, 0.27),
    },
    starRow: {
      flexDirection: 'row',
    },
    starGlyph: {
      color: colors.primary,
      fontSize: 14,
    },
    userName: {
      color: colors.text,
    },
    commentBody: {
      color: colors.text,
    },
  });
}

export function createDashboardFormStyles(colors: Theme['colors']) {
  return StyleSheet.create({
    formLabel: {
      color: colors.text,
    },
    textarea: {
      color: colors.text,
      borderColor: colors.border,
      backgroundColor: colors.card,
    },
    ratingLabel: {
      color: colors.text,
    },
    submitBg: {
      backgroundColor: colors.primary,
    },
    submitOpacityDisabled: { opacity: 0.6 },
    submitOpacityPressed: { opacity: 0.88 },
    submitOpacityIdle: { opacity: 1 },
  });
}
