import * as React from 'react';
import {type ViewStyle, type TextStyle} from 'react-native';
import { Text } from '@/shared/ui/Text';

import { Button } from '@/ui/components/Button';

export type ProfileActionButtonStyleSet = {
  button: ViewStyle;
  buttonPressed: ViewStyle;
  label: TextStyle;
};

export type ProfileActionButtonProps = {
  label: string;
  onPress: () => void;
  styles: ProfileActionButtonStyleSet;
};

/** Compact profile shortcut — used in a horizontal row under the header. */
export const ProfileActionButton = React.memo(function ProfileActionButton({
  label,
  onPress,
  styles: s,
}: ProfileActionButtonProps) {
  return (
    <Button
      layout="auto"
      variant="text"
      title={label}
      onPress={onPress}
      style={s.button}
      contentStyle={{ width: '100%' }}
    >
      <Text style={s.label} numberOfLines={2}>
        {label}
      </Text>
    </Button>
  );
});
ProfileActionButton.displayName = 'ProfileActionButton';

/** @alias {@link ProfileActionButton} */
export const ActionButton = ProfileActionButton;
