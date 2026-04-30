export const donationKeys = {
  verifyIr: (
    gateway: string,
    authorityOrToken: string | null,
    status: string | null,
  ) => ['verifyDonationIr', gateway, authorityOrToken, status] as const,
  executeCom: (gateway: string, paymentId: string | null, payerId: string | null) =>
    ['executeDonationCom', gateway, paymentId, payerId] as const,
} as const;
