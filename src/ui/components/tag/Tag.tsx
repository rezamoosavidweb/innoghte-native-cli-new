import { Text } from '@/shared/ui/Text';
import type { ThemeColors } from '@/ui/theme';
import { useThemeColors } from '@/ui/theme';
import React from 'react';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import { createTagStyles } from './Tag.style';

export type TagColor = 'primary' | 'success' | 'error' | 'info' | 'warning';
export type TagVariant = 'fill' | 'outlined';

/**
 * Maps tag tone to a {@link ThemeColors} key. There is no dedicated `warning`
 * semantic yet; `accent` is the closest attention token.
 */
const TAG_COLOR_THEME_KEY = {
  primary: 'primary',
  success: 'success',
  error: 'error',
  info: 'info',
  warning: 'accent',
} as const satisfies Record<TagColor, keyof ThemeColors>;

function resolveTagAccent(theme: ThemeColors, color: TagColor): string {
  return theme[TAG_COLOR_THEME_KEY[color]];
}

export interface TagProps {
  onPress?: () => void;
  title: string;
  style?: StyleProp<ViewStyle>;
  /** @default 'primary' */
  color?: TagColor;
  variant?: TagVariant;
}

export const TagComponent = ({
  onPress,
  title,
  style,
  color = 'primary',
  variant = 'fill',
}: TagProps) => {
  const theme = useThemeColors();
  const accent = resolveTagAccent(theme, color);
  const s = createTagStyles(theme, accent, variant);
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={[s.tag, style]}>
        <Text style={s.tagText}>{title}</Text>
      </Pressable>
    );
  }
  return (
    <View style={[s.tag, style]}>
      <Text style={s.tagText}>{title}</Text>
    </View>
  );
};

export const Tag = React.memo(TagComponent);
Tag.displayName = 'Tag';
