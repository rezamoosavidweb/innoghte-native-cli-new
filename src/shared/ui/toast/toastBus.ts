export type ToastKind = 'success' | 'error';

export type ToastPayload = {
  message: string;
  kind: ToastKind;
};

type Listener = (payload: ToastPayload) => void;

const listeners = new Set<Listener>();

export function subscribeToast(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Imperative toast — consumed by {@link ToastHost} mounted once under {@link AppThemeProvider}. */
export function showAppToast(message: string, kind: ToastKind): void {
  const payload: ToastPayload = { message, kind };
  for (const listener of listeners) {
    listener(payload);
  }
}
