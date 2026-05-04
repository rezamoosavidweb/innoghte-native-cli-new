import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import type { Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { TextInput, View } from 'react-native';
import { Text } from '@/shared/ui/Text';

import { SelectPaymentType } from '@/domains/basket/components/SelectPaymentType';
import { usePaymentSectionStyles } from '@/domains/basket/components/paymentSection.styles';
import type { BasketIrGateway } from '@/domains/basket/model/basketCheckout.store';
import { useBasketCheckoutStore } from '@/domains/basket/model/basketCheckout.store';
import type { BasketPaymentFormType } from '@/domains/basket/model/paymentFormSchema';
import {
  basketCartTypeOptions,
  type BasketCreditCartErrors,
} from '@/domains/basket/model/paymentFormSchema';
import { isDotIr } from '@/shared/config/resolveIsDotIr';
import { formatCardNumber } from '@/shared/utils/paymentFormatting';
import { Button } from '@/ui/components/Button';
import { pickSemantic } from '@/ui/theme';

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
  const gateway = useBasketCheckoutStore(s => s.gatewayName);
  const setGateway = useBasketCheckoutStore(s => s.setGatewayName);

  const s = usePaymentSectionStyles(semantic);

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
                          <Text style={s.error}>
                            {errors.cart.fistName.message}
                          </Text>
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
                          <Text style={s.error}>
                            {errors.cart.lastName.message}
                          </Text>
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
                        <Button
                          key={opt.value}
                          layout="auto"
                          variant="text"
                          title={opt.label}
                          onPress={() => field.onChange(opt.value)}
                          style={[
                            s.chip,
                            field.value === opt.value && s.chipOn,
                          ]}
                          accessibilityState={{
                            selected: field.value === opt.value,
                          }}
                          contentStyle={{ width: '100%' }}
                        >
                          <Text style={s.chipTxt}>{opt.label}</Text>
                        </Button>
                      ))}
                    </View>
                    {errors.cart?.cardType?.message ? (
                      <Text style={s.error}>
                        {errors.cart.cardType.message}
                      </Text>
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
                      <Text style={s.error}>
                        {errors.cart.cardNumber.message}
                      </Text>
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
                          <Text style={s.error}>
                            {errors.cart.expireMonth.message}
                          </Text>
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
          <Button
            layout="auto"
            variant="text"
            title="زرین‌پال"
            onPress={() => onGatewayPress('zarinpal')}
            style={[s.gw, gateway === 'zarinpal' && s.gwOn]}
            contentStyle={{ width: '100%' }}
          >
            <Text style={s.gwLbl}>زرین‌پال</Text>
          </Button>
          <Button
            layout="auto"
            variant="text"
            title="وندار"
            onPress={() => onGatewayPress('vandar')}
            style={[s.gw, gateway === 'vandar' && s.gwOn]}
            contentStyle={{ width: '100%' }}
          >
            <Text style={s.gwLbl}>وندار</Text>
          </Button>
        </View>
      )}
    </View>
  );
});
