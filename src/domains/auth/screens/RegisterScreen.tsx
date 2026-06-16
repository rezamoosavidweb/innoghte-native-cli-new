import type { DrawerScreenProps } from '@react-navigation/drawer';
import * as React from 'react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { Button } from '@/ui/components/Button';
import { Text } from '@/shared/ui/Text';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { completePendingAuthNavigation } from '@/app/bridge/auth/protectedNavigation';
import { useRegister } from '@/domains/auth/hooks/useRegister';
import { registerSchema, type RegisterFormType } from '@/domains/auth/model/registerFormSchema';
import { checkOtp, resendVerifyOtp } from '@/domains/auth/api/auth.service';
import { ApiError } from '@/shared/infra/http/apiError';
import type { DrawerParamList } from '@/shared/contracts/navigationApp';
import { createRegisterScreenStyles } from '@/domains/auth/ui/registerScreen.styles';
import { useThemeColors } from '@/ui/theme';
import { useAppNavigation } from '@/shared/lib/navigation/useAppNavigation';
import { InputField } from '@/ui/components/form/InputField';
import { OtpVerification } from '@/ui/components/OtpVerification';
import {
  PhoneInput,
  defaultPhoneInputValue,
  phoneValueToE164,
} from '@/ui/components/PhoneInput';

type Props = DrawerScreenProps<DrawerParamList, 'Register'>;

const IS_DOT_IR = process.env.REACT_NATIVE_IS_DOT_IR === 'ir';

