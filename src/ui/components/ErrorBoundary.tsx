import * as React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { designTokens } from '@/ui/theme/core/designTokens';

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

const s = StyleSheet.create({
  prodWrap: {
    flex: 1,
    padding: designTokens.spacing['2xl'],
    justifyContent: 'center',
    backgroundColor: designTokens.colors.white,
  },
  prodTitle: {
    color: designTokens.colors.charcoal[900],
    fontSize: designTokens.fontSize.lg,
    fontWeight: designTokens.fontWeight.semibold,
    marginBottom: designTokens.spacing.md,
  },
  prodBody: {
    color: designTokens.colors.charcoal[600],
    fontSize: designTokens.fontSize.md,
  },
  devTitle: { marginBottom: 12, fontSize: 16, fontWeight: '600' },
  devError: { marginBottom: 16, color: '#b00020' },
});

const devErrorText = { marginBottom: 16, color: '#b00020' } as const;

const devBox = StyleSheet.create({
  wrap: { flex: 1, padding: 24, justifyContent: 'center' },
});

const DevErrorFallback = React.memo(function DevErrorFallback({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <View style={devBox.wrap}>
      <Text style={s.devTitle}>Render error</Text>
      <Text style={devErrorText}>{error.message}</Text>
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
