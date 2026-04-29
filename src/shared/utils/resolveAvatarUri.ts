import { resolveApiBaseUrl } from '@/shared/infra/http';

/**
 * Builds a usable image URI for `UserDto.avatar` (absolute URL or site-relative path).
 */
export function resolveAvatarUri(avatar: string | undefined): string | null {
  const v = avatar?.trim();
  if (!v) {
    return null;
  }
  if (/^https?:\/\//i.test(v)) {
    return v;
  }
  const base = resolveApiBaseUrl().replace(/\/$/, '');
  const path = v.startsWith('/') ? v : `/${v}`;
  return `${base}${path}`;
}
