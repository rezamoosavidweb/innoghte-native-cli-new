import type { DrawerScreenProps } from '@react-navigation/drawer';
import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Text } from '@/shared/ui/Text';
import Logo from '@/assets/logo.svg';

import { useCountdown, formatCountdown } from '@/ui/hooks/useCountdown';
import { useForgetPassword } from '@/domains/auth/hooks/useForgetPassword';
import {
  forgetPasswordSchema,
  type ForgetPasswordFormType,
} from '@/domains/auth/model/forgetPasswordSchema';
import { AuthTabs } from '@/domains/auth/ui/AuthTabs';
import { EmailLoginForm } from '@/domains/auth/ui/forms/EmailLoginForm';
import { MobileLoginForm } from '@/domains/auth/ui/forms/MobileLoginForm';
import {
  AUTH_LOGO_COLOR,
  AUTH_OVERLAY_GRADIENT,
  createLoginScreenStyles,
} from '@/domains/auth/ui/styles';
import type { DrawerParamList } from '@/shared/contracts/navigationApp';
import { resolveErrorMessage } from '@/shared/infra/http';
import { useAppNavigation } from '@/shared/lib/navigation/useAppNavigation';
import { Button } from '@/ui/components/Button';
import {
  defaultPhoneInputValue,
  phoneValueToE164,
} from '@/ui/components/PhoneInput';
import { useThemeColors } from '@/ui/theme';

const BG_IMAGE = require('@/assets/images/login.jpg');

type Props = DrawerScreenProps<DrawerParamList, 'ForgetPassword'>;

const IS_DOT_IR = process.env.REACT_NATIVE_IS_DOT_IR === 'ir';
const RESEND_COUNTDOWN_SECONDS = 120;

