import { createNavigationContainerRef } from '@react-navigation/native';

import type { DrawerParamList } from '@/shared/contracts/navigationApp';

export const navigationRef = createNavigationContainerRef<DrawerParamList>();
