import * as React from 'react';

import {
  completeWelcomeGuide,
  hasCompletedWelcomeGuide,
} from '@/domains/onboarding/model/welcomeGuide';

export function useWelcomeGuide(ready: boolean) {
  const [completed, setCompleted] = React.useState(hasCompletedWelcomeGuide);

  const dismiss = React.useCallback(() => {
    completeWelcomeGuide();
    setCompleted(true);
  }, []);

  return { visible: ready && !completed, dismiss };
}
