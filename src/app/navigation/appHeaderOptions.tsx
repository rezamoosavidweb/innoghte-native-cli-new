import * as React from 'react';
import type { Theme } from '@react-navigation/native';

import { mainTabHeaderTitleStyle, pickSemantic } from '@/ui/theme';
import { BasketHeaderButton } from '@/app/bridge/BasketHeaderButton';
import { HeaderDrawerButton } from './components/HeaderDrawerButton';

type TintProps = { tintColor?: string };

// Module-level stable references — no new function identity on each options call.
function renderHeaderLeft({ tintColor }: TintProps) {
  return <HeaderDrawerButton tintColor={tintColor} />;
}

function renderBasketHeaderRight({ tintColor }: TintProps) {
  return <BasketHeaderButton tintColor={tintColor} />;
}

/**
 * Base header options for all authenticated screens.
 *
 * Layout (logical, RTL-aware):
 *   [start]  DrawerButton  |  Title (centered)  |  BasketButton  [end]
 *
 * In Persian RTL: DrawerButton is on the physical right (start = right),
 * BasketButton is on the physical left (end = left). Mirrors for LTR.
 */
export function createAppHeaderOptions(theme: Theme) {
  const s = pickSemantic(theme);
  return {
    headerStyle: { backgroundColor: s.headerBg },
    headerTintColor: s.headerForeground,
    headerTitleStyle: mainTabHeaderTitleStyle,
    headerTitleAlign: 'center' as const,
    headerLeft: renderHeaderLeft,
    headerRight: renderBasketHeaderRight,
  };
}

/**
 * Header options for root/tab screens where the back button must never appear,
 * regardless of navigation history (e.g. tab backBehavior: 'history').
 */
export function createRootHeaderOptions(theme: Theme) {
  return createAppHeaderOptions(theme);
}

/** Purchase-capable screens: basket + live count replaces physical-left back. */
export function createPurchaseHeaderOptions(theme: Theme) {
  return {
    ...createAppHeaderOptions(theme),
    headerRight: renderBasketHeaderRight,
  };
}

/**
 * Header options for public, navigated-to screens (e.g. Contact): a back button
 * in the start slot instead of the drawer (hamburger) button, and no duplicate
 * back on the far side. Use for screens that are NOT drawer items.
 */
export function createPublicHeaderOptions(theme: Theme) {
  return createAppHeaderOptions(theme);
}
