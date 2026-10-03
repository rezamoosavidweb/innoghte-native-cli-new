import * as React from 'react';

import {
  completeWelcomeGuide,
  hasCompletedWelcomeGuide,
} from '@/domains/onboarding/model/welcomeGuide';

export function useWelcomeGuide(ready: boolean, userId: number) {
  const [completed, setCompleted] = React.useState(() =>
    hasCompletedWelcomeGuide(userId),
  );

  const dismiss = React.useCallback(() => {
    completeWelcomeGuide(userId);
    setCompleted(true);
  }, [userId]);

  return { visible: ready && !completed, dismiss };
}
