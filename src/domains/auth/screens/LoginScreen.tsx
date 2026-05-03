import type { DrawerScreenProps } from '@react-navigation/drawer';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ImageBackground, KeyboardAvoidingView, Platform, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Text } from '@/shared/ui/Text';
import Logo from '@/assets/logo.svg';

import { completePendingAuthNavigation } from '@/app/bridge/auth/protectedNavigation';
import { LoginForm } from '@/domains/auth/ui/forms/LoginForm';
import { useLogin } from '@/domains/auth/hooks/useAuth';
import type { DrawerParamList } from '@/shared/contracts/navigationApp';
import { createLoginScreenStyles } from '@/domains/auth/ui/styles';
import { Button } from '@/ui/components/Button';
import { useThemeColors } from '@/ui/theme';
import { useAppNavigation } from '@/shared/lib/navigation/useAppNavigation';
import { resolveErrorMessage } from '@/shared/infra/http';

const BG_IMAGE = require('@/assets/images/login.jpg');

type Props = DrawerScreenProps<DrawerParamList, 'Login'>;

const LoginScreenComponent = (_props: Props) => {
  const colors = useThemeColors();
  const { t } = useTranslation();
  const s = React.useMemo(() => createLoginScreenStyles(colors), [colors]);
  const navigation = useAppNavigation();
  const mutation = useLogin();
  const apiError = mutation.error ? resolveErrorMessage(mutation.error, '') : null;

  const onSubmit = React.useCallback(
    async (payload: Parameters<typeof mutation.mutateAsync>[0]) => {
      await mutation.mutateAsync(payload);
      completePendingAuthNavigation();
    },
    [mutation],
  );

  const goToRegister = React.useCallback(() => {
    navigation.navigate('Register');
  }, [navigation]);

  return (
    <ImageBackground source={BG_IMAGE} style={s.flex} resizeMode="cover">
      <LinearGradient
        locations={[0.3, 0.5, 1]}
        colors={['#ffffff00', '#09101D69', '#09101D']}
        style={s.overlay}
      />
      <View style={s.logoContainer}>
        <Logo width={118} height={50} color="#000000" />
      </View>
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
          <View style={s.registerCta}>
            <Text style={s.registerCtaText}>{t('screens.login.noAccount')}</Text>
            <Button
              variant="text"
              title={t('screens.login.registerLink')}
              onPress={goToRegister}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export const LoginScreen = React.memo(LoginScreenComponent);
LoginScreen.displayName = 'LoginScreen';
