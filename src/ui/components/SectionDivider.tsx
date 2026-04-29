import * as React from 'react';
import { Text, View } from 'react-native';

import type { SectionDividerStyleSet } from '@/ui/theme/core/sectionDivider';

export type SectionDividerProps = {
  /** Section label shown inline with the rule. */
  title: string;
  /** From {@link useSectionDividerStyles} (or compatible StyleSheet). */
  styles: SectionDividerStyleSet;
  testID?: string;
  /** Defaults to `title` when omitted. */
  accessibilityLabel?: string;
};

/**
 * Inline section heading with a horizontal rule — use between menu groups (profile, drawer, settings).
 */
export const SectionDivider = React.memo(function SectionDivider({
  title,
  styles: s,
  testID,
  accessibilityLabel,
}: SectionDividerProps) {
  const a11yLabel = accessibilityLabel ?? title;

  return (
    <View
      style={s.root}
      accessibilityRole="header"
      accessibilityLabel={a11yLabel}
      testID={testID}
    >
      <Text style={s.title}>{title}</Text>
      <View style={s.line} accessibilityElementsHidden />
    </View>
  );
});
SectionDivider.displayName = 'SectionDivider';
