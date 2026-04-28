import * as React from 'react';
import { DrawerActions, useTheme } from '@react-navigation/native';
import { StyleSheet, Text } from 'react-native';
import { HeaderButton } from '@react-navigation/elements';

import { useAppNavigation } from '@/shared/lib/navigation/useAppNavigation';
import { pickSemantic } from '@/ui/theme';

/** Opens the parent drawer from screens nested under `MainTabs` (see article “Strategy 1”). */
export const DrawerMenuButton = React.memo(function DrawerMenuButton() {
  const navigation = useAppNavigation();
  const theme = useTheme();
  const s = pickSemantic(theme.dark);

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        icon: {
          fontSize: 22,
          fontWeight: '600',
          paddingHorizontal: 4,
          color: s.headerForeground,
        },
      }),
    [s.headerForeground],
  );

  return (
    <HeaderButton
      accessibilityLabel="Open navigation menu"
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
    >
      <Text style={styles.icon}>☰</Text>
    </HeaderButton>
  );
});
