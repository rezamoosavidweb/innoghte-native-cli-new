/**
 * Mirrors web `NEXT_PUBLIC_IS_SHOW_*` for donation behavior.
 * `resolveIsDotIr` lives in `@/shared/config/resolveIsDotIr`.
 */
const env =
  (globalThis as { process?: { env?: Record<string, string | undefined> } })
    .process?.env ?? {};

export { resolveIsDotIr } from '@/shared/config/resolveIsDotIr';

export function resolveShowZarinpal(): boolean {
  return env.REACT_NATIVE_IS_SHOW_ZARINPAL === 'true';
}

export function resolveShowVandar(): boolean {
  return env.REACT_NATIVE_IS_SHOW_VANDAR === 'true';
}
