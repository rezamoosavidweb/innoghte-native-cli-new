import { Text } from '@/shared/ui/Text';
import * as React from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  View,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { useThemeColors } from '@/ui/theme';

import { createButtonStyles } from './Button.styles';

export type ButtonProps = {
  title: string;
  variant?: 'filled' | 'outlined' | 'text';
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
};

function shellAndLabel(
  variant: 'filled' | 'outlined' | 'text',
  s: ReturnType<typeof createButtonStyles>,
): { shell: ViewStyle; label: TextStyle } {
  switch (variant) {
    case 'outlined':
      return { shell: s.outlined, label: s.outlinedLabel };
    case 'text':
      return { shell: s.text, label: s.textLabel };
    default:
      return { shell: s.filled, label: s.filledLabel };
  }
}

function ButtonInner({
  title,
  variant = 'filled',
  onPress,
  disabled = false,
  loading = false,
  style,
}: ButtonProps) {
  const colors = useThemeColors();
  const s = React.useMemo(() => createButtonStyles(colors), [colors]);

  const isInactive = disabled || loading;

  const { shell, label } = shellAndLabel(variant, s);

  const indicatorColor =
    variant === 'filled' ? '#fff' : colors.primary;

  const androidRipple =
    Platform.OS === 'android' && !isInactive
      ? variant === 'filled'
        ? { color: 'rgba(255,255,255,0.22)', foreground: true }
        : { color: 'rgba(0,0,0,0.08)', foreground: true }
      : undefined;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isInactive, busy: loading }}
      disabled={isInactive}
      onPress={onPress}
      android_ripple={androidRipple}
      style={({ pressed }) => [
        shell,
        isInactive ? s.disabled : null,
        !isInactive && pressed ? s.pressed : null,
        style,
      ]}
    >
      <View style={s.content}>
        {loading ? (
          <ActivityIndicator color={indicatorColor} size="small" />
        ) : (
          <Text style={label}>{title}</Text>
        )}
      </View>
    </Pressable>
  );
}

export const Button = React.memo(ButtonInner);
Button.displayName = 'Button';
