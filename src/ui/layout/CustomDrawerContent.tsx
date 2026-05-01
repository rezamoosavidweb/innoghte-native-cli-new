import * as React from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
  type DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { useTheme } from '@react-navigation/native';
import { TouchableOpacity, View } from 'react-native';
import { Text } from '@/shared/ui/Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { useShellDrawerModel } from '@/ui/layout/ShellDrawerContext';
import {
  staticDrawerStyles,
  useCustomDrawerDynamicStyles,
} from '@/ui/layout/customDrawerContent.styles';
import { pickSemantic } from '@/ui/theme';
import { version as appVersion } from 'appPackage';

export const CustomDrawerContent = React.memo(function CustomDrawerContent(
  props: DrawerContentComponentProps,
) {
  const { state, navigation, descriptors } = props;
  const { t } = useTranslation();
  const { onRequestLogout, isDrawerOnPhysicalRight: isDrawerOnRight, user: drawerUser } =
    useShellDrawerModel();
  const theme = useTheme();
  const { colors } = theme;
  const s = pickSemantic(theme);
  const displayName = drawerUser.displayName;
  const emailLine = drawerUser.emailLine;
  const avatarInitials = drawerUser.avatarInitials;

  const dynamicStyles = useCustomDrawerDynamicStyles(colors, s, isDrawerOnRight);

  const handleLogout = React.useCallback(() => {
    return onRequestLogout();
  }, [onRequestLogout]);

  return (
    <SafeAreaView style={staticDrawerStyles.safe} edges={['top', 'bottom']}>
      <View style={dynamicStyles.sheet}>
        <View style={dynamicStyles.profileSection}>
          <View style={dynamicStyles.avatar}>
            <Text style={staticDrawerStyles.avatarText}>{avatarInitials}</Text>
          </View>
          <View style={staticDrawerStyles.profileInfo}>
            <Text style={dynamicStyles.userName}>{displayName}</Text>
            <Text style={dynamicStyles.userEmail}>{emailLine}</Text>
          </View>
        </View>

        <View style={dynamicStyles.divider} />

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
          <TouchableOpacity style={staticDrawerStyles.footerItem} onPress={handleLogout}>
            <Text style={dynamicStyles.footerIconGlyph}>⎋</Text>
            <Text style={dynamicStyles.footerItemText}>
              {t('drawerFooter.logout')}
            </Text>
          </TouchableOpacity>
          <Text style={dynamicStyles.version}>
            {t('drawerFooter.version', { version: appVersion })}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
});
