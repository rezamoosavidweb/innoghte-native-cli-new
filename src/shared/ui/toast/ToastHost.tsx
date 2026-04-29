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

const staticToastBannerStyles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'flex-end',
    pointerEvents: 'box-none',
  },
  padBase: {
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  bannerShell: {
    width: '100%',
    maxWidth: 440,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
  },
  labelBase: {
    fontSize: fontSize.sm + 1,
    fontWeight: fontWeight.medium,
    textAlign: 'center',
  },
});

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

  const padStyle = React.useMemo(
    () => [
      staticToastBannerStyles.padBase,
      {
        paddingBottom: Math.max(insetBottom, spacing.sm) + spacing.sm,
      },
    ],
    [insetBottom],
  );

  const bannerStyle = React.useMemo(
    () => [
      staticToastBannerStyles.bannerShell,
      { backgroundColor },
    ],
    [backgroundColor],
  );

  const labelStyle = React.useMemo(
    () => [
      staticToastBannerStyles.labelBase,
      {
        color: textColor,
        lineHeight: (fontSize.sm + 1) * 1.45,
      },
    ],
    [textColor],
  );

  return (
    <View style={staticToastBannerStyles.overlay} accessibilityLiveRegion="polite">
      <View style={padStyle}>
        <View style={bannerStyle}>
          <Text style={labelStyle}>{payload.message}</Text>
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
