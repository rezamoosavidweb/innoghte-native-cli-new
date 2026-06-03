import type { TFunction } from 'i18next';

/** Minimal user shape needed to derive a display name. */
type DisplayNameSource =
  | {
      full_name?: string | null;
      name?: string | null;
      family?: string | null;
    }
  | null
  | undefined;

/**
 * Resolves a user's display name: `full_name`, else `"name family"`, else the
 * shared signed-in fallback label. Single source of truth for the drawer/tab
 * avatar naming rule.
 */
export function resolveDisplayName(
  user: DisplayNameSource,
  t: TFunction,
): string {
  return (
    user?.full_name?.trim() ||
    [user?.name, user?.family].filter(Boolean).join(' ').trim() ||
    t('drawer.user.fallbackName')
  ).trim();
}
