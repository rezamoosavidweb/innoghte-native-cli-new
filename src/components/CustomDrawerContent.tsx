import * as React from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
  type DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { appBrand } from '../theme/navigationTheme';

const DEMO_USER = {
  name: 'Alex Rivera',
  email: 'alex@example.com',
  initials: 'AR',
} as const;

export const CustomDrawerContent = React.memo(function CustomDrawerContent(
  props: DrawerContentComponentProps,
) {
  const { state, navigation, descriptors } = props;
  const { t } = useTranslation();

  const handleLogout = (): void => {
    // Swap for auth sign-out when you add accounts.
    console.log('Logout pressed');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{DEMO_USER.initials}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>{DEMO_USER.name}</Text>
          <Text style={styles.userEmail}>{DEMO_USER.email}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.scrollContent}
      >
        <DrawerItemList
          state={state}
          navigation={navigation}
          descriptors={descriptors}
        />
      </DrawerContentScrollView>

      <View style={styles.footer}>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.footerItem} onPress={handleLogout}>
          <Text style={styles.footerIcon}>⎋</Text>
          <Text style={styles.footerItemText}>{t('drawerFooter.logout')}</Text>
        </TouchableOpacity>
        <Text style={styles.version}>
          {t('drawerFooter.version', { version: '0.0.1' })}
        </Text>
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#f5f5f5',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: appBrand.drawerActiveTint,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: appBrand.drawerActiveTint,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  profileInfo: {
    marginLeft: 14,
    flex: 1,
  },
  userName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 12,
  },
  scrollContent: {
    paddingTop: 8,
  },
  footer: {
    paddingBottom: 8,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  footerIcon: {
    fontSize: 18,
    color: appBrand.danger,
    marginRight: 10,
  },
  footerItemText: {
    fontSize: 16,
    color: appBrand.danger,
    fontWeight: '600',
  },
  version: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
});
