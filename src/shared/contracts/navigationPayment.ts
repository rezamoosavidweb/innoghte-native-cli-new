/**
 * Params for the post-checkout payment-result screen.
 *
 * Populated from the gateway redirect (deep link / universal link). `.ir`
 * gateways (Zarinpal/Vandar) return `Authority` + `Status`; PayPal returns
 * `token` / `PayerID`. `gatewayName` selects the verify endpoint and defaults
 * to the region's gateway when absent.
 */
export type PaymentGatewayName = 'zarinpal' | 'vandar' | 'paypal';

export type PaymentResultParams = {
  Authority?: string;
  Status?: string;
  token?: string;
  payment_status?: string;
  PayerID?: string;
  gatewayName?: PaymentGatewayName;
};
