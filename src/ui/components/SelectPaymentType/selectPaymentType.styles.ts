import * as React from 'react';
import { StyleSheet } from 'react-native';

import type { ThemeColors } from '@/ui/theme/types';
import { radius, spacing } from '@/ui/theme';

/**
 * Shared payment-method brand cards (PayPal / Venmo·disabled / Card).
 * Used by both the basket and donation checkout flows.
 */
export function useSelectPaymentTypeStyles(colors: ThemeColors) {
  return React.useMemo(
    () =>
      StyleSheet.create({
        row: {
          flexDirection: 'row',
          gap: spacing.sm,
          marginBottom: spacing.md,
        },
        card: {
          flex: 1,
          minHeight: 60,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.sm,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: colors.border,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.surfaceSecondary,
        },
        cardOn: {
          borderColor: colors.primary,
          backgroundColor: colors.primarySoft,
        },
        cardDisabled: { opacity: 0.5 },
        slot: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        },
      }),
    [colors.border, colors.primary, colors.primarySoft, colors.surfaceSecondary],
  );
}
