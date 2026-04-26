import { createNavigationContainerRef } from '@react-navigation/native';

import type { DrawerParamList } from '@/shared/navigation/types';

export const navigationRef = createNavigationContainerRef<DrawerParamList>();
