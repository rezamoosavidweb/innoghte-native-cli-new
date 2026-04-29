import type { Options } from 'ky';

import type { Auth401PolicyInput } from '@/shared/infra/auth401/types';

/** Key on ky `context` for per-request auth401 overrides. */
export const AUTH401_KY_CONTEXT_KEY = 'auth401';

export type Auth401KyContext = Record<string, unknown> & {
  [AUTH401_KY_CONTEXT_KEY]?: Auth401PolicyInput;
};

/** Merge ky options with per-request auth401 policy (shallow `context` merge). */
export function withKyAuth401Context(
  policy: Auth401PolicyInput,
  base?: Options,
): Options {
  const prev = base?.context ?? {};
  return {
    ...base,
    context: {
      ...prev,
      [AUTH401_KY_CONTEXT_KEY]: {
        ...(typeof prev[AUTH401_KY_CONTEXT_KEY] === 'object' &&
        prev[AUTH401_KY_CONTEXT_KEY] !== null
          ? (prev[AUTH401_KY_CONTEXT_KEY] as Auth401PolicyInput)
          : {}),
        ...policy,
      },
    },
  };
}

export function readAuth401FromKyContext(
  context: Record<string, unknown> | undefined,
): Auth401PolicyInput | undefined {
  if (!context) {
    return undefined;
  }
  const raw = context[AUTH401_KY_CONTEXT_KEY];
  if (!raw || typeof raw !== 'object') {
    return undefined;
  }
  return raw as Auth401PolicyInput;
}
