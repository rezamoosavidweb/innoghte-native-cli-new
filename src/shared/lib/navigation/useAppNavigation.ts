import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import type { CompositeNavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

import type { DrawerParamList, TabParamList } from '@/shared/contracts/navigationApp';

/**
 * Single source of truth for in-app navigation typing.
 *
 * Composes the tab + drawer surfaces so any screen — whether nested inside
 * `MainTabs` or registered directly on the root drawer — gets fully typed
 * `navigate`, `dispatch`, `openDrawer`, etc. with no `ParamListBase` casts.
 */
export type AppNavigation = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList>,
  DrawerNavigationProp<DrawerParamList>
>;

export function useAppNavigation(): AppNavigation {
  return useNavigation<AppNavigation>();
}
