import type { PendingNavigation } from '@/shared/contracts/pendingNavigation';

export type Auth401BridgeDeps = Readonly<{
  getAccessToken: () => string | null;
  setPendingNavigation: (target: PendingNavigation | null) => void;
  clearSessionTokensOnly: () => void;
}>;

let deps: Auth401BridgeDeps | null = null;

export function configureAuth401Bridge(next: Auth401BridgeDeps): void {
  deps = next;
}

function requireDeps(): Auth401BridgeDeps {
  if (!deps) {
    throw new Error(
      'configureAuth401Bridge must run before 401/session bridge is used.',
    );
  }
  return deps;
}

export function getAuth401AccessToken(): string | null {
  return requireDeps().getAccessToken();
}

export function auth401SetPendingNavigation(
  target: PendingNavigation | null,
): void {
  requireDeps().setPendingNavigation(target);
}

export function auth401ClearSessionTokensOnly(): void {
  requireDeps().clearSessionTokensOnly();
}
