import * as React from 'react';
import {Pressable, type ViewStyle, type TextStyle} from 'react-native';
import { Text } from '@/shared/ui/Text';

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
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => (pressed ? [s.button, s.buttonPressed] : s.button)}
    >
      <Text style={s.label} numberOfLines={2}>
        {label}
      </Text>
    </Pressable>
  );
});
ProfileActionButton.displayName = 'ProfileActionButton';

/** @alias {@link ProfileActionButton} */
export const ActionButton = ProfileActionButton;
