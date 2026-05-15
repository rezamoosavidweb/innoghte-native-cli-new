import type { ThemeColors } from '@/ui/theme/types';
import { StyleSheet } from 'react-native';
import type { TagVariant } from './Tag';
import { fontSize, fontWeight, radius, spacing } from '@/ui/theme';

export function createTagStyles(
  theme: ThemeColors,
  accent: string,
  variant: TagVariant,
) {
  if (variant === 'fill') {
    return StyleSheet.create({
      tag: {
        backgroundColor: accent,
        color: theme.text,
        borderRadius: radius.sm,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs / 2,
      },
      tagText: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.semibold,
        color: theme.text,
      },
    });
  }
  return StyleSheet.create({
    tag: {
      backgroundColor: 'transparent',
      borderRadius: radius.sm,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs / 2,
      borderWidth: StyleSheet.hairlineWidth,
      borderStyle: 'solid',
      borderColor: accent,
    },
    tagText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.semibold,
      color: accent,
    },
  });
}
