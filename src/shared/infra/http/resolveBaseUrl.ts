export function resolveApiBaseUrl(): string {
  const env =
    (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};

  return env.API_BASE_URL ?? env.REACT_NATIVE_API_URL ?? 'https://apistg.innoghte.ir';
}
