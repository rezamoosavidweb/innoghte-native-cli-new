function isLuhnValid(sanitized: string): boolean {
  let sum = 0;
  let shouldDouble = false;
  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitized.substring(i, i + 1), 10);
    if (Number.isNaN(digit)) return false;
    if (shouldDouble) {
      digit *= 2;
      if (digit >= 10) {
        sum += (digit % 10) + 1;
      } else {
        sum += digit;
      }
    } else {
      sum += digit;
    }
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

const cards = {
  amex: /^3[47][0-9]{13}$/,
  dinersclub: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
  discover: /^6(?:011|5[0-9][0-9])[0-9]{12,15}$/,
  jcb: /^(?:2131|1800|35\d{3})\d{11}$/,
  mastercard:
    /^5[1-5][0-9]{2}|(222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/,
  unionpay: /^(6[27][0-9]{14}|^(81[0-9]{14,17}))$/,
  visa: /^(?:4[0-9]{12})(?:[0-9]{3,6})?$/,
} as const;

const allCards = Object.values(cards);

/** Same rules as web `isCreditCard` validator (Luhn + provider patterns). */
export default function isCreditCard(card: string): boolean {
  if (typeof card !== 'string') return false;
  const sanitized = card.replace(/[- ]+/g, '');
  if (!allCards.some((cardProvider) => cardProvider.test(sanitized))) {
    return false;
  }
  return isLuhnValid(sanitized);
}

export function formatCardNumber(cardNumber: string): string {
  return cardNumber
    .replace(/\D/g, '')
    .replace(/(.{4})/g, '$1 ')
    .trim();
}
