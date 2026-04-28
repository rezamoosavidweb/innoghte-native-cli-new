import type { NavigationAction } from '@react-navigation/native';
import * as React from 'react';

import type { AppLeafRouteName, LeafRouteParams } from '@/shared/contracts/navigationApp';
import { useAppNavigation } from '@/shared/lib/navigation/useAppNavigation';
import {
  protectedDispatch,
  protectedNavigate,
  protectedPush,
} from '@/app/bridge/auth/protectedNavigation';

type ProtectedNavigationApi = {
  navigate: <N extends AppLeafRouteName>(
    name: N,
    params?: LeafRouteParams<N>,
  ) => void;
  push: <N extends AppLeafRouteName>(
    name: N,
    params?: LeafRouteParams<N>,
  ) => void;
  dispatch: (action: NavigationAction) => void;
};

export function useProtectedNavigation(): ProtectedNavigationApi {
  const navigation = useAppNavigation();

  return React.useMemo(
    () => ({
      navigate: (name, params) => protectedNavigate(navigation, name, params),
      push: (name, params) => protectedPush(navigation, name, params),
      dispatch: action => protectedDispatch(navigation, action),
    }),
    [navigation],
  );
}
