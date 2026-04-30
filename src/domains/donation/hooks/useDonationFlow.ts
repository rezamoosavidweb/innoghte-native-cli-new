import * as React from 'react';

import {
  donationFlowInitialState,
  transition,
  type DonationFlowEvent,
  type DonationFlowState,
} from '@/domains/donation/model/donationFlowMachine';

export function useDonationFlow() {
  const [flow, setFlow] = React.useState<DonationFlowState>(
    donationFlowInitialState,
  );

  const send = React.useCallback((event: DonationFlowEvent) => {
    setFlow(prev => transition(prev, event));
  }, []);

  return { flow, send };
}

export type DonationFlowSend = (event: DonationFlowEvent) => void;
