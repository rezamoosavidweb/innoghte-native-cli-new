import type { TextStyle } from 'react-native';

import type { AppLanguage } from '@/shared/contracts/locale';

/** Matches linked font files (use `Dana-Medium.ttf` in `src/assets/font/`). */
export const DANA_MEDIUM_FAMILY = 'Dana-Medium';

export const POPPINS_FAMILY = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  bold: 'Poppins-Bold',
} as const;

/** Normalizes i18n locale tags (`fa-IR`, `fa`, …) to app language. */
export function normalizeAppLanguage(locale: string): AppLanguage {
  const key = locale?.split?.('-')[0]?.toLowerCase();
  return key === 'fa' ? 'fa' : 'en';
}

function englishFamilyFromNumericWeight(weight: number): string {
  if (weight >= 600) {
    return POPPINS_FAMILY.bold;
  }
  if (weight >= 500) {
    return POPPINS_FAMILY.medium;
  }
  return POPPINS_FAMILY.regular;
}

/** Optional string overrides or normalized hints from flattened styles / design tokens. */
function englishFamilyFromToken(weight?: string): string {
  if (!weight) {
    return POPPINS_FAMILY.regular;
  }
  const token = weight.toLowerCase();
  if (/bold|semi|heavy|demi|extra|black|demibold/.test(token) || /\b700\b|\b600\b/.test(token)) {
    return POPPINS_FAMILY.bold;
  }
  if (/medium|500/.test(token)) {
    return POPPINS_FAMILY.medium;
  }
  if (/regular|normal|light|thin|extra\s*light|100|200|300|400/.test(token)) {
    return POPPINS_FAMILY.regular;
  }
  const asNum = Number.parseInt(weight, 10);
  if (!Number.isNaN(asNum)) {
    return englishFamilyFromNumericWeight(asNum);
  }
  return POPPINS_FAMILY.regular;
}

/** Convert RN `fontWeight` to a coarse hint consumed by {@link getFontFamily}. */
export function fontWeightHintFromStyle(weight: TextStyle['fontWeight'] | undefined): string | undefined {
  if (weight == null) {
    return undefined;
  }
  return typeof weight === 'number' ? String(weight) : weight;
}

/**
 * • `fa` → Dana Medium (`Dana-Medium` family; bundle `src/assets/font/Dana-Medium.ttf`).
 * • `en` → Poppins face chosen from discrete files via optional `weight` hint (`"500"`, `"bold"`, etc.).
 */
export function getFontFamily(locale: string, weight?: string): string {
  const lng = normalizeAppLanguage(locale);

  if (lng === 'fa') {
    return DANA_MEDIUM_FAMILY;
  }

  return englishFamilyFromToken(weight);
}