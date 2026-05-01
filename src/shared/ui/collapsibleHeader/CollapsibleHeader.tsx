import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import { Text } from '@/shared/ui/Text';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { contrastingForeground } from '@/shared/ui/collapsibleHeader/colorUtils';
import {
  createCollapsibleShellInsetStyles,
  createCollapsibleRowMinHeightStyles,
  createCollapsibleStaticTitleColorStyles,
} from '@/shared/ui/collapsibleHeader/collapsibleHeaderLayout.styles';
import {
  COLLAPSIBLE_HEADER_DEFAULT_BAR_HEIGHT,
  type CollapsibleHeaderProps,
} from '@/shared/ui/collapsibleHeader/types';

const DEFAULT_EXPANDED_TITLE = '#FFFFFF';

function titleColors(
  backgroundColor: string,
  adaptiveTitleColor: boolean | undefined,
  expandedTitleColor: string | undefined,
  collapsedTitleColor: string | undefined,
): { expanded: string; collapsed: string; animate: boolean } {
  const expanded = expandedTitleColor ?? DEFAULT_EXPANDED_TITLE;
  if (adaptiveTitleColor) {
    return {
      expanded,
      collapsed: contrastingForeground(backgroundColor),
      animate: true,
    };
  }
  if (collapsedTitleColor != null && collapsedTitleColor !== expanded) {
    return { expanded, collapsed: collapsedTitleColor, animate: true };
  }
  return { expanded, collapsed: expanded, animate: false };
}

export const CollapsibleHeader = React.memo(function CollapsibleHeader({
  scrollY,
  backgroundColor,
  expandedBackgroundColor,
  threshold,
  height = COLLAPSIBLE_HEADER_DEFAULT_BAR_HEIGHT,
  leading,
  title,
  children,
  contrastShadowWhileExpanded = false,
  adaptiveTitleColor,
  expandedTitleColor,
  collapsedTitleColor,
}: CollapsibleHeaderProps) {
  const insets = useSafeAreaInsets();
  const { expanded, collapsed, animate } = titleColors(
    backgroundColor,
    adaptiveTitleColor,
    expandedTitleColor,
    collapsedTitleColor,
  );

  const shellAnimatedStyle = useAnimatedStyle(() => {
    const p = interpolate(
      scrollY.value,
      [0, threshold],
      [0, 1],
      Extrapolation.CLAMP,
    );
    return {
      backgroundColor: interpolateColor(
        p,
        [0, 1],
        [expandedBackgroundColor, backgroundColor],
      ),
    };
  }, [backgroundColor, expandedBackgroundColor, threshold]);

  const titleAnimatedStyle = useAnimatedStyle(() => {
    const p = interpolate(
      scrollY.value,
      [0, threshold],
      [0, 1],
      Extrapolation.CLAMP,
    );
    if (!contrastShadowWhileExpanded) {
      return {
        color: interpolateColor(p, [0, 1], [expanded, collapsed]),
      };
    }
    return {
      color: interpolateColor(p, [0, 1], [expanded, collapsed]),
      textShadowColor: interpolateColor(
        p,
        [0, 1],
        ['rgba(0,0,0,0.52)', 'rgba(0,0,0,0)'],
      ),
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: interpolate(p, [0, 1], [6, 0], Extrapolation.CLAMP),
    };
  }, [threshold, expanded, collapsed, contrastShadowWhileExpanded]);

  const shellInset = createCollapsibleShellInsetStyles(
    insets.top,
    insets.top + height,
  );
  const rowMin = createCollapsibleRowMinHeightStyles(height);
  const staticTitleTint = createCollapsibleStaticTitleColorStyles(expanded);

  const titleNode = !title ? null : animate ? (
    <Animated.Text
      accessibilityRole="header"
      numberOfLines={1}
      style={[styles.title, titleAnimatedStyle]}
    >
      {title}
    </Animated.Text>
  ) : (
    <Text
      accessibilityRole="header"
      numberOfLines={1}
      style={[styles.title, staticTitleTint.title]}
    >
      {title}
    </Text>
  );

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.shell, shellInset.shell, shellAnimatedStyle]}
    >
      <View style={[styles.row, rowMin.row]}>
        {leading != null ? (
          <View style={styles.leading} pointerEvents="box-none">
            {leading}
          </View>
        ) : null}
        {titleNode}
        {children != null ? (
          <View style={styles.trailing} pointerEvents="box-none">
            {children}
          </View>
        ) : null}
      </View>
    </Animated.View>
  );
});

CollapsibleHeader.displayName = 'CollapsibleHeader';

const styles = StyleSheet.create({
  shell: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  leading: {
    flexShrink: 0,
    marginEnd: -4,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
  },
  trailing: {
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
