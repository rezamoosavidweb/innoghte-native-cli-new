export const endpoints = {
  public: {
    courses: 'api/v1/public/courses',
    albums: 'api/website/album_list',
    liveMeeting: 'api/website/live_list',
    events: 'api/website/event_list',
    faq: 'api/v1/faq',
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
