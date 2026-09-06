import type {
  PaymentGatewayName,
  PaymentResultParams,
} from '@/shared/contracts/navigationPayment';

const CALLBACK_PATH = '/payment/result';

function isCallbackPath(pathname: string): boolean {
  const path = pathname.toLowerCase().replace(/\/$/, '');
  return path === CALLBACK_PATH || path.startsWith(`${CALLBACK_PATH}/`);
}

function isInnoghteHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return (
    host === 'innoghte.ir' ||
    host.endsWith('.innoghte.ir') ||
    host === 'innoghte.com' ||
    host.endsWith('.innoghte.com')
  );
}

function gatewayFromPath(
  pathname: string,
  fallback: PaymentGatewayName,
): PaymentGatewayName {
  const path = pathname.toLowerCase().replace(/\/$/, '');
  if (path.endsWith('/vandar')) return 'vandar';
  if (path.endsWith('/paypal')) return 'paypal';
  if (path.endsWith('/credit-card')) return 'creditCard';
  return fallback;
}

/** Parse only trusted web callback URLs; gateway pages continue inside WebView. */
export function parsePaymentGatewayCallback(
  rawUrl: string,
  fallbackGateway: PaymentGatewayName,
): PaymentResultParams | null {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return null;
  }

  const path = url.pathname.toLowerCase();
  const isWebCallback = isInnoghteHost(url.hostname) && isCallbackPath(path);
  const isAppCallback =
    url.protocol === 'innoghte:' &&
    url.hostname.toLowerCase() === 'payment' &&
    (path === '/result' || path.startsWith('/result/'));
  if (!isWebCallback && !isAppCallback) return null;

  const read = (name: string): string | undefined =>
    url.searchParams.get(name) ?? undefined;

  return {
    Authority: read('Authority'),
    Status: read('Status'),
    token: read('token'),
    payment_status: read('payment_status'),
    PayerID: read('PayerID'),
    gatewayName: gatewayFromPath(url.pathname, fallbackGateway),
  };
}
