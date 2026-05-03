import { Text } from '@/shared/ui/Text';
import * as React from 'react';
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  TextInput,
  View,
  type ListRenderItem,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemeColors } from '@/ui/theme';

import { createPhoneInputStyles } from './PhoneInput.styles';
import {
  PHONE_COUNTRIES,
  countryFlagEmoji,
  formatDialCode,
  getCountryByIso,
  type PhoneCountry,
} from './phoneCountries';

export type PhoneInputValue = {
  dial: string;
  countryCode: string;
  dialCode: string;
};

export type PhoneInputProps = {
  value?: PhoneInputValue;
  onChange: (value: PhoneInputValue) => void;
  /** Forwarded to the national-number `TextInput` (e.g. RHF `onBlur`). */
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  /** Hide picker; locks country (e.g. Iran-only build). */
  disableDropdown?: boolean;
  /** When set with no `error`, draws success border (matches touched + valid). */
  touched?: boolean;
  /** Lowercase ISO2; defaults using `REACT_NATIVE_IS_DOT_IR` → ir vs us. */
  defaultCountryIso?: string;
  autoFocus?: boolean;
  /** Accessibility / i18n label for the dial TextInput. */
  accessibilityLabelDial?: string;
  accessibilityLabelCountry?: string;
};

function defaultIsoFromEnv(): string {
  return process.env.REACT_NATIVE_IS_DOT_IR === 'ir' ? 'ir' : 'us';
}

/** Default country/dial when `value` is empty — Iran (+98) when `REACT_NATIVE_IS_DOT_IR=ir`. */
export function defaultPhoneInputValue(): PhoneInputValue {
  return process.env.REACT_NATIVE_IS_DOT_IR === 'ir'
    ? { dial: '', countryCode: 'ir', dialCode: '+98' }
    : { dial: '', countryCode: 'us', dialCode: '+1' };
}

function normalizeDialInput(raw: string): string {
  return raw.replace(/\D/g, '');
}

