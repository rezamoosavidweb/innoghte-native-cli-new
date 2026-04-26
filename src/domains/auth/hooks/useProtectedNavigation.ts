import type {
  NavigationAction,
  NavigationProp,
  ParamListBase,
} from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import * as React from 'react';

import type { AppLeafRouteName, LeafRouteParams } from '@/shared/contracts/navigationApp';
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

/**
 * Uses a widened navigation handle so tab/drawer composites work without
 * augmenting global `RootParamList` (which would force repo-wide param sync).
 */
export function useProtectedNavigation(): ProtectedNavigationApi {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  return React.useMemo(
    () => ({
      navigate: (name, params) => protectedNavigate(navigation, name, params),
      push: (name, params) => protectedPush(navigation, name, params),
      dispatch: action => protectedDispatch(navigation, action),
    }),
    [navigation],
  );
}
