import type { DrawerScreenProps } from '@react-navigation/drawer';
import * as React from 'react';
import { useEffect, useMemo } from 'react';
import { Linking } from 'react-native';

import {
  hasDonationCallbackHints,
  mergeDonationCallbackSources,
  parsePaymentParamsFromUrl,
  type PaymentGatewayParams,
} from '@/domains/donation/model/donationCallbackParams';
import type { DonationScreenParams } from '@/domains/donation/model/routeParams';
import type { DrawerParamList } from '@/shared/contracts/navigationApp';

type DonationRoute = DrawerScreenProps<DrawerParamList, 'Donation'>['route'];

/** Route + returnUrl + optional Linking URL capture (same merge as inline screen). */
export function useDonationCallbackParams(route: DonationRoute) {
  const params = route.params;

  const [optionalUrlCapture, setOptionalUrlCapture] = React.useState<
    Partial<PaymentGatewayParams>
  >({});

  const resetSupplementaryInput = React.useCallback(() => {
    setOptionalUrlCapture({});
  }, []);

  useEffect(() => {
    let cancelled = false;
    let subscription: { remove: () => void } | undefined;

    const applyUrl = (raw: string | null | undefined) => {
      if (cancelled || raw == null || raw === '') return;
      const parsed = parsePaymentParamsFromUrl(raw);
      if (!hasDonationCallbackHints(parsed)) return;
      setOptionalUrlCapture(prev => ({ ...prev, ...parsed }));
    };

    try {
      const initial = Linking.getInitialURL?.();
      if (
        initial != null &&
        typeof (initial as Promise<string | null>).then === 'function'
      ) {
        (initial as Promise<string | null>)
          .then(url => applyUrl(url))
          .catch(() => {});
      }
    } catch {
      /* Linking not usable in this environment */
    }

    try {
      subscription = Linking.addEventListener?.('url', event =>
        applyUrl(event?.url),
      );
    } catch {
      /* Listener unavailable */
    }

    return () => {
      cancelled = true;
      subscription?.remove?.();
    };
  }, []);

  const paymentParams = useMemo((): PaymentGatewayParams => {
    const discrete: DonationScreenParams | undefined = params ?? undefined;
    const returnUrl =
      params &&
      typeof params.returnUrl === 'string' &&
      params.returnUrl.trim() !== ''
        ? params.returnUrl
        : undefined;
    return mergeDonationCallbackSources(
      discrete,
      returnUrl,
      optionalUrlCapture,
    );
  }, [optionalUrlCapture, params]);

  return { paymentParams, resetSupplementaryInput };
}
