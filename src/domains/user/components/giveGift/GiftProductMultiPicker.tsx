import * as React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import type { CatalogItem } from '@/domains/courses';
import type { GiveGiftPickerStyles } from '@/domains/user/ui/giveGiftScreen.styles';
import { Text } from '@/shared/ui/Text';
import { BottomSheet } from '@/ui/components/BottomSheet';
import { Button } from '@/ui/components/Button';

export type GiftProductMultiPickerProps = {
  label: string;
  disabled?: boolean;
  loading: boolean;
  options: readonly CatalogItem[];
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
  const [open, setOpen] = React.useState(false);

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

  const selectedOptions = React.useMemo(
    () => options.filter(item => selected.includes(String(item.id))),
    [options, selected],
  );

  const close = React.useCallback(() => setOpen(false), []);

  return (
    <View style={pickerStyles.block}>
      <Text style={pickerStyles.label}>{label}</Text>
      <Pressable
        disabled={disabled || loading}
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={`${label}، انتخاب چندگانه`}
        accessibilityState={{ disabled: disabled || loading, expanded: open }}
        style={({ pressed }) => [
          pickerStyles.trigger,
          pressed ? pickerStyles.triggerPressed : undefined,
          disabled ? pickerStyles.optionDisabled : undefined,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={activityColor} />
        ) : selectedOptions.length > 0 ? (
          <View style={pickerStyles.chipWrap}>
            {selectedOptions.map(item => (
              <View key={String(item.id)} style={pickerStyles.chip}>
                <Text style={pickerStyles.chipText}>{item.title_fa}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={pickerStyles.triggerPlaceholder}>انتخاب...</Text>
        )}
      </Pressable>

      <BottomSheet
        visible={open}
        onClose={close}
        closeAccessibilityLabel={`بستن انتخاب ${label}`}
        cardStyle={pickerStyles.sheet}
      >
        <View style={pickerStyles.sheetHeader}>
          <Text style={pickerStyles.sheetTitle}>{label}</Text>
          <Text style={pickerStyles.sheetCount}>
            {selected.length > 0
              ? `${selected.length} مورد انتخاب شده`
              : 'چند مورد را انتخاب کنید'}
          </Text>
        </View>

        <ScrollView
          style={pickerStyles.optionScroll}
          contentContainerStyle={pickerStyles.optionList}
          keyboardShouldPersistTaps="handled"
        >
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
                accessibilityRole="button"
                accessibilityState={{ selected: selectedRow }}
                style={optionSurface}
              >
                <Text
                  style={[
                    pickerStyles.optionText,
                    selectedRow ? pickerStyles.optionTextSelected : undefined,
                  ]}
                >
                  {item.title_fa}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <Button
          layout="auto"
          variant="filled"
          title="تایید انتخاب‌ها"
          onPress={close}
          style={pickerStyles.doneButton}
        />
      </BottomSheet>
    </View>
  );
}
