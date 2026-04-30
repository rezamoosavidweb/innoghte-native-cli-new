import i18n from './index';

/** BCP 47 locale for Intl; `fa` alone is unreliable for Eastern Arabic digits on some runtimes. */
function resolveIntlNumberLocale(language: string): string {
  return language === 'fa' ? 'fa-IR' : language;
}

export function formatNumberForLocale(value: number, language: string): string {
  return value.toLocaleString(resolveIntlNumberLocale(language));
}

export function formatPriceForLocale(
  price: number,
  language: string,
  currencyLabel: string,
): string {
  const formatted = price.toLocaleString(resolveIntlNumberLocale(language));
  return language === 'fa'
    ? `${formatted} ${currencyLabel}`
    : `${currencyLabel} ${formatted}`;
}

/** Uses active i18n language (parity with legacy convertPrice / convertNumber). */
export function formatNumberForApp(value: number): string {
  return formatNumberForLocale(value, i18n.language);
}

export function formatPriceForApp(
  price: number,
  currencyLabel: string,
): string {
  return formatPriceForLocale(price, i18n.language, currencyLabel);
}
