/**
 * Explicit donation checkout + gateway verification state machine.
 * Pure transitions only — side effects live in `useDonationFlowEffects`.
 */

export type DonationFlowState =
  | { status: 'idle' }
  | { status: 'creating_checkout' }
  | { status: 'checkout_ready'; gateway: string; url: string }
  | { status: 'redirecting' }
  | { status: 'verifying'; verificationKey: string }
  | { status: 'success' }
  | { status: 'error'; error?: string };

export type DonationFlowEvent =
  | { type: 'START_CHECKOUT' }
  | { type: 'CHECKOUT_SUCCESS'; url: string; gateway: string }
  | { type: 'CHECKOUT_ERROR'; error?: string }
  | { type: 'REDIRECTED' }
  | { type: 'CHECKOUT_INLINE_SUCCESS' }
  | { type: 'START_VERIFICATION'; key: string }
  | { type: 'VERIFICATION_SUCCESS' }
  | { type: 'VERIFICATION_ERROR'; error?: string }
  | { type: 'RESET' };

export const donationFlowInitialState: DonationFlowState = { status: 'idle' };

export function transition(
  state: DonationFlowState,
  event: DonationFlowEvent,
): DonationFlowState {
  switch (event.type) {
    case 'START_CHECKOUT':
      return { status: 'creating_checkout' };

    case 'CHECKOUT_SUCCESS':
      if (state.status !== 'creating_checkout') return state;
      return {
        status: 'checkout_ready',
        gateway: event.gateway,
        url: event.url,
      };

    case 'CHECKOUT_INLINE_SUCCESS':
      if (state.status !== 'creating_checkout') return state;
      return { status: 'success' };

    case 'CHECKOUT_ERROR':
      return donationFlowInitialState;

    case 'REDIRECTED':
      if (state.status !== 'checkout_ready') return state;
      return { status: 'redirecting' };

    case 'START_VERIFICATION':
      if (state.status === 'success' || state.status === 'error') return state;
      if (
        state.status === 'verifying' &&
        state.verificationKey === event.key
      ) {
        return state;
      }
      return { status: 'verifying', verificationKey: event.key };

    case 'VERIFICATION_SUCCESS':
      if (state.status !== 'verifying') return state;
      return { status: 'success' };

    case 'VERIFICATION_ERROR':
      if (state.status !== 'verifying') return state;
      return { status: 'error', error: event.error };

    case 'RESET':
      return donationFlowInitialState;
  }
}
