import { DrawerActions, useTheme } from '@react-navigation/native';
import * as React from 'react';
import { HeaderButton } from '@react-navigation/elements';
import { Text } from '@/shared/ui/Text';

import { useAppNavigation } from '@/shared/lib/navigation/useAppNavigation';
import { useDrawerMenuButtonStyles } from '@/ui/components/drawerMenuButton.styles';
import { pickSemantic } from '@/ui/theme';

/** Opens the parent drawer from screens nested under `MainTabs` (see article “Strategy 1”). */
export const DrawerMenuButton = React.memo(function DrawerMenuButton({
  iconColor,
}: {
  /** When set, overrides semantic header foreground (e.g. white on a hero image). */
  iconColor?: string;
} = {}) {
  const navigation = useAppNavigation();
  const theme = useTheme();
  const s = pickSemantic(theme);

  const styles = useDrawerMenuButtonStyles(s, iconColor);

  return (
    <HeaderButton
      accessibilityLabel="Open navigation menu"
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
    >
      <Text style={styles.icon}>☰</Text>
    </HeaderButton>
  );
});