const PickerRow = React.memo(function PickerRow({
  item,
  onPick,
  styles,
}: {
  item: PhoneCountry;
  onPick: (c: PhoneCountry) => void;
  styles: ReturnType<typeof createPhoneInputStyles>;
}) {
  const onPress = React.useCallback(() => {
    onPick(item);
  }, [item, onPick]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${item.name}, ${formatDialCode(item.dialDigits)}`}
      onPress={onPress}
      style={styles.listRow}
    >
      <Text style={styles.listRowFlag}>{countryFlagEmoji(item.iso2)}</Text>
      <View style={styles.listRowBody}>
        <Text style={styles.listRowName}>{item.name}</Text>
        <Text style={styles.listRowDial}>
          {formatDialCode(item.dialDigits)}
        </Text>
      </View>
    </Pressable>
  );
});

function PhoneInputInner({
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  placeholder = '',
  disableDropdown = false,
  touched = false,
  defaultCountryIso,
  autoFocus = false,
  accessibilityLabelDial = 'Phone number',
  accessibilityLabelCountry = 'Select country',
}: PhoneInputProps) {
  const colors = useThemeColors();
  const s = React.useMemo(() => createPhoneInputStyles(colors), [colors]);

  const [modalOpen, setModalOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');

  const baseIso = defaultCountryIso?.toLowerCase() ?? defaultIsoFromEnv();
  const selected =
    (value?.countryCode && getCountryByIso(value.countryCode)) ||
    getCountryByIso(baseIso) ||
    getCountryByIso('ir')!;

  const dial = value?.dial ?? '';
  const displayDialCode =
    value?.dialCode && value.dialCode.length > 0
      ? value.dialCode
      : formatDialCode(selected.dialDigits);

  const showValid = Boolean(touched && !error);
  const showError = Boolean(error);

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      return PHONE_COUNTRIES;
    }
    return PHONE_COUNTRIES.filter(c => {
      if (c.name.toLowerCase().includes(q)) return true;
      if (c.iso2.includes(q)) return true;
      if (c.dialDigits.includes(q)) return true;
      if (formatDialCode(c.dialDigits).toLowerCase().includes(q)) {
        return true;
      }
      return false;
    });
  }, [search]);

  const emit = React.useCallback(
    (next: PhoneInputValue) => {
      const digits = next.dialCode.replace(/\D/g, '');
      onChange({
        dial: next.dial,
        countryCode: next.countryCode.toLowerCase(),
        dialCode: formatDialCode(digits),
      });
    },
    [onChange],
  );

  const onDialChange = React.useCallback(
    (text: string) => {
      emit({
        dial: normalizeDialInput(text),
        countryCode: selected.iso2,
        dialCode: formatDialCode(selected.dialDigits),
      });
    },
    [emit, selected.iso2, selected.dialDigits],
  );

  const pickCountry = React.useCallback(
    (c: PhoneCountry) => {
      emit({
        dial,
        countryCode: c.iso2,
        dialCode: formatDialCode(c.dialDigits),
      });
      setModalOpen(false);
      setSearch('');
    },
    [dial, emit],
  );

  const openPicker = React.useCallback(() => {
    if (!disableDropdown && !disabled) {
      setModalOpen(true);
    }
  }, [disableDropdown, disabled]);

  const closePicker = React.useCallback(() => {
    setModalOpen(false);
    setSearch('');
  }, []);

  const renderItem = React.useCallback<ListRenderItem<PhoneCountry>>(
    ({ item }) => (
      <PickerRow item={item} onPick={pickCountry} styles={s} />
    ),
    [pickCountry, s],
  );

  const keyExtractor = React.useCallback((item: PhoneCountry) => item.iso2, []);

  return (
    <View style={s.wrap}>
      <View
        style={[
          s.row,
          s.ltrRow,
          disabled ? s.rowDisabled : null,
          showError ? s.rowError : null,
          showValid ? s.rowValid : null,
        ]}
      >
        {disableDropdown ? (
          <View
            accessibilityLabel={accessibilityLabelCountry}
            style={[s.countrySide, s.countrySideLocked]}
          >
            <Text style={s.flag}>{countryFlagEmoji(selected.iso2)}</Text>
            <Text style={s.dialPrefix}>{displayDialCode}</Text>
          </View>
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabelCountry}
            accessibilityState={{ disabled }}
            disabled={disabled}
            onPress={openPicker}
            style={s.countrySide}
          >
            <Text style={s.flag}>{countryFlagEmoji(selected.iso2)}</Text>
            <Text style={s.dialPrefix}>{displayDialCode}</Text>
            <Text style={s.chevron}>▾</Text>
          </Pressable>
        )}
        <TextInput
          accessibilityLabel={accessibilityLabelDial}
          autoComplete="tel-national"
          autoCorrect={false}
          autoFocus={autoFocus}
          editable={!disabled}
          keyboardType="phone-pad"
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          textContentType="telephoneNumber"
          value={dial}
          onChangeText={onDialChange}
          onBlur={onBlur}
          style={s.input}
        />
      </View>
      {error ? <Text style={s.errorText}>{error}</Text> : null}

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalOpen}
        onRequestClose={closePicker}
      >
        <SafeAreaView style={s.modalRoot} edges={['top', 'bottom']}>
          <View style={s.modalHeader}>
            <Text style={s.modalTitle}>Country</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              onPress={closePicker}
              style={s.closeBtn}
            >
              <Text style={s.closeBtnLabel}>Done</Text>
            </Pressable>
          </View>
          <TextInput
            accessibilityLabel="Search countries"
            autoCorrect={false}
            placeholder="Search"
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
            style={s.search}
          />
          <FlatList
            data={filtered}
            keyExtractor={keyExtractor}
            keyboardShouldPersistTaps="handled"
            initialNumToRender={14}
            maxToRenderPerBatch={12}
            windowSize={5}
            removeClippedSubviews={Platform.OS === 'android'}
            renderItem={renderItem}
            ListEmptyComponent={
              <View style={s.listRow}>
                <Text style={s.listRowName}>No matches</Text>
              </View>
            }
            contentContainerStyle={s.listContent}
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
}

export const PhoneInput = React.memo(PhoneInputInner);
PhoneInput.displayName = 'PhoneInput';
