import { StorageService } from '@/shared/utils/lib/storage.service';

const ACCESS_TOKEN_KEY = 'auth_access_token';

export function getAccessToken(): string | null {
  return StorageService.getString(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string): void {
  StorageService.setString(ACCESS_TOKEN_KEY, token);
}

export function clearAccessToken(): void {
  StorageService.remove(ACCESS_TOKEN_KEY);
}
