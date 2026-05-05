import { Text } from '@/shared/ui/Text';
import * as React from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  View,
  type PressableProps,
  type PressableStateCallbackType,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { useThemeColors } from '@/ui/theme';

import { createButtonStyles } from './Button.styles';

/** Supports static styles, arrays, and Pressable-style callbacks (e.g. banner cards). */
export type ButtonStyleProp =
  | StyleProp<ViewStyle>
  | ((state: PressableStateCallbackType) => StyleProp<ViewStyle>);

export type ButtonProps = {
  /** Visible label when `children` is omitted; always used as fallback for `accessibilityLabel`. */
  title?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityState?: PressableProps['accessibilityState'];
  hitSlop?: PressableProps['hitSlop'];
  variant?: 'filled' | 'outlined' | 'text';
  /** When set, replaces the default title `Text` (use `title` / `accessibilityLabel` for screen readers). */
  children?: React.ReactNode;
  /**
   * `form` keeps shared form control width/height.
   * `auto` drops fixed width/height so custom `style` / `children` can control layout (e.g. list rows, toolbars).
   */
  layout?: 'form' | 'auto';
  contentStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ButtonStyleProp;
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

function shellForLayout(shell: ViewStyle, layout: 'form' | 'auto'): ViewStyle {
  if (layout === 'form') {
    return shell;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { width, height, ...rest }: ViewStyle = { ...shell };
  return {
    ...rest,
    minHeight: 48,
    alignSelf: 'stretch' as const,
  };
}

function ButtonInner({
  title,
  accessibilityLabel: accessibilityLabelProp,
  accessibilityHint,
  accessibilityState: accessibilityStateProp,
  hitSlop,
  variant = 'filled',
  children,
  layout = 'form',
  contentStyle,
  onPress,
  disabled = false,
  loading = false,
  style,
}: ButtonProps) {
  const colors = useThemeColors();
  const s = React.useMemo(() => createButtonStyles(colors), [colors]);

  const isInactive = disabled || loading;

  const { shell: shellBase, label } = shellAndLabel(variant, s);
  const shell = React.useMemo(
    () => shellForLayout(shellBase, layout),
    [shellBase, layout],
  );

  const a11yLabel = accessibilityLabelProp ?? title;

  const indicatorColor = variant === 'filled' ? '#fff' : colors.primary;

  const androidRipple =
    Platform.OS === 'android' && !isInactive
      ? variant === 'filled'
        ? { color: 'rgba(255,255,255,0.22)', foreground: true }
        : { color: 'rgba(0,0,0,0.08)', foreground: true }
      : undefined;

  const mergedAccessibilityState = React.useMemo(
    () => ({
      ...accessibilityStateProp,
      disabled: accessibilityStateProp?.disabled ?? isInactive,
      busy: accessibilityStateProp?.busy ?? loading,
    }),
    [accessibilityStateProp, isInactive, loading],
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={mergedAccessibilityState}
      hitSlop={hitSlop}
      disabled={isInactive}
      onPress={onPress}
      android_ripple={androidRipple}
      style={state => {
        const resolved =
          typeof style === 'function' ? style(state) : style;
        return [
          shell,
          isInactive ? s.disabled : null,
          !isInactive && state.pressed ? s.pressed : null,
          resolved,
        ];
      }}
    >
      <View style={[s.content, contentStyle]}>
        {children ? (
          <View style={loading ? s.labelHidden : null} pointerEvents="box-none">
            {children}
          </View>
        ) : (
          <Text
            style={[label, loading ? s.labelHidden : null]}
            numberOfLines={1}
          >
            {title}
          </Text>
        )}
        {loading ? (
          <View
            style={s.loaderOverlay}
            pointerEvents="none"
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            <ActivityIndicator color={indicatorColor} size="small" />
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

export const Button = React.memo(ButtonInner);
Button.displayName = 'Button';
