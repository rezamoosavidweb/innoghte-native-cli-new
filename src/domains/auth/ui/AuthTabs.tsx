import * as React from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '@/shared/ui/Text';

import { useThemeColors } from '@/ui/theme';
import { createAuthTabsStyles } from '@/domains/auth/ui/authTabs.styles';

type Tab = { label: string; value: string };

type Props = {
  tabs: Tab[];
  value: string;
  onChange: (value: string) => void;
};

export function AuthTabs({ tabs, value, onChange }: Props) {
  const colors = useThemeColors();
  const s = createAuthTabsStyles(colors);

  return (
    <View style={s.container}>
      {tabs.map(tab => (
        <Pressable
          key={tab.value}
          style={[s.tab, tab.value === value && s.tabActive]}
          onPress={() => onChange(tab.value)}
          accessibilityRole="tab"
          accessibilityState={{ selected: tab.value === value }}
        >
          <Text style={[s.tabLabel, tab.value === value && s.tabLabelActive]}>
            {tab.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
