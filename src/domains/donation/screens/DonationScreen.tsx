import type { DrawerScreenProps } from '@react-navigation/drawer';
import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View
} from 'react-native';
import { Text } from '@/shared/ui/Text';

import MailIcon from '@/assets/icons/inn/mail.svg';
import UserIcon from '@/assets/icons/inn/user.svg';
import { useCurrentUser } from '@/domains/auth';
import { DonationCreditCardFields } from '@/domains/donation/components/DonationCreditCardFields';
import { DonationResultModal } from '@/domains/donation/components/DonationResultModal';
import { DonationSelectGateway } from '@/domains/donation/components/DonationSelectGateway';
import { useDonateMutation } from '@/domains/donation/hooks/useDonateMutation';
import { useDonationAmountState } from '@/domains/donation/hooks/useDonationAmountState';
import { useDonationCallbackParams } from '@/domains/donation/hooks/useDonationCallbackParams';
import { useDonationFlow } from '@/domains/donation/hooks/useDonationFlow';
import { useDonationFlowEffects } from '@/domains/donation/hooks/useDonationFlowEffects';
import { useDonationFormPrefill } from '@/domains/donation/hooks/useDonationFormPrefill';
import { useDonationGatewayPicker } from '@/domains/donation/hooks/useDonationGatewayPicker';
import { useDonationSubmit } from '@/domains/donation/hooks/useDonationSubmit';
import { useDonationVerificationQueries } from '@/domains/donation/hooks/useDonationVerificationQueries';
import type { DonationFlowState } from '@/domains/donation/model/donationFlowMachine';
import {
  donationSuccessBodyLines,
  donationSuccessTitle,
  donationVerifyErrorBodyLines,
} from '@/domains/donation/model/donationResultCopy';
import { clearDonationRouteParams } from '@/domains/donation/model/donationScreenNavigation';
import { DONATION_LAST_CHECKOUT_GATEWAY_KEY } from '@/domains/donation/model/storageKeys';
import {
  donationFormResolver,
  type DonationCreditCartErrors,
  type DonationFormType,
} from '@/domains/donation/model/donationForm.schema';
import { useDonationScreenStyles } from '@/domains/donation/ui/donationScreen.styles';
import { toPersianNumber } from '@/domains/donation/utils/paymentFormatting';
import { isDotIr } from '@/shared/config/resolveIsDotIr';
import type { DrawerParamList } from '@/shared/contracts/navigationApp';
import { StorageService } from '@/shared/infra/storage/storage.service';
import { groupThousands } from '@/shared/utils/groupThousands';
import { Button } from '@/ui/components/Button';
import { SelectPaymentType } from '@/ui/components/SelectPaymentType';
import { Textarea } from '@/ui/components/Textarea';
import { pickSemantic } from '@/ui/theme';

type Props = DrawerScreenProps<DrawerParamList, 'Donation'>;

type ResultModalState = {
  open: boolean;
  variant: 'success' | 'error';
  title: string;
  bodyLines: string[];
};

function isCheckoutProgressLocked(
  status: DonationFlowState['status'],
): boolean {
  return status !== 'idle';
}

