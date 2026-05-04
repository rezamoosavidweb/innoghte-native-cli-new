import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import type { Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import {TextInput, View} from 'react-native';
import { Text } from '@/shared/ui/Text';

import { useDonationCreditCardFieldsStyles } from '@/domains/donation/ui/donationCreditCardFields.styles';
import type { DonationFormType } from '@/domains/donation/model/donationForm.schema';
import {
  donationCartOptions,
  type DonationCreditCartErrors,
} from '@/domains/donation/model/donationForm.schema';
import { formatCardNumber } from '@/domains/donation/utils/paymentFormatting';
import { pickSemantic } from '@/ui/theme';
import { Button } from '@/ui/components/Button';

export type DonationCreditCardFieldsProps = {
  control: Control<DonationFormType>;
  errors: DonationCreditCartErrors;
};

export const DonationCreditCardFields = React.memo(
  function DonationCreditCardFields({
    control,
    errors,
  }: DonationCreditCardFieldsProps) {
    const theme = useTheme();
    const semantic = pickSemantic(theme);

    const s = useDonationCreditCardFieldsStyles(semantic);

    return (
      <View style={s.grid}>
        <View style={s.row2}>
          <View style={s.flex1}>
            <Controller
              name="cart.fistName"
              control={control}
              render={({ field }) => (
                <View style={s.field}>
                  <Text style={s.label}>نام</Text>
                  <TextInput
                    style={s.input}
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    placeholderTextColor={semantic.textMuted}
                  />
                  {errors.cart?.fistName?.message ? (
                    <Text style={s.error}>{errors.cart.fistName.message}</Text>
                  ) : null}
                </View>
              )}
            />
          </View>
          <View style={s.flex1}>
            <Controller
              name="cart.lastName"
              control={control}
              render={({ field }) => (
                <View style={s.field}>
                  <Text style={s.label}>نام خانوادگی</Text>
                  <TextInput
                    style={s.input}
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    placeholderTextColor={semantic.textMuted}
                  />
                  {errors.cart?.lastName?.message ? (
                    <Text style={s.error}>{errors.cart.lastName.message}</Text>
                  ) : null}
                </View>
              )}
            />
          </View>
        </View>

        <Controller
          name="cart.cardType"
          control={control}
          render={({ field }) => (
            <View style={s.field}>
              <Text style={s.label}>نوع کارت</Text>
              <View style={s.typeRow}>
                {donationCartOptions.map(opt => (
                  <Button
                    key={opt.value}
                    layout="auto"
                    variant="text"
                    title={opt.label}
                    onPress={() => field.onChange(opt.value)}
                    style={[
                      s.typeChip,
                      field.value === opt.value && s.typeChipOn,
                    ]}
                    accessibilityState={{ selected: field.value === opt.value }}
                    contentStyle={{ width: '100%' }}
                  >
                    <Text style={s.typeChipText}>{opt.label}</Text>
                  </Button>
                ))}
              </View>
              {errors.cart?.cardType?.message ? (
                <Text style={s.error}>{errors.cart.cardType.message}</Text>
              ) : null}
            </View>
          )}
        />

        <Controller
          name="cart.cardNumber"
          control={control}
          render={({ field }) => (
            <View style={s.field}>
              <Text style={s.label}>شماره کارت</Text>
              <TextInput
                style={[s.input, s.inputLtr]}
                keyboardType="number-pad"
                maxLength={19}
                value={field.value}
                onChangeText={text => field.onChange(formatCardNumber(text))}
                onBlur={field.onBlur}
                placeholderTextColor={semantic.textMuted}
              />
              {errors.cart?.cardNumber?.message ? (
                <Text style={s.error}>{errors.cart.cardNumber.message}</Text>
              ) : null}
            </View>
          )}
        />

        <View style={s.field}>
          <Text style={s.label}>تاریخ انقضا</Text>
          <View style={s.row2}>
            <Controller
              name="cart.expireMonth"
              control={control}
              render={({ field }) => (
                <View style={s.flex1}>
                  <TextInput
                    style={[s.input, s.inputCenter]}
                    placeholder="MM"
                    keyboardType="number-pad"
                    maxLength={2}
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    placeholderTextColor={semantic.textMuted}
                  />
                  {errors.cart?.expireMonth?.message ? (
                    <Text style={s.error}>
                      {errors.cart.expireMonth.message}
                    </Text>
                  ) : null}
                </View>
              )}
            />
            <Controller
              name="cart.expireYear"
              control={control}
              render={({ field }) => (
                <View style={s.flex1}>
                  <TextInput
                    style={[s.input, s.inputCenter]}
                    placeholder="YYYY"
                    keyboardType="number-pad"
                    maxLength={4}
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    placeholderTextColor={semantic.textMuted}
                  />
                  {errors.cart?.expireYear?.message ? (
                    <Text style={s.error}>
                      {errors.cart.expireYear.message}
                    </Text>
                  ) : null}
                </View>
              )}
            />
          </View>
        </View>

        <Controller
          name="cart.cvv"
          control={control}
          render={({ field }) => (
            <View style={s.field}>
              <Text style={s.label}>CVV</Text>
              <TextInput
                style={s.input}
                keyboardType="number-pad"
                maxLength={4}
                secureTextEntry
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                placeholderTextColor={semantic.textMuted}
              />
              {errors.cart?.cvv?.message ? (
                <Text style={s.error}>{errors.cart.cvv.message}</Text>
              ) : null}
            </View>
          )}
        />
      </View>
    );
  },
);
DonationCreditCardFields.displayName = 'DonationCreditCardFields';
