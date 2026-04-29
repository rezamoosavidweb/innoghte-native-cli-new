import type { TFunction } from 'i18next';

const VERIFY_ERROR_KEY_PREFIX = 'screens.verify.errors.';

/** Maps mock / API error codes to i18n leaf keys (under `screens.verify.errors`). */
function verifyErrorCodeToLeaf(code: string): string {
  switch (code) {
    case 'EMPTY_DESTINATION':
      return 'emptyDestination';
    case 'INVALID_EMAIL':
      return 'invalidEmail';
    case 'INVALID_MOBILE':
      return 'invalidMobile';
    case 'EMPTY_CODE':
      return 'emptyCode';
    case 'INVALID_CODE':
      return 'invalidCode';
    default:
      return 'generic';
  }
}

export function translateVerifyError(error: unknown, t: TFunction): string {
  const code = error instanceof Error ? error.message : 'UNKNOWN';
  const leaf = verifyErrorCodeToLeaf(code);
  return t(`${VERIFY_ERROR_KEY_PREFIX}${leaf}`);
}
