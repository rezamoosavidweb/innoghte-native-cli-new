import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  View,
} from 'react-native';

import { navigateToAppLeaf } from '@/app/bridge/auth';
import { useCurrentUser } from '@/domains/auth/hooks/useCurrentUser';
import { mapUserDtoToProfileHeaderUser } from '@/domains/user/model/profileHeaderUser';
import type { VerifyChannel } from '@/shared/contracts/verification';
import { isDotIr } from '@/shared/config/resolveIsDotIr';
import { useAppNavigation } from '@/shared/lib/navigation/useAppNavigation';
import { Text } from '@/shared/ui/Text';
import { toPersianNumber } from '@/shared/utils/toPersianNumber';
import {
  flashListContentGutters,
  createNavScreenShellStyles,
  useThemeColors,
} from '@/ui/theme';
import {
  createAccountScreenStyles,
  type AccountScreenStyles,
} from '@/domains/user/ui/accountScreen.styles';

export const AccountScreen = () => {
  const navigation = useAppNavigation();
  const { colors } = useTheme();
  const uiColors = useThemeColors();
  const shell = createNavScreenShellStyles(colors);
  const { t } = useTranslation();

  const screenStyles = React.useMemo(
    () => createAccountScreenStyles(colors, uiColors),
    [colors, uiColors],
  );

  const { data: userRes, isPending, isError, refetch } = useCurrentUser();
  const user = userRes?.data;

  const profileUser = React.useMemo(
    () => (user ? mapUserDtoToProfileHeaderUser(user) : null),
    [user],
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: t('screens.account.navTitle'),
    });
  }, [navigation, t]);

  const mobileDisplay = profileUser?.phone ?? '—';
  const mobileShown = isDotIr
    ? toPersianNumber(mobileDisplay)
    : mobileDisplay;

  const onEdit = React.useCallback(() => {
    navigateToAppLeaf(navigation, 'EditProfile');
  }, [navigation]);

  const onVerify = React.useCallback(
    (channel: VerifyChannel) => {
      navigateToAppLeaf(navigation, 'Verify', { type: channel });
    },
    [navigation],
  );

  if (isPending && !user) {
    return (
      <View style={[shell.safe, flashListContentGutters.standard]}>
        <ActivityIndicator color={colors.text} />
      </View>
    );
  }

  if (isError || !profileUser) {
    return (
      <View style={[shell.safe, flashListContentGutters.standard]}>
        <Text style={screenStyles.errorText}>
          {t('screens.account.loadError')}
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            refetch().catch(() => {});
          }}
          style={screenStyles.retryPressable}
        >
          <Text style={screenStyles.retryLabel}>{t('listStates.retry')}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={shell.safe}
      contentContainerStyle={flashListContentGutters.standard}
      keyboardShouldPersistTaps="handled"
    >
      <View style={screenStyles.headerRow}>
        <Text style={screenStyles.screenTitle}>
          {t('screens.account.screenTitle')}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('screens.account.edit')}
          onPress={onEdit}
          style={({ pressed }) => [
            screenStyles.editBtn,
            pressed ? screenStyles.editBtnPressed : null,
          ]}
        >
          <Text style={screenStyles.editLabel}>{t('screens.account.edit')}</Text>
        </Pressable>
      </View>

      <AccountRow styles={screenStyles} label={t('screens.account.fullName')} value={profileUser.fullName || '—'} />
      <AccountRowWithBadge
        styles={screenStyles}
        label={t('screens.account.email')}
        value={profileUser.email || '—'}
        verified={profileUser.isEmailVerified}
        verifyChannel="email"
        onVerify={onVerify}
      />
      <AccountRowWithBadge
        styles={screenStyles}
        label={t('screens.account.mobile')}
        value={mobileShown || '—'}
        verified={profileUser.isPhoneVerified}
        verifyChannel="mobile"
        onVerify={onVerify}
      />
    </ScrollView>
  );
};

AccountScreen.displayName = 'AccountScreen';

type AccountRowProps = {
  styles: AccountScreenStyles;
  label: string;
  value: string;
};

const AccountRow = React.memo(function AccountRow({
  styles: s,
  label,
  value,
}: AccountRowProps) {
  return (
    <View style={s.rowBlock}>
      <Text style={s.rowLabelMuted}>{label}</Text>
      <Text selectable style={s.rowValue}>
        {value}
      </Text>
    </View>
  );
});

type AccountRowWithBadgeProps = {
  styles: AccountScreenStyles;
  label: string;
  value: string;
  verified: boolean;
  verifyChannel: VerifyChannel;
  onVerify: (c: VerifyChannel) => void;
};

const AccountRowWithBadge = React.memo(function AccountRowWithBadge({
  styles: s,
  label,
  value,
  verified,
  verifyChannel,
  onVerify,
}: AccountRowWithBadgeProps) {
  const { t } = useTranslation();

  const onPressVerify = React.useCallback(() => {
    onVerify(verifyChannel);
  }, [onVerify, verifyChannel]);

  return (
    <View style={s.rowBlock}>
      <Text style={s.rowLabelMuted}>{label}</Text>
      <View style={s.badgeRow}>
        <Text selectable style={s.badgeValue}>
          {value}
        </Text>
        <View
          style={
            verified ? s.badgePillVerified : s.badgePillUnverified
          }
        >
          <Text
            style={
              verified ? s.badgeTextVerified : s.badgeTextUnverified
            }
          >
            {verified
              ? t('screens.account.verified')
              : t('screens.account.unverified')}
          </Text>
        </View>
        {!verified ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('screens.account.verify')}
            onPress={onPressVerify}
          >
            <Text style={s.verifyLink}>{t('screens.account.verify')}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
});
