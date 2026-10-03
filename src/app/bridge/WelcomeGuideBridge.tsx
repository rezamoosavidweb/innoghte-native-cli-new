import * as React from 'react';

import { useCurrentUser, useIsAuthenticated } from '@/domains/auth';
import { WelcomeGuide } from '@/domains/onboarding';
import { navigationRef } from '@/shared/infra/navigation/navigationRef';

const AUTH_ROUTE_NAMES = new Set([
  'Splash',
  'AuthEntry',
  'Login',
  'Register',
  'Verify',
  'ForgetPassword',
]);

/** Wait for login and its destination; leave the current route/deep link intact. */
export function WelcomeGuideBridge() {
  const isAuthenticated = useIsAuthenticated();
  const { data: userResponse } = useCurrentUser();
  const userId = isAuthenticated ? userResponse?.data.id ?? null : null;
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const update = () => {
      if (!navigationRef.isReady()) {
        setReady(false);
        return;
      }
      const route = navigationRef.getCurrentRoute();
      setReady(!!route && !AUTH_ROUTE_NAMES.has(route.name));
    };
    const offReady = navigationRef.addListener('ready', update);
    const offState = navigationRef.addListener('state', update);
    update();
    return () => {
      offReady();
      offState();
    };
  }, []);

  return <WelcomeGuide ready={ready && isAuthenticated} userId={userId} />;
}
