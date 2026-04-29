import * as React from 'react';

import type { AppLeafRouteName } from '@/shared/contracts/navigationApp';
import { HubMenuRow, type HubMenuRowStyleSet } from '@/ui/components/HubMenuRow';

export type MenuItemProps = {
  icon: string;
  title: string;
  route: AppLeafRouteName;
  onNavigate: (route: AppLeafRouteName) => void;
  styles: HubMenuRowStyleSet;
};

/**
 * Profile shortcut row: icon, label, chevron. Delegates row chrome to {@link HubMenuRow}.
 */
export const MenuItem = React.memo(function MenuItem({
  icon,
  title,
  route,
  onNavigate,
  styles: s,
}: MenuItemProps) {
  const onPress = React.useCallback(() => {
    onNavigate(route);
  }, [onNavigate, route]);

  return <HubMenuRow icon={icon} title={title} onPress={onPress} s={s} />;
});
MenuItem.displayName = 'MenuItem';
