import { useFocusEffect } from '@react-navigation/native';
import * as React from 'react';

import { inferStatusBarContentStyle } from '@/ui/statusBar/inferStatusBarContentStyle';
import { useStatusBarChromeContext } from '@/ui/statusBar/StatusBarChromeContext';

export type UseScreenStatusBarArgs = {
  /** Usually a semantic token such as `theme.colors.headerBg`. */
  backgroundColor: string;
  barStyle?: 'light-content' | 'dark-content';
  /**
   * When `true` (default) and `barStyle` is omitted, derive icons from
   * `backgroundColor` brightness.
   */
  inferBarStyle?: boolean;
};

/**
 * Aligns the app status bar with this screen while focused (e.g. a custom
 * header color). On blur, the global baseline from {@link StatusBarChromeProvider}
 * is restored — no duplicate `StatusBar` nodes and no stale imperative calls.
 *
 * @example
 * ```tsx
 * const colors = useThemeColors();
 * useScreenStatusBar({ backgroundColor: colors.headerBg });
 * // or a different role for a one-off screen:
 * useScreenStatusBar({ backgroundColor: colors.primary });
 * ```
 */
export function useScreenStatusBar({
  backgroundColor,
  barStyle,
  inferBarStyle = true,
}: UseScreenStatusBarArgs) {
  const { setOverride } = useStatusBarChromeContext();

  const resolvedBarStyle = React.useMemo((): 'light-content' | 'dark-content' => {
    if (barStyle) {
      return barStyle;
    }
    if (inferBarStyle) {
      return inferStatusBarContentStyle(backgroundColor);
    }
    return 'dark-content';
  }, [backgroundColor, barStyle, inferBarStyle]);

  useFocusEffect(
    React.useCallback(() => {
      setOverride({ backgroundColor, barStyle: resolvedBarStyle });
      return () => setOverride(null);
    }, [backgroundColor, resolvedBarStyle, setOverride]),
  );
}
