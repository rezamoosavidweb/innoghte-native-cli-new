export const endpoints = {
  public: {
    albums: 'api/v1/public/albums',
    courses: 'api/v1/public/courses',
    events: 'api/v1/public/events',
    faq: 'api/v1/faq',
    liveMeeting: 'api/v1/public/live-meetings',
    quickAccess: 'api/v1/public/quick-access',
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
} as const;
