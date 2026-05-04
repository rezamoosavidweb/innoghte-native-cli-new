import * as React from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  View,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Text } from '@/shared/ui/Text';

import type { EditProfileFormType } from '@/domains/user/model/editProfileForm.schema';
import { createProfileAvatarPickerStyles } from '@/domains/user/ui/profileAvatarPicker.styles';
import { resolveAvatarUri } from '@/shared/utils/resolveAvatarUri';
import { useThemeColors } from '@/ui/theme';
import { spacing } from '@/ui/theme/core/spacing';
import { radius } from '@/ui/theme/core/radius';
import { Button } from '@/ui/components/Button';

export type ProfileAvatarPickerProps = {
  accessibilityPickLabel: string;
  pickHintLabel: string;
  defaultRemoteUri?: string | null;
  value: EditProfileFormType['avatar'];
  onChange: (next: EditProfileFormType['avatar']) => void;
  busy?: boolean;
  error?: string;
};

export const ProfileAvatarPicker = React.memo(function ProfileAvatarPicker({
  accessibilityPickLabel,
  pickHintLabel,
  defaultRemoteUri,
  value,
  onChange,
  busy,
  error,
}: ProfileAvatarPickerProps) {
  const colors = useThemeColors();
  const avatarChrome = createProfileAvatarPickerStyles(colors);

  const previewUri = React.useMemo(() => {
    if (typeof value === 'object' && value !== null && 'uri' in value) {
      return value.uri;
    }
    if (typeof value === 'string' && value.length > 0) {
      return resolveAvatarUri(value) ?? '';
    }
    return defaultRemoteUri ?? '';
  }, [value, defaultRemoteUri]);

  const onPick = React.useCallback(() => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 1,
        includeExtra: true,
      },
      response => {
        if (response.didCancel || response.errorCode) {
          return;
        }
        const asset = response.assets?.[0];
        if (!asset?.uri) {
          return;
        }
        onChange({
          uri: asset.uri,
          type:
            asset.type === 'image/jpg'
              ? 'image/jpeg'
              : asset.type ?? 'image/jpeg',
          name: asset.fileName ?? 'avatar.jpg',
          fileSize: asset.fileSize,
        });
      },
    );
  }, [onChange]);

  return (
    <View style={styles.wrap}>
      <Button
        layout="auto"
        variant="text"
        title={accessibilityPickLabel}
        accessibilityLabel={accessibilityPickLabel}
        disabled={busy}
        onPress={onPick}
        style={[styles.frame, avatarChrome.frame]}
        contentStyle={{
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {previewUri ? (
          <Image
            accessibilityIgnoresInvertColors
            source={{ uri: previewUri }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <Text style={[styles.placeholder, avatarChrome.placeholderMuted]}>
            —
          </Text>
        )}
        {busy ? (
          <View style={styles.busyOverlay}>
            <ActivityIndicator color={colors.text} />
          </View>
        ) : null}
      </Button>
      <Text style={[styles.hint, avatarChrome.hintMuted]}>{pickHintLabel}</Text>
      {error ? (
        <Text style={[styles.error, avatarChrome.errorTint]}>{error}</Text>
      ) : null}
    </View>
  );
});

ProfileAvatarPicker.displayName = 'ProfileAvatarPicker';

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  frame: {
    width: 112,
    height: 112,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    fontSize: 28,
  },
    busyOverlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000044',
  },
  hint: {
    fontSize: 13,
    maxWidth: 260,
  },
  error: {
    fontSize: 13,
  },
});
