import * as React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { darkTheme } from '@/ui/theme/dark';
import { fontSize, fontWeight } from '@/ui/theme/core/typography';
import { spacing } from '@/ui/theme/core/spacing';

const fallbackColors = darkTheme.colors;

const s = StyleSheet.create({
  prodWrap: {
    flex: 1,
    padding: spacing['2xl'],
    justifyContent: 'center',
    backgroundColor: fallbackColors.background,
  },
  prodTitle: {
    color: fallbackColors.text,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.md,
  },
  prodBody: {
    color: fallbackColors.textSecondary,
    fontSize: fontSize.md,
  },
  devWrap: {
    flex: 1,
    padding: spacing['3xl'],
    justifyContent: 'center',
    backgroundColor: fallbackColors.background,
  },
  devTitle: {
    marginBottom: spacing.md,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: fallbackColors.text,
  },
  devError: {
    marginBottom: spacing.base,
    color: fallbackColors.errorText,
    fontSize: fontSize.md,
  },
});

const ProductionFallback = React.memo(function ProductionFallback() {
  const { t } = useTranslation();
  return (
    <View style={s.prodWrap}>
      <Text style={s.prodTitle}>
        {t('app.errorBoundary.title', 'Something went wrong')}
      </Text>
      <Text style={s.prodBody}>
        {t('app.errorBoundary.hint', 'Please restart the app if the problem continues.')}
      </Text>
    </View>
  );
});
ProductionFallback.displayName = 'ProductionFallback';

const DevErrorFallback = React.memo(function DevErrorFallback({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <View style={s.devWrap}>
      <Text style={s.devTitle}>Render error</Text>
      <Text style={s.devError}>{error.message}</Text>
      <Button title="Try again" onPress={reset} />
    </View>
  );
});
DevErrorFallback.displayName = 'DevErrorFallback';

type Props = { children: React.ReactNode };

type State = { error: Error | null };

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  private reset = (): void => {
    this.setState({ error: null });
  };

  override render() {
    const { error } = this.state;
    if (error) {
      if (__DEV__) {
        return <DevErrorFallback error={error} reset={this.reset} />;
      }
      return <ProductionFallback />;
    }
    return this.props.children;
  }
}
