export const endpoints = {
  public: {
    albums: 'api/v1/public/albums',
    courses: 'api/v1/public/courses',
    events: 'api/v1/public/events',
    faq: 'api/v1/faq',
    liveMeeting: 'api/v1/public/live-meetings',
    quickAccess: 'api/v1/public/quick-access',
    /** Anonymous cart — `X-Cart-Token` header (see client-web). */
    cartList: 'api/v1/public/carts',
    cartCreate: 'api/v1/public/carts/create',
    /** DELETE `.../destroy/:cartLineId` — matches client-web `cartDelete`. */
    cartDestroy: 'api/v1/public/carts/destroy',
    cartDeleteByToken: 'api/v1/public/carts/delete/cart-token',
    checkDiscountCode: 'api/v1/orders/validate-discount',
  },
  auth: {
    login: 'api/v1/login',
    register: 'api/v1/register',
    user: 'api/v1/users/user',
    /** Server uses GET today — prefer POST with CSRF protection when the API allows it. */
    logout: 'api/v1/auth/logout',
    checkOtp: 'api/v1/checkotp',
    resendVerifyOtp: 'api/v1/auth/resend-verify-email-or-mobile',
  },
  /** Authenticated user — see {@link fetchAndApplyPurchasedProductIds}. */
  user: {
    purchasedProductIds: 'api/v1/user/purchased-product-ids',
  },
  /** Authenticated checkout (Bearer). */
  payment: {
    create: 'api/v1/payment/create',
  },
} as const;
