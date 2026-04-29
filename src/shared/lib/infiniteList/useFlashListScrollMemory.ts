import { useFocusEffect } from '@react-navigation/native';
import * as React from 'react';
import {
  InteractionManager,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

import {
  readScrollOffset,
  writeScrollOffset,
} from '@/shared/lib/infiniteList/scrollMemoryStore';

/** If neither momentum nor drag end fires (`animated: false` restore path). */
const RESTORE_SCROLL_FAILSAFE_MS = 900;

/** After successful unlock we keep `active` until blur resets to `idle`. */
export type RestoreScrollLifecycle =
  | 'idle'
  | 'restoring'
  | 'waiting_momentum'
  | 'active';

type FlashScrollHandle = {
  scrollToOffset: (p: { offset: number; animated?: boolean | null }) => void;
};

export type PaginationDeferSignalsRef = Readonly<
  React.MutableRefObject<() => boolean>
>;

/**
 * Focus restore + deterministic lifecycle (`idle`→`restoring`→`waiting_momentum`→`active`): blocks
 * `onEndReached` until **`onMomentumScrollEnd`**, **`onScrollEndDrag`**, or failsafe (**one** unlock).
 *
 * Optional **`paginationDeferSignals`** (from **`useAppInfiniteList`**) suppresses paging while pagination
 * is in-flight independently of restore.
 */
export function useFlashListScrollMemory(
  storageKey: string | undefined,
  paginationDeferSignals?: PaginationDeferSignalsRef,
) {
  const listRef = React.useRef<FlashScrollHandle | null>(null);
  const lastOffsetRef = React.useRef(0);

  /** `idle`|`active`: no paging guard from restore. */
  const restoreLifecycleRef =
    React.useRef<RestoreScrollLifecycle>('idle');
  /** One completion per restore burst — avoids double momentum + drag unlocking. */
  const restoreUnlockDoneRef = React.useRef(true);

  const restoreFailsafeRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const clearFailsafe = React.useCallback(() => {
    if (restoreFailsafeRef.current !== null) {
      clearTimeout(restoreFailsafeRef.current);
      restoreFailsafeRef.current = null;
    }
  }, []);

  const tryFinalizeRestoreCycle = React.useCallback(() => {
    if (restoreUnlockDoneRef.current) {
      return;
    }
    const phase = restoreLifecycleRef.current;
    if (phase !== 'restoring' && phase !== 'waiting_momentum') {
      return;
    }
    restoreUnlockDoneRef.current = true;
    restoreLifecycleRef.current = 'active';
    clearFailsafe();
  }, [clearFailsafe]);

  const captureRef = React.useCallback((instance: FlashScrollHandle | null) => {
    listRef.current = instance;
  }, []);

  const onScroll = React.useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      lastOffsetRef.current = e.nativeEvent.contentOffset.y;
    },
    [],
  );

  const onMomentumScrollEnd = React.useCallback(() => {
    tryFinalizeRestoreCycle();
  }, [tryFinalizeRestoreCycle]);

  const onScrollEndDrag = React.useCallback(() => {
    tryFinalizeRestoreCycle();
  }, [tryFinalizeRestoreCycle]);

  useFocusEffect(
    React.useCallback(() => {
      if (!storageKey) {
        return () => {};
      }

      let cancelled = false;
      const saved = readScrollOffset(storageKey);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (cancelled || !listRef.current) {
            return;
          }
          if (saved === undefined || saved <= 16) {
            return;
          }

          InteractionManager.runAfterInteractions(() => {
            if (cancelled || !listRef.current) {
              return;
            }

            restoreUnlockDoneRef.current = false;
            restoreLifecycleRef.current = 'restoring';

            listRef.current.scrollToOffset({ offset: saved, animated: false });
            restoreLifecycleRef.current = 'waiting_momentum';

            clearFailsafe();
            restoreFailsafeRef.current = setTimeout(() => {
              tryFinalizeRestoreCycle();
              restoreFailsafeRef.current = null;
            }, RESTORE_SCROLL_FAILSAFE_MS);
          });
        });
      });

      return () => {
        cancelled = true;
        restoreLifecycleRef.current = 'idle';
        restoreUnlockDoneRef.current = true;
        clearFailsafe();
        writeScrollOffset(storageKey, lastOffsetRef.current);
      };
    }, [storageKey, clearFailsafe, tryFinalizeRestoreCycle]),
  );

  const shouldSuppressEndReached = React.useCallback(() => {
    const phase = restoreLifecycleRef.current;
    if (phase === 'restoring' || phase === 'waiting_momentum') {
      return true;
    }
    try {
      return paginationDeferSignals?.current() ?? false;
    } catch {
      return false;
    }
  }, [paginationDeferSignals]);

  const scrollPropsForFlashList = React.useMemo(() => {
    if (!storageKey) {
      return {};
    }
    return { onScroll, onMomentumScrollEnd, onScrollEndDrag };
  }, [storageKey, onScroll, onMomentumScrollEnd, onScrollEndDrag]);

  return {
    captureRef,
    onScroll: storageKey ? onScroll : undefined,
    onMomentumScrollEnd: storageKey ? onMomentumScrollEnd : undefined,
    onScrollEndDrag: storageKey ? onScrollEndDrag : undefined,
    scrollPropsForFlashList,
    shouldSuppressEndReached:
      storageKey || paginationDeferSignals
        ? shouldSuppressEndReached
        : () => false,
  };
}
