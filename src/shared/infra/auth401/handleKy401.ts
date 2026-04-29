import { captureResumeRouteFromNavigationRef } from '@/shared/infra/auth401/captureRoute';
import {
  auth401ClearSessionTokensOnly,
  auth401SetPendingNavigation,
} from '@/shared/infra/auth401/configureBridge';
import { getGlobalAuth401Defaults } from '@/shared/infra/auth401/globalDefaults';
import {
  readAuth401FromKyContext,
} from '@/shared/infra/auth401/kyContext';
import { queue401PostLogin } from '@/shared/infra/auth401/post401LoginQueue';
import { resolveAuth401Policy } from '@/shared/infra/auth401/resolvePolicy';
import { getFocusedAuth401ScreenPolicy } from '@/shared/infra/auth401/screenScope';
import type { ResolvedAuth401Policy } from '@/shared/infra/auth401/types';
import { safeNavigateToLoginFrom401 } from '@/shared/infra/auth401/loginNavigationGuard';

export type Ky401UnauthorizedDetail = {
  kyContext: Record<string, unknown>;
};

function applyResolved401Policy(policy: ResolvedAuth401Policy): void {
  if (policy.strategy === 'custom_route_function') {
    if (policy.customPostLogin) {
      queue401PostLogin(policy.customPostLogin);
    }
    auth401ClearSessionTokensOnly();
    if (policy.redirectToLogin) {
      safeNavigateToLoginFrom401();
    }
    return;
  }

  switch (policy.strategy) {
    case 'force_specific_route': {
      if (policy.forcedTarget) {
        auth401SetPendingNavigation(policy.forcedTarget);
      }
      break;
    }
    case 'back_to_previous_screen': {
      const snap = captureResumeRouteFromNavigationRef();
      if (snap) {
        auth401SetPendingNavigation(snap);
      }
      break;
    }
    case 'login_only': {
      auth401SetPendingNavigation(null);
      break;
    }
    case 'no_redirect':
    default:
      break;
  }

  auth401ClearSessionTokensOnly();

  if (policy.redirectToLogin) {
    safeNavigateToLoginFrom401();
  }
}

export function handleKy401Unauthorized(detail: Ky401UnauthorizedDetail): void {
  const requestLayer = readAuth401FromKyContext(detail.kyContext);
  const merged = resolveAuth401Policy(
    getGlobalAuth401Defaults(),
    getFocusedAuth401ScreenPolicy(),
    requestLayer,
  );
  applyResolved401Policy(merged);
}
