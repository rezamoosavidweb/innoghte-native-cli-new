import type { DrawerScreenProps } from '@react-navigation/drawer';
import * as React from 'react';
import { useEffect, useMemo } from 'react';

import { resolveShowZarinpal } from '@/domains/donation/model/env';
import { DONATION_LAST_CHECKOUT_GATEWAY_KEY } from '@/domains/donation/model/storageKeys';
import type { DrawerParamList } from '@/shared/contracts/navigationApp';
import { StorageService } from '@/shared/infra/storage/storage.service';

type DonationRoute = DrawerScreenProps<DrawerParamList, 'Donation'>['route'];

export function useDonationGatewayPicker(route: DonationRoute, isDotIr: boolean) {
  const [gateway, setGateway] = React.useState<string>(() =>
    isDotIr ? (resolveShowZarinpal() ? 'zarinpal' : 'vandar') : 'paypal',
  );

  useEffect(() => {
    const g = route.params?.gatewayName?.trim();
    if (g && (g === 'zarinpal' || g === 'vandar' || g === 'paypal')) {
      setGateway(g);
    }
  }, [route.params?.gatewayName]);

  const verifyGateway = useMemo(() => {
    const fromRoute = route.params?.gatewayName?.trim();
    if (fromRoute) return fromRoute;
    const stored = StorageService.get<string>(DONATION_LAST_CHECKOUT_GATEWAY_KEY);
    if (stored) return stored;
    return gateway;
  }, [gateway, route.params?.gatewayName]);

  return { gateway, setGateway, verifyGateway };
}
