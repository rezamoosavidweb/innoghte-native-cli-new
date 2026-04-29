import {
  type QueryKey,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query';
import * as React from 'react';

import {
  defaultGetNextPageParam,
  type PageWithPagination,
} from '@/shared/lib/infiniteList/defaultGetNextPageParam';
import {
  fetchNextPageWithBackoff,
  type PaginationBackoffOptions,
} from '@/shared/lib/infiniteList/fetchNextPageWithBackoff';
import { useFlashListScrollMemory } from '@/shared/lib/infiniteList/useFlashListScrollMemory';

const DEFAULT_STALE_MS = 5 * 60 * 1000;

const EMPTY_FLAT: readonly unknown[] = Object.freeze([]);

/** Optional hooks for Sentry / analytics — never includes `isMounted` (supplied by hook). */
export type AppInfiniteListPaginationTelemetry = Omit<
  PaginationBackoffOptions,
  'isMounted'
>;

export type AppInfiniteListOptions<
  TItem,
  TPage extends PageWithPagination<TItem>,
  TPageParam,
  TQueryKey extends QueryKey,
> = {
  queryKey: TQueryKey;
  queryFn: (ctx: { pageParam: TPageParam }) => Promise<TPage>;
  initialPageParam: TPageParam;
  /** Defaults to `{ current_page + 1 when current < total }` pagination. */
  getNextPageParam?: (
    lastPage: TPage,
    allPages: TPage[],
    lastPageParam: TPageParam,
    allPageParams: TPageParam[],
  ) => TPageParam | undefined;
  staleTime?: number;
  /** In-memory FlashList vertical offset persistence (blur save / focus restore). */
  scrollMemoryKey?: string;
  /** Optional instrumentation for pagination failures / backoff (production loggers). */
  paginationTelemetry?: AppInfiniteListPaginationTelemetry;
};

/**
 * Opinionated infinite list stack: memoized **`flatData`**, guarded pagination (**ref + backoff**),
 * optional **`scrollMemoryKey`**, and **`resetInfiniteList`**.
 */
export function useAppInfiniteList<
  TItem,
  TPage extends PageWithPagination<TItem>,
  TPageParam,
  TQueryKey extends QueryKey,
>(options: AppInfiniteListOptions<TItem, TPage, TPageParam, TQueryKey>) {
  const {
    queryKey,
    queryFn,
    initialPageParam,
    getNextPageParam: overrideGetNextPageParam,
    staleTime = DEFAULT_STALE_MS,
    scrollMemoryKey,
    paginationTelemetry,
  } = options;

  const queryClient = useQueryClient();
  const mountedRef = React.useRef(true);
  /**
   * Monotonic request id + single lock holder: at most one pagination chain (including backoff).
   * `finally` clears only when `held === mySeq` so no stale completion drops a newer lock.
   */
  const paginationRequestSeqRef = React.useRef(0);
  const paginationLockHeldBySeqRef = React.useRef(0);

  React.useEffect(
    () => () => {
      mountedRef.current = false;
    },
    [],
  );

  const resolver = React.useCallback(
    (
      lastPage: TPage,
      allPages: TPage[],
      lastPageParam: TPageParam,
      allPageParams: TPageParam[],
    ) => {
      if (overrideGetNextPageParam) {
        return overrideGetNextPageParam(
          lastPage,
          allPages,
          lastPageParam,
          allPageParams,
        );
      }
      return defaultGetNextPageParam(
        lastPage as unknown as PageWithPagination<TItem>,
      ) as unknown as TPageParam | undefined;
    },
    [overrideGetNextPageParam],
  );

  const query = useInfiniteQuery({
    queryKey,
    staleTime,
    initialPageParam,
    queryFn: ctx => queryFn({ pageParam: ctx.pageParam as TPageParam }),
    getNextPageParam: resolver,
  });

  const pages = query.data?.pages;
  const flatData = React.useMemo((): readonly TItem[] => {
    if (!pages?.length) {
      return EMPTY_FLAT as readonly TItem[];
    }
    return pages.flatMap(page =>
      Array.isArray(page.items) ? [...page.items] : [],
    );
  }, [pages]);

  const fetchNextPageGuarded = React.useCallback(async () => {
    if (!query.hasNextPage) {
      return;
    }
    if (query.isFetchingNextPage) {
      return;
    }
    if (paginationLockHeldBySeqRef.current !== 0) {
      return;
    }

    paginationRequestSeqRef.current += 1;
    const mySeq = paginationRequestSeqRef.current;
    paginationLockHeldBySeqRef.current = mySeq;

    try {
      const telemetry = paginationTelemetry;
      await fetchNextPageWithBackoff(
        () => query.fetchNextPage({ cancelRefetch: false }),
        {
          isMounted: () => mountedRef.current,
          ...(telemetry ?? {}),
          onBackoffSleep: (ms, nextAttempt, lastError) => {
            telemetry?.onBackoffSleep?.(ms, nextAttempt, lastError);
          },
          onAttemptError: (error, attemptIndexZeroBased) => {
            telemetry?.onAttemptError?.(error, attemptIndexZeroBased);
          },
          onExhausted: error => {
            telemetry?.onExhausted?.(error);
          },
        },
      );
    } finally {
      if (paginationLockHeldBySeqRef.current === mySeq) {
        paginationLockHeldBySeqRef.current = 0;
      }
    }
  }, [query, paginationTelemetry]);

  const resetInfiniteList = React.useCallback(() => {
    queryClient.resetQueries({ queryKey });
  }, [queryClient, queryKey]);

  const deferPagingSignalsRef = React.useRef<() => boolean>(() => false);
  deferPagingSignalsRef.current = (): boolean =>
    paginationLockHeldBySeqRef.current !== 0 || query.isFetchingNextPage;

  const flashListScrollMemory = useFlashListScrollMemory(
    scrollMemoryKey,
    deferPagingSignalsRef,
  );

  /* Omit raw pagination function — replaced below with backoff + mutex. */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { fetchNextPage, ...restQuery } = query;

  return {
    ...restQuery,
    fetchNextPage: fetchNextPageGuarded,
    flatData,
    flashListScrollMemory,
    resetInfiniteList,
  };
}
