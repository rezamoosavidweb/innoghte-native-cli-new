import type { Theme } from '@react-navigation/native';
import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import * as React from 'react';
import {
  Pressable,
  TextInput,
  View,
  type LayoutChangeEvent
} from 'react-native';
import { Text } from '@/shared/ui/Text';

import { GiveGiftDescription } from '@/domains/user/components/giveGift/GiveGiftDescription';
import { GiveGiftLabeledField } from '@/domains/user/components/giveGift/GiveGiftLabeledField';
import { GiftProductMultiPicker } from '@/domains/user/components/giveGift/GiftProductMultiPicker';
import type { GiveGiftFormType } from '@/domains/user/model/giveGiftFormSchema';
import { createGiveGiftStyles } from '@/domains/user/ui/giveGiftScreen.styles';
import type { Course } from '@/domains/courses';
import { pickSemantic, useThemeColors } from '@/ui/theme';
import { createFormFieldStyles } from '@/ui/theme/formField.styles';

export type GiftGiveFormProps = {
  theme: Theme;
  onFormSectionLayout: (e: LayoutChangeEvent) => void;
  onMobileBlockLayout: (e: LayoutChangeEvent) => void;
  control: Control<GiveGiftFormType>;
  errors: FieldErrors<GiveGiftFormType>;
  formField: ReturnType<typeof createFormFieldStyles>;
  mobileDefaults: GiveGiftFormType['mobile'];
  coursesPending: boolean;
  albumsPending: boolean;
  courseOptions: readonly Course[];
  albumOptions: readonly Course[];
  purchasedError: string;
  setPurchasedError: React.Dispatch<React.SetStateAction<string>>;
  interactionBusy: boolean;
  handleSubmitPress: () => void;
};

export const GiftGiveForm = React.memo(function GiftGiveForm({
  theme,
  onFormSectionLayout,
  onMobileBlockLayout,
  control,
  errors,
  formField,
  mobileDefaults,
  coursesPending,
  albumsPending,
  courseOptions,
  albumOptions,
  purchasedError,
  setPurchasedError,
  interactionBusy,
  handleSubmitPress,
}: GiftGiveFormProps) {
  const { colors } = theme;
  const semantic = pickSemantic(theme);
  const uiColors = useThemeColors();
  const styles = createGiveGiftStyles(colors, uiColors, semantic);

  const emailBlock = (
    <View style={styles.emailLabelBlock}>
      <Text style={styles.fieldLabel}>ایمیل هدیه گیرنده</Text>
      <Text style={styles.emailHintDetail}>
        ایمیل دریافت‌کننده را دقیق وارد کنید؛ در صورت خطا، مسئولیت تحویل بر عهده شماست.
      </Text>
    </View>
  );

  return (
    <View style={styles.scrollInner}>
      <Text style={styles.screenTitle}>هدیه به دوستان</Text>

      <GiveGiftDescription styles={styles} />

      <View onLayout={onFormSectionLayout} style={styles.formSection}>
        <View style={styles.nameRow}>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <GiveGiftLabeledField
                label="نام هدیه گیرنده"
                labelStyle={styles.fieldLabel}
                fieldWrapperStyle={styles.halfField}
                error={errors.name?.message}
                errorTextStyle={formField.errorText}
              >
                <TextInput
                  {...field}
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  placeholderTextColor={semantic.textMuted}
                  style={formField.input}
                  textAlign="right"
                />
              </GiveGiftLabeledField>
            )}
          />
          <Controller
            control={control}
            name="family"
            render={({ field }) => (
              <GiveGiftLabeledField
                label="نام خانوادگی هدیه گیرنده"
                labelStyle={styles.fieldLabel}
                fieldWrapperStyle={styles.halfField}
                error={errors.family?.message}
                errorTextStyle={formField.errorText}
              >
                <TextInput
                  {...field}
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  placeholderTextColor={semantic.textMuted}
                  style={formField.input}
                  textAlign="right"
                />
              </GiveGiftLabeledField>
            )}
          />
        </View>

        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <GiveGiftLabeledField
              label={emailBlock}
              labelStyle={styles.fieldLabel}
              error={errors.email?.message}
              errorTextStyle={formField.errorText}
            >
              <TextInput
                {...field}
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="ایمیل هدیه گیرنده"
                placeholderTextColor={semantic.textMuted}
                style={formField.input}
                textAlign="left"
                autoCorrect={false}
              />
            </GiveGiftLabeledField>
          )}
        />

        <View onLayout={onMobileBlockLayout}>
          <Text style={styles.fieldLabelLg}>شماره موبایل هدیه گیرنده</Text>
          <Controller
            control={control}
            name="mobile"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                value={value?.dial ?? ''}
                onChangeText={text =>
                  onChange({
                    dial: text,
                    countryCode: value?.countryCode ?? mobileDefaults.countryCode,
                    dialCode: value?.dialCode ?? mobileDefaults.dialCode,
                  })
                }
                onBlur={onBlur}
                keyboardType="phone-pad"
                placeholderTextColor={semantic.textMuted}
                style={[formField.input, styles.mobileDialInput]}
                autoComplete="tel"
              />
            )}
          />
          {errors.mobile?.dial?.message ? (
            <Text style={formField.errorText}>{errors.mobile.dial.message}</Text>
          ) : null}
        </View>

        <Controller
          control={control}
          name="selectionGroup.courses"
          render={({ field }) => (
            <GiftProductMultiPicker
              label="دوره‌ها"
              loading={coursesPending}
              disabled={interactionBusy}
              options={courseOptions}
              selected={field.value ?? []}
              onChange={next => {
                setPurchasedError('');
                field.onChange(next);
              }}
              styles={styles.picker}
              activityColor={semantic.textMuted}
            />
          )}
        />

        <Controller
          control={control}
          name="selectionGroup.albums"
          render={({ field }) => (
            <GiftProductMultiPicker
              label="آلبوم‌ها"
              loading={albumsPending}
              disabled={interactionBusy}
              options={albumOptions}
              selected={field.value ?? []}
              onChange={next => {
                setPurchasedError('');
                field.onChange(next);
              }}
              styles={styles.picker}
              activityColor={semantic.textMuted}
            />
          )}
        />

        {errors.selectionGroup?.message ? (
          <Text style={formField.errorText}>{errors.selectionGroup.message}</Text>
        ) : null}

        {purchasedError ? (
          <Text style={formField.errorText}>{purchasedError}</Text>
        ) : null}

        <Controller
          control={control}
          name="comment"
          render={({ field }) => (
            <GiveGiftLabeledField
              label="پیام"
              labelStyle={styles.fieldLabel}
              error={undefined}
              errorTextStyle={formField.errorText}
            >
              <TextInput
                style={[formField.input, styles.commentInput]}
                multiline
                maxLength={200}
                value={field.value ?? ''}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                placeholder="اینجا بنویسید..."
                placeholderTextColor={semantic.textMuted}
                textAlign="right"
              />
            </GiveGiftLabeledField>
          )}
        />

        <Pressable
          onPress={handleSubmitPress}
          disabled={interactionBusy}
          accessibilityRole="button"
          style={[
            styles.submitPressable,
            interactionBusy ? styles.submitPressableBusy : styles.submitPressableIdle,
          ]}
        >
          <Text style={styles.submitLabel}>
            {interactionBusy ? 'در حال پردازش…' : 'افزودن به سبد خرید'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
});

GiftGiveForm.displayName = 'GiftGiveForm';
