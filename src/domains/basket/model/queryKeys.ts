export const basketKeys = {
  cart: (cartToken: string) => ['basket', 'cart', cartToken] as const,
} as const;
