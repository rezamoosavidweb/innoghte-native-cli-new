/**
 * Mirrors web `NEXT_PUBLIC_IS_DOT_IR` for IR vs COM API scope.
 * Set via Metro/babel env, e.g. `REACT_NATIVE_IS_DOT_IR=ir`.
 */
const env =
  (globalThis as { process?: { env?: Record<string, string | undefined> } })
    .process?.env ?? {};

export function resolveIsDotIr(): boolean {
  return env.REACT_NATIVE_IS_DOT_IR === 'ir' || env.IS_DOT_IR === 'ir';
}

export function scopeHeader(): { Scope: 'ir' | 'com' } {
  return { Scope: resolveIsDotIr() ? 'ir' : 'com' };
}
