import type { DrawerScreenProps } from '@react-navigation/drawer';

import type { DrawerParamList } from '@/shared/contracts/navigationApp';

type DonationNav = DrawerScreenProps<DrawerParamList, 'Donation'>['navigation'];

export function clearDonationRouteParams(navigation: DonationNav): void {
  navigation.setParams({
    Authority: undefined,
    Status: undefined,
    paymentId: undefined,
    PayerID: undefined,
    token: undefined,
    payment_status: undefined,
    returnUrl: undefined,
    gatewayName: undefined,
  });
}
