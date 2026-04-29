import { Button } from '@react-navigation/elements';
import * as React from 'react';
import { Text } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

import { EmailLoginForm } from '@/domains/auth/ui/forms/EmailLoginForm';
import { MobileLoginForm } from '@/domains/auth/ui/forms/MobileLoginForm';
import { InputField } from '@/ui/components/form/InputField';
import { SelectField } from '@/domains/auth/ui/forms/SelectField';
import { loginSchema, type LoginFormType } from '@/domains/auth/model/schema';
import type { LoginBodyType } from '@/domains/auth/model/apiTypes';
import { useLoginScreenStyles } from '@/domains/auth/ui/styles';
import { useThemeColors } from '@/ui/theme';

type Props = {
  isSubmitting: boolean;
  apiError: string | null;
  onSubmit: (payload: LoginBodyType) => Promise<void> | void;
};

export function LoginForm({ isSubmitting, apiError, onSubmit }: Props) {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const s = useLoginScreenStyles(colors);
  const form = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      mode: 'email',
      email: '',
      mobile: '',
      password: '',
    },
  });
  const mode = form.watch('mode');
  const email = form.watch('email') ?? '';
  const mobile = form.watch('mobile') ?? '';
  const password = form.watch('password') ?? '';
  form.register('email');
  form.register('mobile');
  form.register('password');

  React.useEffect(() => {
    if (mode === 'email') {
      form.setValue('mobile', '', { shouldValidate: false });
    } else {
      form.setValue('email', '', { shouldValidate: false });
    }
  }, [form, mode]);

  const modeOptions = React.useMemo(
    () => [
      { label: 'Email', value: 'email' },
      { label: 'Mobile', value: 'mobile' },
    ],
    [],
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
        values.mode === 'mobile' ? (values.mobile ?? '').trim() : undefined,
      remember: 1,
    });
  });

  return (
    <>
      <SelectField
        options={modeOptions}
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
          onChangeText={value =>
            form.setValue('mobile', value, {
              shouldValidate: true,
              shouldDirty: true,
            })
          }
          onBlur={() => {
            form.trigger('mobile').catch(() => {});
          }}
          error={form.formState.errors.mobile?.message}
        />
      )}

      <InputField
        accessibilityLabel={t('screens.login.password')}
        placeholder={t('screens.login.password')}
        secureTextEntry
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
        <Text style={s.helperText}>Use your app credentials to continue.</Text>
      ) : null}

      <Button disabled={isSubmitting} onPress={submit}>
        {isSubmitting ? 'Signing in...' : t('screens.login.submit')}
      </Button>
    </>
  );
}
