import type { Auth401PolicyInput } from '@/shared/infra/auth401/types';

/**
 * App-wide defaults for 401 handling (matches legacy behavior: session clear only).
 * Override in `wireAppHttpClient` if most routes should redirect by default.
 */
let globalAuth401Defaults: Auth401PolicyInput = {
  strategy: 'no_redirect',
  redirectToLogin: false,
};

export function setGlobalAuth401Defaults(
  next: Auth401PolicyInput,
): void {
  globalAuth401Defaults = { ...globalAuth401Defaults, ...next };
}

export function getGlobalAuth401Defaults(): Auth401PolicyInput {
  return globalAuth401Defaults;
}
