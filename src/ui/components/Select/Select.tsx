import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { Text } from '@/shared/ui/Text';

import { BottomSheet } from '@/ui/components/BottomSheet';
import { Button } from '@/ui/components/Button';
import { useThemeColors } from '@/ui/theme';

import { createSelectStyles } from './Select.styles';

export type SelectOption = { value: string; label: string };

export type SelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder: string;
  error?: string;
  disabled?: boolean;
  /** Options still loading (async sources). */
  loading?: boolean;
  loadingLabel?: string;
  /** Options failed to load — shows `errorLabel` as a tappable retry. */
  isError?: boolean;
  errorLabel?: string;
  onRetry?: () => void;
  /** Shown when options are empty (and not loading/error). */
  emptyLabel?: string;
  accessibilityLabel?: string;
  /** Label for the dismiss backdrop of the picker sheet. */
  closeAccessibilityLabel?: string;
};

/**
 * Single-select field: a themed trigger box that opens a bottom-sheet list of
 * options (built on {@link BottomSheet}). Use for every dropdown/select across
 * the app so selection UX (slide-up sheet, tap-to-dismiss, selected highlight)
 * stays consistent. Supports async option sources via loading/error/empty.
 */
export const Select = React.memo(function Select({
  value,
  onChange,
  options,
  placeholder,
  error,
  disabled = false,
  loading = false,
  loadingLabel,
  isError = false,
  errorLabel,
  onRetry,
  emptyLabel,
  accessibilityLabel,
  closeAccessibilityLabel,
}: SelectProps) {
  const colors = useThemeColors();
  const s = React.useMemo(() => createSelectStyles(colors), [colors]);
  const [open, setOpen] = React.useState(false);

  const selected = React.useMemo(
    () => options.find(o => o.value === value),
    [options, value],
  );

  const close = React.useCallback(() => setOpen(false), []);

  const body = (() => {
    if (loading) {
      return <Text style={s.stateText}>{loadingLabel}</Text>;
    }
    if (isError) {
      return (
        <Button
          layout="auto"
          variant="text"
          title={errorLabel ?? ''}
          onPress={() => onRetry?.()}
          contentStyle={{ width: '100%' }}
        >
          <Text style={s.stateText}>{errorLabel}</Text>
        </Button>
      );
    }
    if (options.length === 0) {
      return <Text style={s.stateText}>{emptyLabel}</Text>;
    }
    return options.map(o => (
      <Button
        key={o.value}
        layout="auto"
        variant="text"
        title={o.label}
        style={s.row}
        accessibilityState={{ selected: o.value === value }}
        onPress={() => {
          onChange(o.value);
          close();
        }}
        contentStyle={{ width: '100%', alignItems: 'flex-end' }}
      >
        <Text
          style={[s.rowLabel, o.value === value ? s.rowLabelSelected : null]}
        >
          {o.label}
        </Text>
      </Button>
    ));
  })();

  return (
    <View>
      <Button
        layout="auto"
        variant="text"
        title={selected?.label ?? placeholder}
        accessibilityLabel={accessibilityLabel ?? placeholder}
        accessibilityState={{ disabled }}
        disabled={disabled}
        style={[s.trigger, error ? s.triggerError : null]}
        onPress={() => setOpen(true)}
        contentStyle={{ width: '100%' }}
      >
        <View style={s.triggerRow}>
          <Text
            numberOfLines={1}
            style={selected ? s.triggerLabel : s.triggerPlaceholder}
          >
            {selected?.label ?? placeholder}
          </Text>
          <Text style={s.chevron}>▾</Text>
        </View>
      </Button>
      {error ? <Text style={s.error}>{error}</Text> : null}

      <BottomSheet
        visible={open}
        onClose={close}
        closeAccessibilityLabel={closeAccessibilityLabel}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={s.scroll}
          contentContainerStyle={s.scrollContent}
        >
          {body}
        </ScrollView>
      </BottomSheet>
    </View>
  );
});

Select.displayName = 'Select';
