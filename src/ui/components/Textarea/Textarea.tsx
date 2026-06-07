import * as React from 'react';
import { TextInput, View, type StyleProp, type ViewStyle } from 'react-native';
import { Text } from '@/shared/ui/Text';

import { useThemeColors } from '@/ui/theme';

import { createTextareaStyles } from './Textarea.styles';

const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const toFaDigits = (s: string): string =>
  s.replace(/\d/g, d => FA_DIGITS[Number(d)] ?? d);

export type TextareaProps = {
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  /** When set, enforces the limit and shows a live remaining-character counter. */
  maxLength?: number;
  placeholder?: string;
  error?: string;
  minHeight?: number;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Shared multi-line text field. When `maxLength` is set it shows a counter that
 * starts at `maxLength` and counts down as the user types (characters remaining).
 * Use this for every textarea instead of a raw multiline `TextInput`.
 */
export const Textarea = React.memo(function Textarea({
  value,
  onChangeText,
  onBlur,
  maxLength,
  placeholder,
  error,
  minHeight,
  accessibilityLabel,
  style,
}: TextareaProps) {
  const colors = useThemeColors();
  const s = createTextareaStyles(colors);

  const remaining =
    maxLength != null ? Math.max(0, maxLength - value.length) : null;

  return (
    <View style={style}>
      <View style={[s.wrap, error ? s.wrapError : null]}>
        <TextInput
          style={[s.input, minHeight != null ? { minHeight } : null]}
          multiline
          maxLength={maxLength}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          accessibilityLabel={accessibilityLabel}
          textAlignVertical="top"
        />
      </View>
      {error || remaining != null ? (
        <View style={s.footer}>
          {error ? <Text style={s.error}>{error}</Text> : <View style={{ flex: 1 }} />}
          {remaining != null ? (
            <Text style={s.counter}>{toFaDigits(String(remaining))} کاراکتر</Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
});
Textarea.displayName = 'Textarea';
