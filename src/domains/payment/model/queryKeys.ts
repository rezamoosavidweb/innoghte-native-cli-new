/** Domain-scoped React Query keys for the payment domain. */
export const paymentKeys = {
  all: ['payment'] as const,
  verify: (signature: string) => [...paymentKeys.all, 'verify', signature] as const,
};
