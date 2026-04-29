import type { FetchNextPageOptions } from '@tanstack/react-query';

const MAX_ATTEMPTS = 3;
const BACKOFF_MS = [300, 600, 1200] as const;

function delay(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

export type PaginationBackoffOptions = Readonly<{
  isMounted: () => boolean;
  /** Every rejected attempt (including intermediate retries). */
  onAttemptError?: (error: unknown, attemptIndexZeroBased: number) => void;
  /** Final failure after all retries exhausted (mounted only). */
  onExhausted?: (error: unknown) => void;
  /** Before sleeping between retries — marks backoff retry window for diagnostics. */
  onBackoffSleep?: (
    ms: number,
    nextAttemptWillBe: number,
    lastError: unknown,
  ) => void;
}>;

function safeRun(effect: () => void): void {
  try {
    effect();
  } catch {
    /* Optional telemetry must never abort pagination */
  }
}

/**
 * Retries `fetchNextPage` up to 3 times with exponential backoff on rejection.
 */
export async function fetchNextPageWithBackoff(
  fetchNextPage: (options?: FetchNextPageOptions) => Promise<unknown>,
  opts: PaginationBackoffOptions,
): Promise<void> {
  let lastCatch: unknown;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    if (!opts.isMounted()) {
      return;
    }
    try {
      await fetchNextPage({ cancelRefetch: false });
      return;
    } catch (e) {
      lastCatch = e;
      safeRun(() => opts.onAttemptError?.(e, attempt));

      if (attempt >= MAX_ATTEMPTS - 1) {
        if (opts.isMounted()) {
          safeRun(() => opts.onExhausted?.(lastCatch));
        }
        return;
      }

      if (!opts.isMounted()) {
        return;
      }

      const sleepMs = BACKOFF_MS[attempt] ?? 1200;
      safeRun(() =>
        opts.onBackoffSleep?.(sleepMs, attempt + 1, lastCatch),
      );
      await delay(sleepMs);
    }
  }
}
