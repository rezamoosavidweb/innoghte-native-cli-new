import * as React from 'react';
import { View, type ViewStyle } from 'react-native';

import type { AppLeafRouteName } from '@/shared/contracts/navigationApp';
import {
  type HubMenuIcon,
  type HubMenuRowStyleSet,
} from '@/ui/components/HubMenuRow';
import { MenuItem } from '@/ui/components/MenuItem';

/** A single hub menu row — resolved title + typed navigation target. */
export type MenuSectionItem = {
  readonly id: string;
  readonly title: string;
  readonly icon: HubMenuIcon;
  readonly route: AppLeafRouteName;
};

export type MenuSectionStyleSet = HubMenuRowStyleSet & { list: ViewStyle };

export type MenuSectionProps = {
  items: readonly MenuSectionItem[];
  styles: MenuSectionStyleSet;
  onNavigate: (route: AppLeafRouteName) => void;
  footer?: React.ReactNode;
};

/**
 * Generic vertical stack of navigable {@link MenuItem} rows. Shared by the
 * profile hub, gift hub and services screens.
 */
export const MenuSection = React.memo(function MenuSection({
  items,
  styles: s,
  onNavigate,
  footer,
}: MenuSectionProps) {
  return (
    <View style={s.list}>
      {items.map(entry => (
        <MenuItem
          key={entry.id}
          icon={entry.icon}
          title={entry.title}
          route={entry.route}
          onNavigate={onNavigate}
          styles={s}
        />
      ))}
      {footer}
    </View>
  );
});
MenuSection.displayName = 'MenuSection';
