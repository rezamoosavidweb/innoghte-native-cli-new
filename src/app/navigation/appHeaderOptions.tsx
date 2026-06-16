import * as React from 'react';
import type { Theme } from '@react-navigation/native';

import { mainTabHeaderTitleStyle, pickSemantic } from '@/ui/theme';
import { HeaderBackButton } from './components/HeaderBackButton';
import { HeaderDrawerButton } from './components/HeaderDrawerButton';

type TintProps = { tintColor?: string };

// Module-level stable references — no new function identity on each options call.
function renderHeaderLeft({ tintColor }: TintProps) {
  return <HeaderDrawerButton tintColor={tintColor} />;
}

function renderHeaderRight({ tintColor }: TintProps) {
  return <HeaderBackButton tintColor={tintColor} />;
}

/**
 * Base header options for all authenticated screens.
 *
 * Layout (logical, RTL-aware):
 *   [start]  DrawerButton  |  Title (centered)  |  BackButton  [end]
 *
 * In Persian RTL: DrawerButton is on the physical right (start = right),
 * BackButton is on the physical left (end = left). Mirrors for LTR.
 * BackButton renders null automatically when navigation.canGoBack() is false.
 */
export function createAppHeaderOptions(theme: Theme) {
  const s = pickSemantic(theme);
  return {
    headerStyle: { backgroundColor: s.headerBg },
    headerTintColor: s.headerForeground,
    headerTitleStyle: mainTabHeaderTitleStyle,
    headerTitleAlign: 'center' as const,
    headerLeft: renderHeaderLeft,
    headerRight: renderHeaderRight,
  };
}

/**
 * Header options for root/tab screens where the back button must never appear,
 * regardless of navigation history (e.g. tab backBehavior: 'history').
 */
export function createRootHeaderOptions(theme: Theme) {
  return {
    ...createAppHeaderOptions(theme),
    headerRight: undefined,
  };
}

/**
 * Header options for public, navigated-to screens (e.g. Contact): a back button
 * in the start slot instead of the drawer (hamburger) button, and no duplicate
 * back on the far side. Use for screens that are NOT drawer items.
 */
export function createPublicHeaderOptions(theme: Theme) {
  return {
    ...createAppHeaderOptions(theme),
    headerLeft: renderHeaderRight,
    headerRight: undefined,
  };
}
