/**
 * Minimal dial metadata for the in-app picker. Expand this list as needed.
 * `iso2` is lowercase ISO 3166-1 alpha-2. `dialDigits` is numeric country calling code (no +).
 */
export type PhoneCountry = {
  iso2: string;
  name: string;
  dialDigits: string;
};

/** Flag emoji from ISO2 (Unicode regional indicators). */
export function countryFlagEmoji(iso2: string): string {
  const c = iso2.trim().toUpperCase();
  if (c.length !== 2) return '🏳️';
  const A = 0x41;
  return String.fromCodePoint(
    c.charCodeAt(0) - A + 0x1f1e6,
    c.charCodeAt(1) - A + 0x1f1e6,
  );
}

export function formatDialCode(dialDigits: string): string {
  const d = dialDigits.replace(/\D/g, '');
  return d ? `+${d}` : '';
}

const _PHONE_COUNTRIES_UNSORTED: PhoneCountry[] = [
  { iso2: 'ir', name: 'Iran', dialDigits: '98' },
  { iso2: 'us', name: 'United States', dialDigits: '1' },
  { iso2: 'gb', name: 'United Kingdom', dialDigits: '44' },
  { iso2: 'de', name: 'Germany', dialDigits: '49' },
  { iso2: 'fr', name: 'France', dialDigits: '33' },
  { iso2: 'it', name: 'Italy', dialDigits: '39' },
  { iso2: 'es', name: 'Spain', dialDigits: '34' },
  { iso2: 'nl', name: 'Netherlands', dialDigits: '31' },
  { iso2: 'be', name: 'Belgium', dialDigits: '32' },
  { iso2: 'ch', name: 'Switzerland', dialDigits: '41' },
  { iso2: 'at', name: 'Austria', dialDigits: '43' },
  { iso2: 'se', name: 'Sweden', dialDigits: '46' },
  { iso2: 'no', name: 'Norway', dialDigits: '47' },
  { iso2: 'dk', name: 'Denmark', dialDigits: '45' },
  { iso2: 'fi', name: 'Finland', dialDigits: '358' },
  { iso2: 'pl', name: 'Poland', dialDigits: '48' },
  { iso2: 'tr', name: 'Türkiye', dialDigits: '90' },
  { iso2: 'ae', name: 'United Arab Emirates', dialDigits: '971' },
  { iso2: 'sa', name: 'Saudi Arabia', dialDigits: '966' },
  { iso2: 'qa', name: 'Qatar', dialDigits: '974' },
  { iso2: 'kw', name: 'Kuwait', dialDigits: '965' },
  { iso2: 'iq', name: 'Iraq', dialDigits: '964' },
  { iso2: 'af', name: 'Afghanistan', dialDigits: '93' },
  { iso2: 'pk', name: 'Pakistan', dialDigits: '92' },
  { iso2: 'in', name: 'India', dialDigits: '91' },
  { iso2: 'cn', name: 'China', dialDigits: '86' },
  { iso2: 'jp', name: 'Japan', dialDigits: '81' },
  { iso2: 'kr', name: 'South Korea', dialDigits: '82' },
  { iso2: 'au', name: 'Australia', dialDigits: '61' },
  { iso2: 'nz', name: 'New Zealand', dialDigits: '64' },
  { iso2: 'ca', name: 'Canada', dialDigits: '1' },
  { iso2: 'mx', name: 'Mexico', dialDigits: '52' },
  { iso2: 'br', name: 'Brazil', dialDigits: '55' },
  { iso2: 'ar', name: 'Argentina', dialDigits: '54' },
  { iso2: 'ru', name: 'Russia', dialDigits: '7' },
  { iso2: 'ua', name: 'Ukraine', dialDigits: '380' },
  { iso2: 'eg', name: 'Egypt', dialDigits: '20' },
  { iso2: 'za', name: 'South Africa', dialDigits: '27' },
  { iso2: 'ng', name: 'Nigeria', dialDigits: '234' },
  { iso2: 'am', name: 'Armenia', dialDigits: '374' },
  { iso2: 'az', name: 'Azerbaijan', dialDigits: '994' },
  { iso2: 'ge', name: 'Georgia', dialDigits: '995' },
  { iso2: 'kz', name: 'Kazakhstan', dialDigits: '7' },
];

export const PHONE_COUNTRIES: readonly PhoneCountry[] = [..._PHONE_COUNTRIES_UNSORTED].sort(
  (a, b) => a.name.localeCompare(b.name),
);

const byIso = new Map(PHONE_COUNTRIES.map(c => [c.iso2, c]));

export function getCountryByIso(iso2: string): PhoneCountry | undefined {
  return byIso.get(iso2.toLowerCase());
}
