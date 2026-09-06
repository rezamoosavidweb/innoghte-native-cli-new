import { isIranGatewayEnabled } from '@/shared/config/commerceMarket';

export function resolveShowZarinpal(): boolean {
  return isIranGatewayEnabled('zarinpal');
}

export function resolveShowVandar(): boolean {
  return isIranGatewayEnabled('vandar');
}
