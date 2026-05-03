import * as React from 'react';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';

export function useBottomSheet<T>() {
  const sheetRef =
    React.useRef<React.ComponentRef<typeof BottomSheetModal>>(null);

  const [data, setData] = React.useState<T | null>(null);

  const rafRef = React.useRef<number | null>(null);

  // Prevent duplicate present calls
  const isPresentingRef = React.useRef(false);

  const open = React.useCallback((item: T) => {
    setData(item);
  }, []);

  const close = React.useCallback(() => {
    // ONLY trigger animation
    sheetRef.current?.dismiss();
  }, []);

  const onDismiss = React.useCallback(() => {
    // single source of truth cleanup
    setData(null);

    isPresentingRef.current = false;

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  React.useEffect(() => {
    if (!data) return;

    const item = data;

    if (isPresentingRef.current) return;

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      if (item !== data) return;

      const sheet = sheetRef.current;
      if (!sheet) return;

      isPresentingRef.current = true;
      sheet.present();

      rafRef.current = null;
    });

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [data]);

  return React.useMemo(
    () => ({
      sheetRef,
      data,
      open,
      close,
      onDismiss,
    }),
    [data, open, close, onDismiss],
  );
}