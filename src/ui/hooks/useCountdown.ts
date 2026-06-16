import * as React from 'react';

/**
 * Single shared resend countdown for OTP / verification flows (register OTP,
 * contact OTP, forget-password resend). Counts down from `seconds`; call
 * `reset()` to restart after a resend. Lives in the `ui` layer so both the
 * shared `OtpVerification` component and domain screens can consume it.
 */
export function useCountdown(seconds: number) {
  const [remaining, setRemaining] = React.useState(seconds);
  const active = remaining > 0;

  React.useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setRemaining(r => Math.max(0, r - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [active]);

  const reset = React.useCallback(() => setRemaining(seconds), [seconds]);
  return { remaining, reset, expired: remaining === 0 };
}

export function formatCountdown(remaining: number): string {
  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}
