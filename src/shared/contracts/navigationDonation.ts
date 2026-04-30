/** Set via navigation / universal links / web “continue in app” (`returnUrl`). */
export type DonationScreenParams = {
  Authority?: string;
  Status?: string;
  paymentId?: string;
  PayerID?: string;
  token?: string;
  payment_status?: string;
  /**
   * Full callback URL from the browser (e.g. https://…/donate/result?Authority=…).
   * Merged via `mergeDonationCallbackSources`; discrete fields above override parsed keys.
   */
  returnUrl?: string;
  /** IR gateway for verify API when returning from web / deep link without local UI state. */
  gatewayName?: string;
};
