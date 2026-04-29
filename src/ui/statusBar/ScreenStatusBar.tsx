import {
  useScreenStatusBar,
  type UseScreenStatusBarArgs,
} from '@/ui/statusBar/useScreenStatusBar';

/** Declarative variant of {@link useScreenStatusBar} (renders nothing). */
export function ScreenStatusBar(props: UseScreenStatusBarArgs) {
  useScreenStatusBar(props);
  return null;
}
