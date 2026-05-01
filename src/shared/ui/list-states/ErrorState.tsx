import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import { Text } from '@/shared/ui/Text';

import { radius } from '@/ui/theme/core/radius';
import { spacing } from '@/ui/theme/core/spacing';
import { fontSize, fontWeight } from '@/ui/theme/core/typography';
import { useNavScreenShellStyles, useThemeColors } from '@/ui/theme';

export type ErrorStateProps = {
  title: string;
  detail?: string;
  onRetry: () => void;
  retryLabel: string;
};

const ErrorStateComponent = ({
  title,
  detail,
  onRetry,
  retryLabel,
}: ErrorStateProps) => {
  const { colors } = useTheme();
  const themeColors = useThemeColors();
  const shell = useNavScreenShellStyles(colors);

  const btnStyles = React.useMemo(
    () =>
      StyleSheet.create({
        retryPressable: {
          marginTop: spacing.lg,
          paddingVertical: spacing.sm + 2,
          paddingHorizontal: spacing['2xl'],
          borderRadius: radius.md,
          backgroundColor: colors.primary,
        },
        retryLabel: {
          fontSize: fontSize.sm + 1,
          fontWeight: fontWeight.semibold,
          color: themeColors.onPrimary,
        },
      }),
    [colors.primary, themeColors.onPrimary],
  );

  return (
    <View style={shell.centered} accessibilityRole="alert">
      <Text style={shell.errorText}>{title}</Text>
      {detail ? <Text style={shell.errorDetail}>{detail}</Text> : null}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={retryLabel}
        onPress={onRetry}
        style={({ pressed }) => [
          btnStyles.retryPressable,
          pressed && { opacity: 0.85 },
        ]}
      >
        <Text style={btnStyles.retryLabel}>{retryLabel}</Text>
      </Pressable>
    </View>
  );
};

export const ErrorState = React.memo(ErrorStateComponent);
ErrorState.displayName = 'ErrorState';
