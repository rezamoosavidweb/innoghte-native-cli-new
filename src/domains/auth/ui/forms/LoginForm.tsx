import { Text } from '@/shared/ui/Text';
import * as React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { LoginBodyType } from '@/domains/auth/model/apiTypes';
import { loginSchema, type LoginFormType } from '@/domains/auth/model/schema';
import { AuthTabs } from '@/domains/auth/ui/AuthTabs';
import { EmailLoginForm } from '@/domains/auth/ui/forms/EmailLoginForm';
import { MobileLoginForm } from '@/domains/auth/ui/forms/MobileLoginForm';
import { createLoginScreenStyles } from '@/domains/auth/ui/styles';
import { Button } from '@/ui/components/Button';
import { InputField } from '@/ui/components/form/InputField';
import { defaultPhoneInputValue } from '@/ui/components/PhoneInput';
import { useThemeColors } from '@/ui/theme';

type Props = {
  isSubmitting: boolean;
  apiError: string | null;
  onSubmit: (payload: LoginBodyType) => Promise<void> | void;
};

const IS_DOT_IR = process.env.REACT_NATIVE_IS_DOT_IR === 'ir';

export function LoginForm({ isSubmitting, apiError, onSubmit }: Props) {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const s = React.useMemo(
    () => createLoginScreenStyles(colors),
    [colors],
  );
  const form = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      mode: 'email',
      email: '',
      mobile: defaultPhoneInputValue(),
      password: '',
    },
  });
  const mode = form.watch('mode');
  const email = form.watch('email') ?? '';
  const mobile = form.watch('mobile');
  const password = form.watch('password') ?? '';
  form.register('email');
  form.register('mobile');
  form.register('password');

  React.useEffect(() => {
    if (mode === 'email') {
      form.setValue('mobile', defaultPhoneInputValue(), {
        shouldValidate: false,
      });
    } else {
      form.setValue('email', '', { shouldValidate: false });
    }
  }, [form, mode]);

  const tabs = React.useMemo(
    () => [
      { label: t('screens.login.enterWithEmail'), value: 'email' },
      { label: t('screens.login.enterWithMobile'), value: 'mobile' },
    ],
    [t],
  );

  const submit = form.handleSubmit(async values => {
    await onSubmit({
      type: values.mode,
      password: values.password.trim(),
      email:
        values.mode === 'email'
          ? (values.email ?? '').trim().toLowerCase()
          : undefined,
      mobile:
        values.mode === 'mobile'
          ? values.mobile.dial.replace(/\D/g, '')
          : undefined,
      remember: 1,
    });
  });

  return (
    <>
      <AuthTabs
        tabs={tabs}
        value={mode}
        onChange={value =>
          form.setValue('mode', value as LoginFormType['mode'], {
            shouldValidate: true,
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
          onBlur={() => {
            form.trigger('email').catch(() => {});
          }}
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
          onBlur={() => {
            form.trigger('mobile').catch(() => {});
          }}
          error={form.formState.errors.mobile?.dial?.message}
          touched={Boolean(form.formState.touchedFields.mobile)}
          disableDropdown={IS_DOT_IR}
          defaultCountryIso={IS_DOT_IR ? 'ir' : undefined}
        />
      )}

      <InputField
        accessibilityLabel={t('screens.login.password')}
        placeholder={t('screens.login.passwordPlaceholder')}
        secureTextEntry
        forceInputLtr
        value={password}
        onChangeText={value =>
          form.setValue('password', value, {
            shouldValidate: true,
            shouldDirty: true,
          })
        }
        onBlur={() => {
          form.trigger('password').catch(() => {});
        }}
        error={form.formState.errors.password?.message}
      />

      {apiError ? <Text style={s.errorText}>{apiError}</Text> : null}
      {!apiError ? (
        <Text style={s.helperText}>
          {t('screens.login.credentialsHelper')}
        </Text>
      ) : null}

      <Button
        variant="filled"
        title={t('screens.login.submit')}
        onPress={submit}
        loading={isSubmitting}
      />
    </>
  );
}
