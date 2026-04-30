import * as React from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import type { Course } from '@/domains/courses';
import type { GiveGiftPickerStyles } from '@/domains/user/ui/giveGiftScreen.styles';

export type GiftProductMultiPickerProps = {
  label: string;
  disabled?: boolean;
  loading: boolean;
  options: readonly Course[];
  selected: string[];
  onChange: (next: string[]) => void;
  styles: GiveGiftPickerStyles;
  activityColor: string;
};

export function GiftProductMultiPicker({
  label,
  disabled,
  loading,
  options,
  selected,
  onChange,
  styles: pickerStyles,
  activityColor,
}: GiftProductMultiPickerProps) {
  const toggle = React.useCallback(
    (id: string) => {
      if (disabled) return;
      const set = new Set(selected);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      onChange([...set]);
    },
    [disabled, onChange, selected],
  );

  return (
    <View style={pickerStyles.block}>
      <Text style={pickerStyles.label}>{label}</Text>
      {loading ? (
        <ActivityIndicator color={activityColor} />
      ) : (
        <View style={pickerStyles.optionList}>
          {options.map(item => {
            const idStr = String(item.id);
            const selectedRow = selected.includes(idStr);
            const optionSurface: StyleProp<ViewStyle> = [
              pickerStyles.optionBase,
              selectedRow ? pickerStyles.optionOn : pickerStyles.optionOff,
              disabled ? pickerStyles.optionDisabled : undefined,
            ];
            return (
              <Pressable
                key={idStr}
                disabled={disabled}
                onPress={() => toggle(idStr)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: selectedRow }}
                style={optionSurface}
              >
                <Text style={pickerStyles.optionText}>
                  {selectedRow ? '☑ ' : '☐ '}
                  {item.title_fa}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}
