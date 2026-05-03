export const endpoints = {
  public: {
    albums: 'api/v1/public/albums',
    courses: 'api/v1/public/courses',
    /** Single course — matches client-web `getPublicCourseDetail`. */
    courseDetail: 'api/v1/public/courses/course',
    /** Course reviews / comments list — matches client-web `getPublicComments`. */
    comments: 'api/v1/public/courses/comments',
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
    contactUsCategories: 'api/v1/public/contact-us/categories',
    contactUsSendOtp: 'api/v1/public/contact-us/send-otp',
    contactUsVerifyOtp: 'api/v1/public/contact-us/verify-otp',
    contactUsCreate: 'api/v1/public/contact-us/create',
    workWithUsCategories: 'api/v1/public/work-with-us/categories',
    workWithUsCreate: 'api/v1/public/work-with-us/create',
  },
  /** Authenticated course actions — Bearer token (same paths as client-web dashboard). */
  coursesAuth: {
    createComment: 'api/v1/courses/comments/create',
  },
  auth: {
    login: 'api/v1/login',
    register: 'api/v1/register',
    user: 'api/v1/users/user',
    /** POST multipart — same path as client-web `postEditProfile`. */
    editProfile: 'api/v1/users/user/update-profile',
    /** PATCH JSON — same path as client-web `patchResetPassword`. */
    changePassword: 'api/v1/users/user/change-password',
    userDevices: 'api/v1/users/user/devices',
    /** Legacy dashboard uses GET — matches client-web `patchDeactivateUser`. */
    userDeviceDeactivate: (deviceId: number) =>
      `api/v1/users/user/device/${deviceId}/deactivate`,
    /** Server uses GET today — prefer POST with CSRF protection when the API allows it. */
    logout: 'api/v1/auth/logout',
    checkOtp: 'api/v1/checkotp',
    resendVerifyOtp: 'api/v1/auth/resend-verify-email-or-mobile',
  },
  /** Authenticated user — see {@link fetchAndApplyPurchasedProductIds}. */
  user: {
    purchasedProductIds: 'api/v1/user/purchased-product-ids',
    /** Order / purchase history — same path as client-web `getListOrders`. */
    orders: 'api/v1/orders',
  },
  /** Authenticated checkout (Bearer). */
  payment: {
    create: 'api/v1/payment/create',
  },
} as const;
