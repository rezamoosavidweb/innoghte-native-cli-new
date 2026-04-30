import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import type { Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { resolveIsDotIr } from '@/shared/config/resolveIsDotIr';
import { useBasketCheckoutStore } from '@/domains/basket/model/basketCheckout.store';
import type { BasketIrGateway } from '@/domains/basket/model/basketCheckout.store';
import type { BasketPaymentFormType } from '@/domains/basket/model/paymentFormSchema';
import {
  basketCartTypeOptions,
  type BasketCreditCartErrors,
} from '@/domains/basket/model/paymentFormSchema';
import { SelectPaymentType } from '@/domains/basket/components/SelectPaymentType';
import { formatCardNumber } from '@/domains/donation/utils/paymentFormatting';
import { fontSize, fontWeight, pickSemantic, radius, spacing } from '@/ui/theme';

export type PaymentSectionProps = {
  control: Control<BasketPaymentFormType>;
  errors: BasketCreditCartErrors;
  paymentType: BasketPaymentFormType['paymentType'];
  onPaymentTypeChange: (next: 'paypal' | 'credit_card') => void;
};

export const PaymentSection = React.memo(function PaymentSection({
  control,
  errors,
  paymentType,
  onPaymentTypeChange,
}: PaymentSectionProps) {
  const theme = useTheme();
  const semantic = pickSemantic(theme);
  const isDotIr = resolveIsDotIr();
  const gateway = useBasketCheckoutStore(s => s.gatewayName);
  const setGateway = useBasketCheckoutStore(s => s.setGatewayName);

  const s = React.useMemo(
    () =>
      StyleSheet.create({
        title: {
          fontSize: fontSize.lg,
          fontWeight: fontWeight.semibold,
          color: semantic.text,
          marginBottom: spacing.md,
        },
        gatewayRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
        gw: {
          flex: 1,
          paddingVertical: spacing.md,
          borderRadius: radius.md,
          borderWidth: 2,
          borderColor: semantic.border,
          alignItems: 'center',
        },
        gwOn: { borderColor: semantic.textSecondary },
        gwLbl: { fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: semantic.text },
        grid: { gap: spacing.md },
        row2: { flexDirection: 'row', gap: spacing.md },
        flex1: { flex: 1 },
        field: { gap: spacing.xs },
        label: { fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: semantic.text },
        input: {
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: semantic.border,
          borderRadius: radius.md,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          backgroundColor: semantic.inputBackground,
          color: semantic.text,
          fontSize: fontSize.base,
        },
        error: { fontSize: fontSize.sm, color: semantic.errorText },
        typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
        chip: {
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          borderRadius: radius.full,
          borderWidth: 1,
          borderColor: semantic.border,
          backgroundColor: semantic.surface,
        },
        chipOn: { borderColor: semantic.primary, backgroundColor: semantic.primarySoft },
        chipTxt: { fontSize: fontSize.sm, color: semantic.text },
      }),
    [semantic],
  );

  const onGatewayPress = React.useCallback(
    (g: BasketIrGateway) => {
      setGateway(g);
    },
    [setGateway],
  );

  return (
    <View>
      <Text style={s.title}>روش پرداخت</Text>

      {!isDotIr ? (
        <View style={s.grid}>
          <Controller
            name="paymentType"
            control={control}
            render={({ field }) => (
              <SelectPaymentType
                value={field.value}
                onChange={v => {
                  field.onChange(v);
                  onPaymentTypeChange(v);
                }}
              />
            )}
          />
          {paymentType === 'credit_card' ? (
            <>
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
                      {basketCartTypeOptions.map(opt => (
                        <Pressable
                          key={opt.value}
                          onPress={() => field.onChange(opt.value)}
                          style={[s.chip, field.value === opt.value && s.chipOn]}
                          accessibilityRole="button"
                          accessibilityState={{ selected: field.value === opt.value }}
                        >
                          <Text style={s.chipTxt}>{opt.label}</Text>
                        </Pressable>
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
                      style={s.input}
                      value={field.value}
                      onChangeText={t => field.onChange(formatCardNumber(t))}
                      onBlur={field.onBlur}
                      keyboardType="number-pad"
                      placeholderTextColor={semantic.textMuted}
                    />
                    {errors.cart?.cardNumber?.message ? (
                      <Text style={s.error}>{errors.cart.cardNumber.message}</Text>
                    ) : null}
                  </View>
                )}
              />
              <View style={s.row2}>
                <View style={s.flex1}>
                  <Controller
                    name="cart.expireMonth"
                    control={control}
                    render={({ field }) => (
                      <View style={s.field}>
                        <Text style={s.label}>ماه MM</Text>
                        <TextInput
                          style={s.input}
                          value={field.value}
                          onChangeText={field.onChange}
                          onBlur={field.onBlur}
                          keyboardType="number-pad"
                          maxLength={2}
                          placeholderTextColor={semantic.textMuted}
                        />
                        {errors.cart?.expireMonth?.message ? (
                          <Text style={s.error}>{errors.cart.expireMonth.message}</Text>
                        ) : null}
                      </View>
                    )}
                  />
                </View>
                <View style={s.flex1}>
                  <Controller
                    name="cart.expireYear"
                    control={control}
                    render={({ field }) => (
                      <View style={s.field}>
                        <Text style={s.label}>سال YYYY</Text>
                        <TextInput
                          style={s.input}
                          value={field.value}
                          onChangeText={field.onChange}
                          onBlur={field.onBlur}
                          keyboardType="number-pad"
                          maxLength={4}
                          placeholderTextColor={semantic.textMuted}
                        />
                        {errors.cart?.expireYear?.message ? (
                          <Text style={s.error}>{errors.cart.expireYear.message}</Text>
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
                      value={field.value}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                      keyboardType="number-pad"
                      maxLength={4}
                      placeholderTextColor={semantic.textMuted}
                    />
                    {errors.cart?.cvv?.message ? (
                      <Text style={s.error}>{errors.cart.cvv.message}</Text>
                    ) : null}
                  </View>
                )}
              />
            </>
          ) : null}
        </View>
      ) : (
        <View style={s.gatewayRow}>
          <Pressable
            onPress={() => onGatewayPress('zarinpal')}
            style={[s.gw, gateway === 'zarinpal' && s.gwOn]}
            accessibilityRole="button"
          >
            <Text style={s.gwLbl}>زرین‌پال</Text>
          </Pressable>
          <Pressable
            onPress={() => onGatewayPress('vandar')}
            style={[s.gw, gateway === 'vandar' && s.gwOn]}
            accessibilityRole="button"
          >
            <Text style={s.gwLbl}>وندار</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
});
