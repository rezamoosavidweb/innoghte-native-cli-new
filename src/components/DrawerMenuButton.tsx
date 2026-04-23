import * as React from 'react';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { StyleSheet, Text } from 'react-native';
import { HeaderButton } from '@react-navigation/elements';

import { appBrand } from '../theme/navigationTheme';

/** Opens the parent drawer from screens nested under `MainTabs` (see article “Strategy 1”). */
export const DrawerMenuButton = React.memo(function DrawerMenuButton() {
  const navigation = useNavigation();

  return (
    <HeaderButton
      accessibilityLabel="Open navigation menu"
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
    >
      <Text style={[styles.icon, { color: appBrand.headerForeground }]}>☰</Text>
    </HeaderButton>
  );
});

const styles = StyleSheet.create({
  icon: {
    fontSize: 22,
    fontWeight: '600',
    paddingHorizontal: 4,
  },
});
