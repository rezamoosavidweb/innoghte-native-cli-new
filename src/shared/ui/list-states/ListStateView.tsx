import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import type { Edge } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useNavScreenShellStyles } from '@/ui/theme';

import { EmptyState } from '@/shared/ui/list-states/EmptyState';import { ErrorState } from '@/shared/ui/list-states/ErrorState';
import { LoadingState } from '@/shared/ui/list-states/LoadingState';

export type ListStateViewProps = {
  isLoading: boolean;
  isError: boolean;
  /** Forwarded for default error detail; override with `errorDetail` when needed. */
  error: unknown;
  isEmpty: boolean;
  onRetry: () => void;
  /** Only invoked in the success branch — FlashList stays unmounted for other states. */
  renderList: () => React.ReactElement;
  loadingMessage: string;
  errorTitle: string;
  /** Optional message under the error title (e.g. `error.message`). */
  errorDetail?: string;
  emptyTitle: string;
  emptySubtitle?: string;
  retryLabel: string;
  /** Same contract as `SafeAreaView` edges for the success-only wrapper. */
  safeAreaEdges?: readonly Edge[];
};

function defaultErrorDetail(error: unknown): string | undefined {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  if (error != null && error !== '') {
    return String(error);
  }
  return undefined;
}

const ListStateViewComponent = ({
  isLoading,
  isError,
  error,
  isEmpty,
  onRetry,
  renderList,
  loadingMessage,
  errorTitle,
  errorDetail,
  emptyTitle,
  emptySubtitle,
  retryLabel,
  safeAreaEdges = ['left', 'right', 'bottom'],
}: ListStateViewProps) => {
  const { colors } = useTheme();
  const shell = useNavScreenShellStyles(colors);

  const resolvedErrorDetail =
    errorDetail !== undefined ? errorDetail || undefined : defaultErrorDetail(error);

  if (isLoading) {
    return <LoadingState message={loadingMessage} />;
  }

  if (isError) {
    return (
      <ErrorState
        title={errorTitle}
        detail={resolvedErrorDetail}
        onRetry={onRetry}
        retryLabel={retryLabel}
      />
    );
  }

  if (isEmpty) {
    return <EmptyState title={emptyTitle} subtitle={emptySubtitle} />;
  }

  return (
    <SafeAreaView style={shell.safe} edges={safeAreaEdges}>
      {renderList()}
    </SafeAreaView>
  );
};

export const ListStateView = React.memo(ListStateViewComponent);
ListStateView.displayName = 'ListStateView';
