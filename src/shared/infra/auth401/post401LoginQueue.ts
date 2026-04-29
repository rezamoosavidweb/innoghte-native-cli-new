let queued401PostLogin: (() => void) | null = null;

export function queue401PostLogin(handler: () => void): void {
  queued401PostLogin = handler;
}

export function take401PostLoginHandler(): (() => void) | null {
  const next = queued401PostLogin;
  queued401PostLogin = null;
  return next;
}

export function peek401PostLoginQueued(): boolean {
  return queued401PostLogin !== null;
}
