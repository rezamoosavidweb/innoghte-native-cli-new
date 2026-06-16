import Logo from '@/assets/logo.svg';
import { createAuthEntryScreenStyles } from '@/domains/auth/ui/authEntryScreen.styles';
import {
  AUTH_LOGO_COLOR,
  AUTH_OVERLAY_GRADIENT,
} from '@/domains/auth/ui/styles';
import type { DrawerScreenProps } from '@react-navigation/drawer';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ImageBackground, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { DrawerParamList } from '@/shared/contracts/navigationApp';
import { useAppNavigation } from '@/shared/lib/navigation/useAppNavigation';
import { Button } from '@/ui/components/Button';
import { useThemeColors } from '@/ui/theme';

const BG_IMAGE = require('@/assets/images/auth-entry.jpg');

type Props = DrawerScreenProps<DrawerParamList, 'AuthEntry'>;

const AuthEntryScreenComponent = (_props: Props) => {
  const colors = useThemeColors();
  const { t } = useTranslation();
  const s = React.useMemo(
    () => createAuthEntryScreenStyles(colors),
    [colors],
  );
  const navigation = useAppNavigation();

  const goToLogin = React.useCallback(() => {
    navigation.navigate('Login');
  }, [navigation]);

  const goToRegister = React.useCallback(() => {
    navigation.navigate('Register');
  }, [navigation]);

  const goToContact = React.useCallback(() => {
    navigation.navigate('Contact');
  }, [navigation]);

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
      <View style={s.inner}>
        <Button
          variant="filled"
          title={t('screens.authEntry.login')}
          onPress={goToLogin}
        />
        <Button
          variant="outlined"
          title={t('screens.authEntry.register')}
          onPress={goToRegister}
        />
        <Button
          variant="text"
          title={t('drawer.contact')}
          onPress={goToContact}
        />
      </View>
    </ImageBackground>
  );
};

export const AuthEntryScreen = React.memo(AuthEntryScreenComponent);
AuthEntryScreen.displayName = 'AuthEntryScreen';
