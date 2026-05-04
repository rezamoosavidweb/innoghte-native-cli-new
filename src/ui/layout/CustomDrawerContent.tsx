import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PUBLIC_WEB_ORIGIN } from '@/shared/config/publicWebOrigin';
import { Text } from '@/shared/ui/Text';
import {
  staticDrawerStyles,
  useCustomDrawerDynamicStyles,
} from '@/ui/layout/customDrawerContent.styles';
import { DrawerFooterSocials } from '@/ui/layout/DrawerFooterSocials';
import { useShellDrawerModel } from '@/ui/layout/ShellDrawerContext';
import { Button } from '@/ui/components/Button';
import { pickSemantic } from '@/ui/theme';
import { version as appVersion } from 'appPackage';

const REGISTER_WEB_URL = `${PUBLIC_WEB_ORIGIN}/auth/register`;

export const CustomDrawerContent = React.memo(function CustomDrawerContent(
  props: DrawerContentComponentProps,
) {
  const { state, navigation, descriptors } = props;
  const { t } = useTranslation();
  const { onRequestLogout, user: drawerUser } = useShellDrawerModel();
  const theme = useTheme();
  const { colors } = theme;
  const s = pickSemantic(theme);
  const displayName = drawerUser.displayName;
  const emailLine = drawerUser.emailLine;
  const avatarInitials = drawerUser.avatarInitials;

  const dynamicStyles = useCustomDrawerDynamicStyles(colors, s);

  const handleLogout = React.useCallback(() => {
    return onRequestLogout();
  }, [onRequestLogout]);

  const onLogin = React.useCallback(() => {
    navigation.navigate('Login');
  }, [navigation]);

  const onRegister = React.useCallback(() => {
    Linking.openURL(REGISTER_WEB_URL);
  }, []);

  const isAuthed = drawerUser.isAuthenticated;

  return (
    <SafeAreaView style={staticDrawerStyles.safe} edges={['top', 'bottom']}>
      <View style={dynamicStyles.sheet}>
        {isAuthed ? (
          <>
            <View style={dynamicStyles.profileSection}>
              <View style={dynamicStyles.avatar}>
                <Text style={staticDrawerStyles.avatarText}>
                  {avatarInitials}
                </Text>
              </View>
              <View style={staticDrawerStyles.profileInfo}>
                <Text style={dynamicStyles.userName}>{displayName}</Text>
                <Text style={dynamicStyles.userEmail}>{emailLine}</Text>
              </View>
            </View>
            <View style={dynamicStyles.divider} />
          </>
        ) : (
          <>
            <View style={staticDrawerStyles.guestActions}>
              <Button
                layout="auto"
                variant="filled"
                title={t('drawer.guest.login')}
                style={dynamicStyles.guestBtnPrimary}
                onPress={onLogin}
                contentStyle={{ width: '100%' }}
              >
                <Text style={dynamicStyles.guestBtnPrimaryLabel}>
                  {t('drawer.guest.login')}
                </Text>
              </Button>
              <Button
                layout="auto"
                variant="outlined"
                title={t('drawer.guest.register')}
                style={dynamicStyles.guestBtnOutline}
                onPress={onRegister}
                contentStyle={{ width: '100%' }}
              >
                <Text style={dynamicStyles.guestBtnOutlineLabel}>
                  {t('drawer.guest.register')}
                </Text>
              </Button>
            </View>
            <View style={dynamicStyles.divider} />
          </>
        )}

        <DrawerContentScrollView
          {...props}
          contentContainerStyle={staticDrawerStyles.scrollContent}
        >
          <DrawerItemList
            state={state}
            navigation={navigation}
            descriptors={descriptors}
          />
        </DrawerContentScrollView>

        <View style={staticDrawerStyles.footer}>
          <View style={dynamicStyles.divider} />
          <DrawerFooterSocials />
          {isAuthed ? (
            <Button
              layout="auto"
              variant="text"
              title={t('drawerFooter.logout')}
              style={staticDrawerStyles.footerItem}
              onPress={handleLogout}
              contentStyle={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                width: '100%',
              }}
            >
              <Text style={dynamicStyles.footerIconGlyph}>⎋</Text>
              <Text style={dynamicStyles.footerItemText}>
                {t('drawerFooter.logout')}
              </Text>
            </Button>
          ) : null}
          <Text style={dynamicStyles.version}>
            {t('drawerFooter.version', { version: appVersion })}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
});

CustomDrawerContent.displayName = 'CustomDrawerContent';
