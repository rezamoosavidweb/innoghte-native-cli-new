import * as React from 'react';

import { WelcomeGuide } from '@/domains/onboarding';
import { navigationRef } from '@/shared/infra/navigation/navigationRef';

/** Wait for startup navigation; the modal leaves the current route/deep link intact. */
export function WelcomeGuideBridge() {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const update = () => {
      if (!navigationRef.isReady()) {
        setReady(false);
        return;
      }
      const route = navigationRef.getCurrentRoute();
      setReady(!!route && route.name !== 'Splash');
    };
    const offReady = navigationRef.addListener('ready', update);
    const offState = navigationRef.addListener('state', update);
    update();
    return () => {
      offReady();
      offState();
    };
  }, []);

  return <WelcomeGuide ready={ready} />;
}
