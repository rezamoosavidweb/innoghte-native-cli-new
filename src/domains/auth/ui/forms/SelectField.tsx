import * as React from 'react';
import {Pressable, View} from 'react-native';
import { Text } from '@/shared/ui/Text';

import { createLoginScreenStyles } from '@/domains/auth/ui/styles';
import { useThemeColors } from '@/ui/theme';

type Option = { label: string; value: string };

type Props = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

export function SelectField({ options, value, onChange, error }: Props) {
  const colors = useThemeColors();
  const s = createLoginScreenStyles(colors);

  return (
    <View>
      <View style={s.row}>
        {options.map(option => (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            accessibilityState={{ selected: option.value === value }}
            style={[
              s.modeButton,
              option.value === value ? s.modeButtonActive : null,
            ]}
            onPress={() => onChange(option.value)}
          >
            <Text style={s.modeText}>{option.label}</Text>
          </Pressable>
        ))}
      </View>
      {error ? <Text style={s.errorText}>{error}</Text> : null}
    </View>
  );
}