const RegisterScreenComponent = (_props: Props) => {
  const colors = useThemeColors();
  const { t } = useTranslation();
  const s = useMemo(() => createRegisterScreenStyles(colors), [colors]);
  const navigation = useAppNavigation();
  const registerMutation = useRegister();

  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [identifiers, setIdentifiers] = useState({ email: '', mobile: '' });
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const registerApiError =
    registerMutation.error instanceof ApiError
      ? registerMutation.error.message
      : registerMutation.error instanceof Error
      ? registerMutation.error.message
      : null;

  const registerForm = useForm<RegisterFormType>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      family: '',
      email: '',
      mobile: defaultPhoneInputValue(),
      password: '',
      confirmPassword: '',
      acceptTerms: false,
      ref_code: '',
    },
  });

  const name = registerForm.watch('name') ?? '';
  const family = registerForm.watch('family') ?? '';
  const email = registerForm.watch('email') ?? '';
  const mobilePhone = registerForm.watch('mobile');
  const password = registerForm.watch('password') ?? '';
  const confirmPassword = registerForm.watch('confirmPassword') ?? '';
  const acceptTerms = registerForm.watch('acceptTerms');
  const ref_code = registerForm.watch('ref_code') ?? '';

  registerForm.register('name');
  registerForm.register('family');
  registerForm.register('email');
  registerForm.register('password');
  registerForm.register('confirmPassword');
  registerForm.register('acceptTerms');
  registerForm.register('ref_code');

  const submitRegister = registerForm.handleSubmit(async values => {
    // Mobile must be E.164 (`+<country><national>`); the backend rejects
    // `00…`/national-only forms. `country_code` stays the ISO code (mirrors web).
    const normalizedEmail = values.email.trim().toLowerCase();
    const normalizedMobile = phoneValueToE164(values.mobile);
    await registerMutation.mutateAsync({
      name: values.name.trim(),
      family: values.family.trim(),
      email: normalizedEmail,
      mobile: normalizedMobile,
      password: values.password,
      country_code: values.mobile.countryCode,
      ref_code: values.ref_code?.trim() ?? '',
    });
    setIdentifiers({ email: normalizedEmail, mobile: normalizedMobile });
    setStep('otp');
  });

  const submitOtp = React.useCallback(async () => {
    if (!otpCode.trim()) return;
    setOtpError(null);
    setIsVerifying(true);
    try {
      await checkOtp({
        otp: otpCode.trim(),
        email_identifier: identifiers.email,
        mobile_identifier: identifiers.mobile,
      });
      completePendingAuthNavigation();
    } catch (err) {
      setOtpError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
          ? err.message
          : t('screens.register.otp.errorGeneric'),
      );
    } finally {
      setIsVerifying(false);
    }
  }, [identifiers.email, identifiers.mobile, otpCode, t]);

  const handleResend = React.useCallback(async () => {
    setOtpError(null);
    setIsResending(true);
    try {
      await resendVerifyOtp({ type: 'both' });
    } catch (err) {
      setOtpError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
          ? err.message
          : t('screens.register.otp.resendError'),
      );
    } finally {
      setIsResending(false);
    }
  }, [t]);

  const handleEditInfo = () => {
    setStep('form');
    setOtpCode('');
    setOtpError(null);
  };

  const goToLogin = React.useCallback(() => {
    navigation.navigate('Login');
  }, [navigation]);

  const goToContact = React.useCallback(() => {
    navigation.navigate('Contact');
  }, [navigation]);

  if (step === 'otp') {
    return (
      <KeyboardAvoidingView
        style={s.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={s.inner}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <OtpVerification
            title={t('screens.register.otp.title')}
            subtitle={t('screens.register.otp.subtitle')}
            code={otpCode}
            onChangeCode={setOtpCode}
            onSubmit={submitOtp}
            submitting={isVerifying}
            submitLabel={t('screens.register.otp.submit')}
            error={otpError}
            onResend={handleResend}
            resending={isResending}
            notReceivedLabel={t('screens.register.otp.notReceived')}
            resendLabel={t('screens.register.otp.resend')}
            resendInLabel={t('screens.register.otp.resendIn')}
            codeAccessibilityLabel={t('screens.register.otp.codeLabel')}
            codePlaceholder={t('screens.register.otp.codeLabel')}
          />

          <Button
            layout="auto"
            variant="text"
            title={t('screens.register.otp.editInfo')}
            onPress={handleEditInfo}
            style={s.editInfoButton}
            contentStyle={{ width: '100%' }}
          >
            <Text style={s.editInfoText}>{t('screens.register.otp.editInfo')}</Text>
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={s.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={s.inner}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={s.title}>{t('screens.register.title')}</Text>
        <Text style={s.sub}>{t('screens.register.subtitle')}</Text>

        <View style={s.row}>
          <View style={s.rowField}>
            <InputField
              accessibilityLabel={t('screens.register.name')}
              placeholder={t('screens.register.name')}
              value={name}
              onChangeText={value =>
                registerForm.setValue('name', value, { shouldValidate: true, shouldDirty: true })
              }
              onBlur={() => registerForm.trigger('name').catch(() => {})}
              error={registerForm.formState.errors.name?.message}
            />
          </View>
          <View style={s.rowField}>
            <InputField
              accessibilityLabel={t('screens.register.family')}
              placeholder={t('screens.register.family')}
              value={family}
              onChangeText={value =>
                registerForm.setValue('family', value, { shouldValidate: true, shouldDirty: true })
              }
              onBlur={() => registerForm.trigger('family').catch(() => {})}
              error={registerForm.formState.errors.family?.message}
            />
          </View>
        </View>

        <InputField
          accessibilityLabel={t('screens.register.email')}
          placeholder={t('screens.register.email')}
          keyboardType="email-address"
          forceInputLtr
          value={email}
          onChangeText={value =>
            registerForm.setValue('email', value, { shouldValidate: true, shouldDirty: true })
          }
          onBlur={() => registerForm.trigger('email').catch(() => {})}
          error={registerForm.formState.errors.email?.message}
        />

        <PhoneInput
          accessibilityLabelDial={t('screens.register.mobile')}
          placeholder={t('screens.register.mobile')}
          value={mobilePhone ?? defaultPhoneInputValue()}
          onChange={value =>
            registerForm.setValue('mobile', value, {
              shouldValidate: true,
              shouldDirty: true,
            })
          }
          onBlur={() => registerForm.trigger('mobile').catch(() => {})}
          error={registerForm.formState.errors.mobile?.dial?.message}
          touched={Boolean(registerForm.formState.touchedFields.mobile)}
          disableDropdown={IS_DOT_IR}
          defaultCountryIso={IS_DOT_IR ? 'ir' : undefined}
        />

        <InputField
          accessibilityLabel={t('screens.register.password')}
          placeholder={t('screens.register.password')}
          secureTextEntry
          forceInputLtr
          value={password}
          onChangeText={value =>
            registerForm.setValue('password', value, { shouldValidate: true, shouldDirty: true })
          }
          onBlur={() => registerForm.trigger('password').catch(() => {})}
          error={registerForm.formState.errors.password?.message}
        />

        <InputField
          accessibilityLabel={t('screens.register.confirmPassword')}
          placeholder={t('screens.register.confirmPassword')}
          secureTextEntry
          forceInputLtr
          value={confirmPassword}
          onChangeText={value =>
            registerForm.setValue('confirmPassword', value, { shouldValidate: true, shouldDirty: true })
          }
          onBlur={() => registerForm.trigger('confirmPassword').catch(() => {})}
          error={registerForm.formState.errors.confirmPassword?.message}
        />

        <InputField
          accessibilityLabel={t('screens.register.refCode')}
          placeholder={t('screens.register.refCode')}
          forceInputLtr
          value={ref_code}
          onChangeText={value =>
            registerForm.setValue('ref_code', value, { shouldValidate: true, shouldDirty: true })
          }
        />

        <View style={s.termsRow}>
          <Pressable
            onPress={() =>
              registerForm.setValue('acceptTerms', !acceptTerms, {
                shouldValidate: true,
              })
            }
            accessibilityRole="checkbox"
            accessibilityState={{ checked: !!acceptTerms }}
            hitSlop={8}
          >
            <View
              style={[
                s.checkboxBox,
                acceptTerms ? s.checkboxCheckedBg : undefined,
              ]}
            >
              {acceptTerms ? <Text style={s.checkMark}>✓</Text> : null}
            </View>
          </Pressable>
          <Text style={s.termsText}>{t('screens.register.acceptTerms')}</Text>
        </View>
        {registerForm.formState.errors.acceptTerms ? (
          <Text style={s.errorText}>
            {registerForm.formState.errors.acceptTerms.message}
          </Text>
        ) : null}

        {registerApiError ? <Text style={s.errorText}>{registerApiError}</Text> : null}
        {!registerApiError ? (
          <Text style={s.helperText}>{t('screens.register.credentialsHelper')}</Text>
        ) : null}

        <Button
          variant="filled"
          title={t('screens.register.submit')}
          onPress={submitRegister}
          loading={registerMutation.isPending}
        />

        <View style={s.loginCta}>
          <Text style={s.loginCtaText}>{t('screens.register.hasAccount')}</Text>
          <Button
            variant="text"
            title={t('screens.register.loginLink')}
            onPress={goToLogin}
          />
        </View>
        <View style={s.loginCta}>
          <Button
            variant="text"
            title={t('drawer.contact')}
            onPress={goToContact}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export const RegisterScreen = React.memo(RegisterScreenComponent);
RegisterScreen.displayName = 'RegisterScreen';
