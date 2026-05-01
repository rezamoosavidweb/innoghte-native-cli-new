import type { ReactNode } from 'react';
import type { SharedValue } from 'react-native-reanimated';

/**
 * Aligns scroll fade range with {@link CollapsibleHeaderScrollConfig.contentPaddingTop}
 * (`insets.top + barHeight`).
 */
export type CollapsibleHeaderThresholdMode = 'headerHeight';

/** Configuration shared by the scroll hook and header. */
export type CollapsibleHeaderTheme = {
  /** Opaque color when fully “solid” at `threshold` scroll offset. */
  backgroundColor: string;
  /**
   * Scroll distance (px) over which background fades in, or `'headerHeight'` to derive from
   * safe-area top + `barHeight` (layout-stable, no scroll JS).
   */
  threshold?: number | CollapsibleHeaderThresholdMode;
  /** Color at scroll offset 0 (transparent by default, derived from `backgroundColor`). */
  expandedBackgroundColor?: string;
  /** Content row height below the status bar inset. */
  barHeight?: number;
};

export type UseCollapsibleHeaderOptions = {
  /** When set, scroll deltas are written here instead of an internal shared value. */
  scrollY?: SharedValue<number>;
} & CollapsibleHeaderTheme;

export const COLLAPSIBLE_HEADER_DEFAULT_THRESHOLD = 72;
export const COLLAPSIBLE_HEADER_DEFAULT_BAR_HEIGHT = 56;

export type CollapsibleHeaderProps = {
  scrollY: SharedValue<number>;
  backgroundColor: string;
  expandedBackgroundColor: string;
  threshold: number;
  height?: number;
  /** Renders before the title (e.g. drawer/back control). */
  leading?: ReactNode;
  title?: string;
  children?: ReactNode;
  /**
   * When true, title gains a subtle text shadow while the header is expanded (transparent),
   * fading out as the header solidifies — improves contrast over bright hero imagery.
   */
  contrastShadowWhileExpanded?: boolean;
  /**
   * When true, title color interpolates between `expandedTitleColor` and a contrast
   * color derived from `backgroundColor` (collapsed).
   */
  adaptiveTitleColor?: boolean;
  /** Title color at scroll 0. Defaults to white. */
  expandedTitleColor?: string;
  /** Overrides collapsed title color when `adaptiveTitleColor` is false. */
  collapsedTitleColor?: string;
};
