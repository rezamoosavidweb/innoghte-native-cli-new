import * as React from 'react';
import {
  type InfiniteData,
  type QueryKey,
  useQueryClient,
} from '@tanstack/react-query';

/** Wrapped list APIs (`{ data: T[], message, … }`). */
export interface ResponseWrapper<T> {
  data: T;
  message: string;
  pagination?: unknown[];
}

export interface InfiniteResponseWrapper<T> {
  data: {
    result: T[];
    meta?: Record<string, unknown>;
  };
  message: string;
}

export interface ResponseCache<T> {
  data: T;
  message: string;
}

function isInfiniteData<T>(
  data: unknown,
): data is InfiniteData<InfiniteResponseWrapper<T>> {
  return !!data && typeof data === 'object' && 'pages' in data;
}

function isResponseWrapperArray<T>(
  oldData: unknown,
): oldData is ResponseWrapper<T[]> {
  return (
    typeof oldData === 'object' &&
    oldData !== null &&
    'data' in oldData &&
    Array.isArray((oldData as ResponseWrapper<T[]>).data)
  );
}

/**
 * Imperative React Query cache updates for list-shaped data: plain arrays,
 * `{ data: T[] }` envelopes, and infinite queries — aligned with the web
 * `useQueryCache` hook.
 */
export function useQueryCache<T extends { id: number }>(queryKey: QueryKey) {
  const queryClient = useQueryClient();

  const getData = React.useCallback(() => {
    return queryClient.getQueryData<
      | T[]
      | ResponseWrapper<T[]>
      | ResponseCache<T>
      | InfiniteData<InfiniteResponseWrapper<T>>
    >(queryKey);
  }, [queryClient, queryKey]);

  const addItem = React.useCallback(
    (newItem: T) => {
      queryClient.setQueryData<
        | InfiniteData<InfiniteResponseWrapper<T>>
        | ResponseWrapper<T[]>
        | T[]
      >(queryKey, oldData => {
        if (oldData == null) return oldData;

        if (isInfiniteData<T>(oldData)) {
          const firstPage = oldData.pages[0];
          if (!firstPage?.data?.result) return oldData;

          const updatedPages = [
            {
              ...firstPage,
              data: {
                ...firstPage.data,
                result: [newItem, ...firstPage.data.result],
                meta: {
                  ...firstPage.data.meta,
                  total_count:
                    Number(firstPage.data.meta?.total_count ?? 0) + 1,
                },
              },
            },
            ...oldData.pages.slice(1),
          ];

          return { ...oldData, pages: updatedPages };
        }

        if (isResponseWrapperArray<T>(oldData)) {
          const wrappedData = oldData;
          const newList = [...wrappedData.data, newItem];
          return {
            message: wrappedData.message || '',
            data: newList,
            pagination: wrappedData.pagination ?? [],
          };
        }

        if (Array.isArray(oldData)) {
          return [...oldData, newItem];
        }

        return oldData;
      });
    },
    [queryClient, queryKey],
  );

  const updateItem = React.useCallback(
    (id: number, patch?: Partial<T>) => {
      if (patch == null) return;

      queryClient.setQueryData<
        | T
        | T[]
        | ResponseWrapper<T>
        | ResponseWrapper<T[]>
        | InfiniteData<InfiniteResponseWrapper<T>>
      >(queryKey, oldData => {
        if (oldData == null) return oldData;

        if (isInfiniteData<T>(oldData)) {
          const newPages = oldData.pages.map(page => {
            const updatedResult = page.data.result.map(item =>
              item.id === id ? ({ ...item, ...patch } as T) : item,
            );
            const changed = updatedResult.some(
              (item, idx) => item !== page.data.result[idx],
            );
            return changed
              ? { ...page, data: { ...page.data, result: updatedResult } }
              : page;
          });
          const anyChanged = newPages.some((p, i) => p !== oldData.pages[i]);
          return anyChanged ? { ...oldData, pages: newPages } : oldData;
        }

        if (isResponseWrapperArray<T>(oldData)) {
          const wrappedData = oldData;
          const updatedArray = wrappedData.data.map(item =>
            item.id === id ? ({ ...item, ...patch } as T) : item,
          );
          const changed = updatedArray.some(
            (item, idx) => item !== wrappedData.data[idx],
          );
          return changed ? { ...wrappedData, data: updatedArray } : oldData;
        }

        if (Array.isArray(oldData)) {
          const arr = oldData as T[];
          const updatedArray = arr.map(item =>
            item.id === id ? ({ ...item, ...patch } as T) : item,
          );
          const changed = updatedArray.some((item, idx) => item !== arr[idx]);
          return changed ? updatedArray : oldData;
        }

        if (
          typeof oldData === 'object' &&
          oldData !== null &&
          'data' in oldData &&
          (oldData as ResponseWrapper<T>).data &&
          typeof (oldData as ResponseWrapper<T>).data === 'object' &&
          'id' in (oldData as ResponseWrapper<T>).data
        ) {
          const wrapped = oldData as ResponseWrapper<T>;
          if (wrapped.data.id === id) {
            return { ...wrapped, data: { ...wrapped.data, ...patch } as T };
          }
          return oldData;
        }

        const single = oldData as T;
        if (
          single &&
          typeof single === 'object' &&
          'id' in single &&
          single.id === id
        ) {
          return { ...single, ...patch } as T;
        }

        return oldData;
      });
    },
    [queryClient, queryKey],
  );

  const removeItem = React.useCallback(
    (id: number) => {
      queryClient.setQueryData<
        | InfiniteData<InfiniteResponseWrapper<T>>
        | ResponseWrapper<T[]>
        | T[]
      >(queryKey, oldData => {
        if (oldData == null) return oldData;

        if (isInfiniteData<T>(oldData)) {
          let itemRemoved = false;

          const newPages = oldData.pages.map(page => {
            const newResult = page.data.result.filter(item => {
              if (item.id === id) {
                itemRemoved = true;
                return false;
              }
              return true;
            });
            return { ...page, data: { ...page.data, result: newResult } };
          });

          if (!itemRemoved) return oldData;

          const oldTotal = Number(oldData.pages[0]?.data?.meta?.total_count ?? 0);
          const newTotal = Math.max(oldTotal - 1, 0);

          const pagesWithUpdatedMeta = newPages.map(p => ({
            ...p,
            data: {
              ...p.data,
              meta: { ...p.data.meta, total_count: newTotal },
            },
          }));

          return { ...oldData, pages: pagesWithUpdatedMeta };
        }

        if (isResponseWrapperArray<T>(oldData)) {
          const wrappedData = oldData;
          const filtered = wrappedData.data.filter(item => item.id !== id);
          if (filtered.length !== wrappedData.data.length) {
            return {
              ...wrappedData,
              data: filtered,
            };
          }
          return oldData;
        }

        if (Array.isArray(oldData)) {
          const filtered = oldData.filter(item => item.id !== id);
          return filtered.length !== oldData.length ? filtered : oldData;
        }

        return oldData;
      });
    },
    [queryClient, queryKey],
  );

  const clearCache = React.useCallback(() => {
    queryClient.removeQueries({ queryKey });
  }, [queryClient, queryKey]);

  return { getData, addItem, updateItem, removeItem, clearCache };
}
