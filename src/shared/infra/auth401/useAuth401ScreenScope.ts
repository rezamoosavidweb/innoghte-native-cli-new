import { useFocusEffect } from '@react-navigation/native';
import * as React from 'react';

import type { Auth401PolicyInput } from '@/shared/infra/auth401/types';
import { pushAuth401ScreenPolicy } from '@/shared/infra/auth401/screenScope';

/**
 * While this screen is focused, merge `policy` into 401 resolution (under per-request ky context).
 * Pass a stable `policy` object (useMemo) when possible.
 */
export function useAuth401ScreenScope(policy: Auth401PolicyInput): void {
  useFocusEffect(
    React.useCallback(() => {
      return pushAuth401ScreenPolicy(policy);
    }, [policy]),
  );
}
