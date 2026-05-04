import * as React from 'react';
import {View} from 'react-native';
import { Text } from '@/shared/ui/Text';

import { createLoginScreenStyles } from '@/domains/auth/ui/styles';
import { useThemeColors } from '@/ui/theme';
import { Button } from '@/ui/components/Button';

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
          <Button
            key={option.value}
            layout="auto"
            variant="text"
            title={option.label}
            accessibilityState={{ selected: option.value === value }}
            style={[
              s.modeButton,
              option.value === value ? s.modeButtonActive : null,
            ]}
            onPress={() => onChange(option.value)}
            contentStyle={{ width: '100%' }}
          >
            <Text style={s.modeText}>{option.label}</Text>
          </Button>
        ))}
      </View>
      {error ? <Text style={s.errorText}>{error}</Text> : null}
    </View>
  );
}
