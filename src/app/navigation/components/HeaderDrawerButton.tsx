import { DrawerActions } from '@react-navigation/native';
import { HeaderButton } from '@react-navigation/elements';
import * as React from 'react';

import HamburgerIcon from '@/assets/icons/hamburger.svg';
import { useAppNavigation } from '@/shared/lib/navigation/useAppNavigation';
import { headerButtonStyles } from './headerButton.styles';

type Props = { tintColor?: string };

export const HeaderDrawerButton = React.memo(function HeaderDrawerButton({
  tintColor,
}: Props) {
  const navigation = useAppNavigation();

  const handlePress = React.useCallback(() => {
    navigation.dispatch(DrawerActions.toggleDrawer());
  }, [navigation]);

  return (
    <HeaderButton accessibilityLabel="Open navigation menu" onPress={handlePress}>
      <HamburgerIcon
        width={headerButtonStyles.drawerIcon.fontSize}
        height={headerButtonStyles.drawerIcon.fontSize}
        color={tintColor}
      />
    </HeaderButton>
  );
});
HeaderDrawerButton.displayName = 'HeaderDrawerButton';
