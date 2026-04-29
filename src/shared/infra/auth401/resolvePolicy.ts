import type {
  Auth401PolicyInput,
  Auth401RedirectStrategy,
  ResolvedAuth401Policy,
} from '@/shared/infra/auth401/types';

const DEFAULT_STRATEGY: Auth401RedirectStrategy = 'no_redirect';

function pickDefined<T>(
  global: T | undefined,
  screen: T | undefined,
  request: T | undefined,
): T | undefined {
  if (request !== undefined) {
    return request;
  }
  if (screen !== undefined) {
    return screen;
  }
  if (global !== undefined) {
    return global;
  }
  return undefined;
}

/**
 * Merge global → screen → per-request ky context. Undefined fields fall through.
 * Pure function for unit tests.
 */
export function resolveAuth401Policy(
  globalLayer: Auth401PolicyInput,
  screenLayer: Auth401PolicyInput | null | undefined,
  requestLayer: Auth401PolicyInput | undefined,
): ResolvedAuth401Policy {
  const strategy = pickDefined(
    globalLayer.strategy,
    screenLayer?.strategy,
    requestLayer?.strategy,
  ) ?? DEFAULT_STRATEGY;

  const redirectToLoginRaw = pickDefined(
    globalLayer.redirectToLogin,
    screenLayer?.redirectToLogin,
    requestLayer?.redirectToLogin,
  );

  let redirectToLogin: boolean;
  if (strategy === 'no_redirect') {
    redirectToLogin = false;
  } else if (redirectToLoginRaw !== undefined) {
    redirectToLogin = redirectToLoginRaw;
  } else {
    redirectToLogin = true;
  }

  const forcedTarget = pickDefined(
    globalLayer.forcedTarget,
    screenLayer?.forcedTarget,
    requestLayer?.forcedTarget,
  );

  const customPostLogin = pickDefined(
    globalLayer.customPostLogin,
    screenLayer?.customPostLogin,
    requestLayer?.customPostLogin,
  );

  return {
    redirectToLogin,
    strategy,
    ...(forcedTarget !== undefined ? { forcedTarget } : {}),
    ...(customPostLogin !== undefined ? { customPostLogin } : {}),
  };
}
