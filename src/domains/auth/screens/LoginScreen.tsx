import type { DrawerScreenProps } from '@react-navigation/drawer';
import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';

import { LoginForm } from '@/domains/auth/ui/forms/LoginForm';
import { ApiError } from '@/shared/infra/http/apiError';
import { useLogin } from '@/domains/auth/hooks/useAuth';
import type { DrawerParamList } from '@/shared/contracts/navigationApp';
import { useLoginScreenStyles } from '@/domains/auth/ui/styles';

type Props = DrawerScreenProps<DrawerParamList, 'Login'>;

const LoginScreenComponent = (props: Props) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const s = useLoginScreenStyles(colors);
  const mutation = useLogin();
  const apiError =
    mutation.error instanceof ApiError
      ? mutation.error.message
      : mutation.error instanceof Error
      ? mutation.error.message
      : null;

  const onSubmit = React.useCallback(
    async (payload: Parameters<typeof mutation.mutateAsync>[0]) => {
      await mutation.mutateAsync(payload);
      props.navigation.navigate('MainTabs');
    },
    [props.navigation, mutation],
  );

  return (
    <KeyboardAvoidingView
      style={s.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={s.inner}>
        <Text style={s.title}>{t('screens.login.title')}</Text>
        <Text style={s.sub}>{t('screens.login.subtitle')}</Text>
        <LoginForm
          isSubmitting={mutation.isPending}
          apiError={apiError}
          onSubmit={onSubmit}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export const LoginScreen = React.memo(LoginScreenComponent);
LoginScreen.displayName = 'LoginScreen';