const ForgetPasswordScreenComponent = (_props: Props) => {
  const colors = useThemeColors();
  const { t } = useTranslation();
  const s = React.useMemo(() => createLoginScreenStyles(colors), [colors]);
  const navigation = useAppNavigation();
  const mutation = useForgetPassword();

  const [sentMode, setSentMode] = React.useState<'email' | 'mobile' | null>(
    null,
  );
  const {
    remaining,
    reset: resetCountdown,
    expired: countdownExpired,
  } = useCountdown(RESEND_COUNTDOWN_SECONDS);

  const apiError = mutation.error
    ? resolveErrorMessage(mutation.error, t('screens.forgetPassword.errorGeneric'))
    : null;

  const form = useForm<ForgetPasswordFormType>({
    resolver: zodResolver(forgetPasswordSchema),
    mode: 'onBlur',
    defaultValues: {
      mode: 'email',
      email: '',
      mobile: defaultPhoneInputValue(),
    },
  });

  const mode = form.watch('mode');
  const email = form.watch('email') ?? '';
  const mobile = form.watch('mobile');
  form.register('email');
  form.register('mobile');

  const tabs = React.useMemo(
    () => [
      { label: t('screens.forgetPassword.recoverWithEmail'), value: 'email' },
      { label: t('screens.forgetPassword.recoverWithMobile'), value: 'mobile' },
    ],
    [t],
  );

  const goToLogin = React.useCallback(() => {
    navigation.navigate('Login');
  }, [navigation]);

  const submit = form.handleSubmit(async values => {
    if (values.mode === 'email') {
      await mutation.mutateAsync({
        mode: 'email',
        email: values.email.trim().toLowerCase(),
      });
    } else {
      await mutation.mutateAsync({
        mode: 'mobile',
        mobile: phoneValueToE164(values.mobile),
      });
    }
    setSentMode(values.mode);
    resetCountdown();
  });

  const handleResend = React.useCallback(async () => {
    if (!sentMode) return;
    if (sentMode === 'email') {
      await mutation.mutateAsync({
        mode: 'email',
        email: email.trim().toLowerCase(),
      });
    } else {
      await mutation.mutateAsync({
        mode: 'mobile',
        mobile: phoneValueToE164(mobile),
      });
    }
    resetCountdown();
  }, [email, mobile, mutation, resetCountdown, sentMode]);

  const renderSent = () => (
    <View style={s.sentWrap}>
      <Text style={s.sentTitle}>
        {sentMode === 'email'
          ? t('screens.forgetPassword.sentEmailTitle')
          : t('screens.forgetPassword.sentMobileTitle')}
      </Text>
      <Text style={s.sentBody}>
        {sentMode === 'email'
          ? t('screens.forgetPassword.sentEmailBody')
          : t('screens.forgetPassword.sentMobileBody')}
      </Text>

      <View style={s.resendRow}>
        <Text style={s.resendText}>
          {sentMode === 'email'
            ? t('screens.forgetPassword.notReceivedEmail')
            : t('screens.forgetPassword.notReceivedMobile')}
        </Text>
        {countdownExpired ? (
          <Button
            layout="auto"
            variant="text"
            title={t('screens.forgetPassword.resend')}
            onPress={handleResend}
            loading={mutation.isPending}
            contentStyle={{ width: '100%' }}
          >
            <Text style={s.resendLink}>{t('screens.forgetPassword.resend')}</Text>
          </Button>
        ) : (
          <Text style={s.resendTimer}>
            {t('screens.forgetPassword.resendIn')} {formatCountdown(remaining)}
          </Text>
        )}
      </View>

      <Button
        variant="filled"
        title={t('screens.forgetPassword.goToLogin')}
        onPress={goToLogin}
      />
    </View>
  );

  const renderForm = () => (
    <>
      <Text style={s.title}>{t('screens.forgetPassword.title')}</Text>
      <Text style={s.sub}>{t('screens.forgetPassword.subtitle')}</Text>

      <AuthTabs
        tabs={tabs}
        value={mode}
        onChange={value =>
          form.setValue('mode', value as ForgetPasswordFormType['mode'], {
            shouldValidate: false,
          })
        }
      />

      {mode === 'email' ? (
        <EmailLoginForm
          value={email}
          onChangeText={value =>
            form.setValue('email', value, {
              shouldValidate: true,
              shouldDirty: true,
            })
          }
          onBlur={() => form.trigger('email').catch(() => {})}
          error={form.formState.errors.email?.message}
        />
      ) : (
        <MobileLoginForm
          value={mobile}
          onChange={value =>
            form.setValue('mobile', value, {
              shouldValidate: true,
              shouldDirty: true,
            })
          }
          onBlur={() => form.trigger('mobile').catch(() => {})}
          error={form.formState.errors.mobile?.dial?.message}
          touched={Boolean(form.formState.touchedFields.mobile)}
          disableDropdown={IS_DOT_IR}
          defaultCountryIso={IS_DOT_IR ? 'ir' : undefined}
        />
      )}

      {apiError ? <Text style={s.errorText}>{apiError}</Text> : null}

      <Button
        variant="filled"
        title={t('screens.forgetPassword.submit')}
        onPress={submit}
        loading={mutation.isPending}
      />

      <View style={s.forgotRow}>
        <Button
          variant="text"
          title={t('screens.forgetPassword.backToLogin')}
          onPress={goToLogin}
        />
      </View>
    </>
  );

  return (
    <ImageBackground source={BG_IMAGE} style={s.flex} resizeMode="cover">
      <LinearGradient
        locations={[0.3, 0.5, 1]}
        colors={AUTH_OVERLAY_GRADIENT}
        style={s.overlay}
      />
      <View style={s.logoContainer}>
        <Logo width={118} height={50} color={AUTH_LOGO_COLOR} />
      </View>
      <KeyboardAvoidingView
        style={s.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={s.inner}>{sentMode ? renderSent() : renderForm()}</View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export const ForgetPasswordScreen = React.memo(ForgetPasswordScreenComponent);
ForgetPasswordScreen.displayName = 'ForgetPasswordScreen';