export const DonationScreen = React.memo(function DonationScreen({
  navigation,
  route,
}: Props) {
  const theme = useTheme();
  const { colors } = theme;
  const semantic = pickSemantic(theme);

  const { paymentParams, resetSupplementaryInput } =
    useDonationCallbackParams(route);

  const { gateway, setGateway, verifyGateway } = useDonationGatewayPicker(
    route,
    isDotIr,
  );

  const {
    amount,
    isCustomAmount,
    amountRef,
    preset,
    resetAmountAfterGatewayVerify,
    handlePresetAmount,
    handleCustomPress,
    onAmountChangeText,
  } = useDonationAmountState(isDotIr);

  const { flow, send } = useDonationFlow();

  const {
    verificationFingerprint,
    canVerifyIranian,
    shouldVerify,
    iranQuery,
    paypalQuery,
  } = useDonationVerificationQueries({
    paymentParams,
    isDotIr,
    verifyGateway,
    flowStatus: flow.status,
  });

  const donateMutation = useDonateMutation(isDotIr);
  const { data: authUserResponse } = useCurrentUser();

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<DonationFormType>({
    resolver: donationFormResolver,
    defaultValues: {
      paymentType: 'paypal',
      user: { fullName: '', email: '', comment: '' },
    },
  });

  useDonationFormPrefill(authUserResponse?.data, getValues, setValue);

  const paymentType = useWatch({ control, name: 'paymentType' }) ?? 'paypal';
  const cartErrors = errors as DonationCreditCartErrors;

  const handlePaymentTypeChange = React.useCallback(
    (v: 'paypal' | 'credit_card') => {
      const user = getValues('user');
      if (v === 'credit_card') {
        reset({
          paymentType: 'credit_card',
          user,
          cart: {
            fistName: '',
            lastName: '',
            cardType: '1',
            cardNumber: '',
            expireMonth: '',
            expireYear: '',
            cvv: '',
          },
        });
      } else {
        reset({
          paymentType: 'paypal',
          user,
        });
      }
    },
    [getValues, reset],
  );

  const [resultModal, setResultModal] = React.useState<ResultModalState>({
    open: false,
    variant: 'success',
    title: '',
    bodyLines: [],
  });

  const openResult = React.useCallback(
    (payload: {
      variant: 'success' | 'error';
      title: string;
      bodyLines: string[];
    }) => {
      setResultModal({ open: true, ...payload });
    },
    [],
  );

  const closeResult = React.useCallback(() => {
    setResultModal(m => ({ ...m, open: false }));
    if (flow.status === 'success' || flow.status === 'error') {
      send({ type: 'RESET' });
    }
  }, [flow.status, send]);

  const showGatewayVerifySuccess = React.useCallback(() => {
    openResult({
      variant: 'success',
      title: donationSuccessTitle,
      bodyLines: donationSuccessBodyLines,
    });
    reset({
      paymentType: 'paypal',
      user: { fullName: '', email: '', comment: '' },
    });
    resetAmountAfterGatewayVerify();
    clearDonationRouteParams(navigation);
    resetSupplementaryInput();
    StorageService.remove(DONATION_LAST_CHECKOUT_GATEWAY_KEY);
  }, [
    navigation,
    openResult,
    reset,
    resetAmountAfterGatewayVerify,
    resetSupplementaryInput,
  ]);

  const showVerifyPaymentError = React.useCallback(() => {
    openResult({
      variant: 'error',
      title: 'خطا در پرداخت',
      bodyLines: donationVerifyErrorBodyLines,
    });
    clearDonationRouteParams(navigation);
    resetSupplementaryInput();
    StorageService.remove(DONATION_LAST_CHECKOUT_GATEWAY_KEY);
  }, [navigation, openResult, resetSupplementaryInput]);

  useDonationFlowEffects({
    flow,
    send,
    verificationFingerprint,
    shouldVerify,
    canVerifyIranian,
    iranQuery,
    paypalQuery,
    openResult,
    onGatewayVerifySuccess: showGatewayVerifySuccess,
    onGatewayVerifyPaymentError: showVerifyPaymentError,
  });

  const { submitDonation } = useDonationSubmit({
    amount,
    gateway,
    donateMutation,
    send,
    openResult,
    reset,
  });

  const s = useDonationScreenStyles(colors.background, semantic, isCustomAmount);

  const isCheckoutLocked = isCheckoutProgressLocked(flow.status);

  const isPayProcessing =
    donateMutation.isPending || isSubmitting || isCheckoutLocked;

  const preset1On = preset.isIrPreset50 || preset.isComPreset5;
  const preset2On = preset.isIrPreset250 || preset.isComPreset25;

  return (
    <KeyboardAvoidingView
      style={s.keyboardRoot}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={s.scrollContent}
      >
        <View style={s.topSection}>
          <Text style={s.topTitle}>دوست و همراه عزیز سلام،</Text>
          <Text style={s.topSubtitle}>
            از اینکه با حمایت مالی من را در ادامه مسیر همراهی میکنی، سپاسگزارم.
          </Text>
        </View>

        <View style={s.hero} />

        <Text style={s.sectionHeading}>
          {isDotIr ? 'حمایت مالی' : 'حمایت مالی با پی‌پل'}
        </Text>

        <View style={s.amountGroup}>
          <View style={s.amountRow}>
            <Text style={s.currency}>مبلغ حمایت مالی:</Text>
            <TextInput
              ref={amountRef}
              style={[s.amountInput, isCustomAmount && s.amountInputActive]}
              keyboardType="decimal-pad"
              value={groupThousands(amount)}
              onChangeText={onAmountChangeText}
            />
            <Text style={s.currency}>{isDotIr ? 'تومان' : 'دلار'}</Text>
          </View>

          <View style={s.presetsRow}>
            <Button
              layout="auto"
              variant="text"
              title={isDotIr ? '50,000' : '$5'}
              onPress={() => handlePresetAmount(isDotIr ? '50000' : '5')}
              style={[s.amtBtn, preset1On && s.amtBtnOn]}
              contentStyle={{ width: '100%' }}
            >
              <Text style={[s.amtBtnText, preset1On && s.amtBtnTextOn]}>
                {isDotIr ? '50,000' : '$5'}
              </Text>
            </Button>
            <Button
              layout="auto"
              variant="text"
              title={isDotIr ? '250,000' : '$25'}
              onPress={() => handlePresetAmount(isDotIr ? '250000' : '25')}
              style={[s.amtBtn, preset2On && s.amtBtnOn]}
              contentStyle={{ width: '100%' }}
            >
              <Text style={[s.amtBtnText, preset2On && s.amtBtnTextOn]}>
                {isDotIr ? '250,000' : '$25'}
              </Text>
            </Button>
          </View>

          <Button
            layout="auto"
            variant="filled"
            title="مبلغ دلخواه خود را وارد کنید."
            onPress={handleCustomPress}
            style={s.customBtn}
            contentStyle={{ width: '100%' }}
          >
            <Text style={s.customBtnText}>مبلغ دلخواه خود را وارد کنید.</Text>
          </Button>
        </View>

        <View style={s.paymentGroup}>
          <Text style={s.paymentHeading}>
            {isDotIr ? 'انتخاب درگاه' : 'روش پرداخت'}
          </Text>
          {!isDotIr ? (
            <>
              <Controller
                name="paymentType"
                control={control}
                render={({ field }) => (
                  <SelectPaymentType
                    value={field.value}
                    onChange={v => {
                      field.onChange(v);
                      handlePaymentTypeChange(v);
                    }}
                  />
                )}
              />
              {paymentType === 'credit_card' ? (
                <DonationCreditCardFields
                  control={control}
                  errors={cartErrors}
                />
              ) : null}
            </>
          ) : (
            <DonationSelectGateway
              gateway={gateway === 'zarinpal' ? 'zarinpal' : 'vandar'}
              onChange={setGateway}
            />
          )}
        </View>

        <View style={s.sepLine} />

        <Text style={s.sectionTitle}>مشخصات حامی مالی</Text>

        <View style={s.fieldsGap}>
            <Controller
              name="user.fullName"
              control={control}
              render={({ field }) => (
                <View>
                  <Text style={s.label}>نام و نام خانوادگی</Text>
                  <View style={s.inputWrap}>
                    <UserIcon width={18} height={18} color={semantic.textMuted} />
                    <TextInput
                      style={s.input}
                      value={field.value}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                      placeholderTextColor={semantic.textMuted}
                    />
                  </View>
                  {errors.user?.fullName?.message ? (
                    <Text style={s.fieldError}>
                      {errors.user.fullName.message}
                    </Text>
                  ) : null}
                </View>
              )}
            />
            <Controller
              name="user.email"
              control={control}
              render={({ field }) => (
                <View>
                  <Text style={s.label}>پست الکترونیکی</Text>
                  <View style={s.inputWrap}>
                    <MailIcon width={18} height={18} color={semantic.textMuted} />
                    <TextInput
                      style={s.input}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      value={field.value}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                      placeholderTextColor={semantic.textMuted}
                    />
                  </View>
                  {errors.user?.email?.message ? (
                    <Text style={s.fieldError}>{errors.user.email.message}</Text>
                  ) : null}
                </View>
              )}
            />
            <Controller
              name="user.comment"
              control={control}
              render={({ field }) => (
                <View>
                  <Text style={s.label}>پیام شما</Text>
                  <Textarea
                    value={field.value ?? ''}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    maxLength={250}
                    placeholder="اینجا بنویسید..."
                  />
                </View>
              )}
            />
          </View>

          <View style={s.footerRow}>
            <Text style={s.total}>
              مجموع قابل پرداخت:{' '}
              {toPersianNumber(groupThousands(amount)) + (!isDotIr ? '$' : '')}{' '}
              {isDotIr ? 'تومان' : ''}
            </Text>
            <Button
              variant="filled"
              title="تائید و پرداخت"
              onPress={handleSubmit(submitDonation)}
              loading={isPayProcessing}
              disabled={isPayProcessing}
              style={[s.payBtn, isPayProcessing && s.payBtnDisabled]}
              contentStyle={{ width: '100%' }}
            >
              <Text style={s.payBtnText}>
                {isPayProcessing ? 'در حال پردازش...' : 'تائید و پرداخت'}
              </Text>
            </Button>
          </View>
      </ScrollView>

      <DonationResultModal
        visible={resultModal.open}
        variant={resultModal.variant}
        title={resultModal.title}
        bodyLines={resultModal.bodyLines}
        onClose={closeResult}
      />
    </KeyboardAvoidingView>
  );
});
DonationScreen.displayName = 'DonationScreen';
