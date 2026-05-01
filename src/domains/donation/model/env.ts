const env =
  (globalThis as { process?: { env?: Record<string, string | undefined> } })
    .process?.env ?? {};

export function resolveShowZarinpal(): boolean {
  return env.REACT_NATIVE_IS_SHOW_ZARINPAL === 'true';
}

export function resolveShowVandar(): boolean {
  return env.REACT_NATIVE_IS_SHOW_VANDAR === 'true';
}
