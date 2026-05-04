import * as React from 'react';
import { View } from 'react-native';

import { MenuItem } from '@/domains/user/components/MenuItem';
import type { ProfileMenuListItem } from '@/domains/user/model/profileMenu.types';
import type { ProfileScreenMenuStyleSet } from '@/domains/user/ui/profileScreen.styles';
import type { AppLeafRouteName } from '@/shared/contracts/navigationApp';

export type ProfileMenuSectionProps = {
  items: readonly ProfileMenuListItem[];
  menuStyles: ProfileScreenMenuStyleSet;
  onNavigate: (route: AppLeafRouteName) => void;
  footer?: React.ReactNode;
};

export const ProfileMenuSection = React.memo(function ProfileMenuSection({
  items,
  menuStyles,
  onNavigate,
  footer,
}: ProfileMenuSectionProps) {
  return (
    <View style={menuStyles.list}>
      {items.map(entry => (
        <MenuItem
          key={entry.id}
          icon={entry.icon}
          title={entry.title}
          route={entry.route}
          onNavigate={onNavigate}
          styles={menuStyles}
        />
      ))}
      {footer}
    </View>
  );
});
ProfileMenuSection.displayName = 'ProfileMenuSection';
