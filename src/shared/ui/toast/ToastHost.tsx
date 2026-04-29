import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  fontSize,
  fontWeight,
  radius,
  spacing,
  type ThemeColors,
  useThemeColors,
} from '@/ui/theme';

import {
  subscribeToast,
  type ToastPayload,
} from '@/shared/ui/toast/toastBus';

const AUTO_HIDE_MS = 4500;

type ToastBannerProps = {
  payload: ToastPayload;
  colors: ThemeColors;
  insetBottom: number;
};

const ToastBanner = React.memo(function ToastBanner({
  payload,
  colors,
  insetBottom,
}: ToastBannerProps) {
  const isError = payload.kind === 'error';
  const backgroundColor = isError ? colors.errorBg : colors.successBg;
  const textColor = isError ? colors.errorText : colors.successText;

  const s = React.useMemo(
    () =>
      StyleSheet.create({
        overlay: {
          ...StyleSheet.absoluteFill,
          justifyContent: 'flex-end',
          pointerEvents: 'box-none',
        },
        pad: {
          paddingHorizontal: spacing.lg,
          paddingBottom: Math.max(insetBottom, spacing.sm) + spacing.sm,
          alignItems: 'center',
        },
        banner: {
          width: '100%',
          maxWidth: 440,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.md,
          borderRadius: radius.md,
          backgroundColor,
        },
        label: {
          fontSize: fontSize.sm + 1,
          fontWeight: fontWeight.medium,
          color: textColor,
          textAlign: 'center',
          lineHeight: (fontSize.sm + 1) * 1.45,
        },
      }),
    [backgroundColor, insetBottom, textColor],
  );

  return (
    <View style={s.overlay} accessibilityLiveRegion="polite">
      <View style={s.pad}>
        <View style={s.banner}>
          <Text style={s.label}>{payload.message}</Text>
        </View>
      </View>
    </View>
  );
});
ToastBanner.displayName = 'ToastBanner';

/**
 * Bottom toast banner — subscriber for {@link showAppToast} (must stay mounted once under {@link AppThemeProvider}).
 */
export const ToastHost = React.memo(function ToastHost() {
  const themeColors = useThemeColors();
  const insets = useSafeAreaInsets();
  const [toast, setToast] = React.useState<ToastPayload | null>(null);

  React.useEffect(() => subscribeToast(setToast), []);

  React.useEffect(() => {
    if (!toast) {
      return undefined;
    }
    const id = setTimeout(() => setToast(null), AUTO_HIDE_MS);
    return () => clearTimeout(id);
  }, [toast]);

  if (!toast) {
    return null;
  }

  return (
    <ToastBanner
      payload={toast}
      colors={themeColors}
      insetBottom={insets.bottom}
    />
  );
});
ToastHost.displayName = 'ToastHost';
