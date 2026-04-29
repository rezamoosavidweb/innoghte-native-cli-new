/** Verification channel for account contact verification flows. */
export type VerifyChannel = 'email' | 'mobile';

export type VerifyStep = 'INPUT' | 'CODE';

export function isEmailChannel(channel: VerifyChannel): boolean {
  return channel === 'email';
}
