import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useCurrentUser } from '@/domains/auth/hooks/useCurrentUser';
import type { TabParamList } from '@/shared/contracts/navigationApp';
import { ScreenScaffold } from '@/ui/components/ScreenScaffold';
import { initialsFromDisplayName } from '@/shared/utils/initialsFromDisplayName';
import { resolveAvatarUri } from '@/shared/utils/resolveAvatarUri';
import {
  flashListContentGutters,
  fontSize,
  fontWeight,
  pickSemantic,
  spacing,
  useScreenScaffoldStyles,
} from '@/ui/theme';
import { colors as colorPrimitives } from '@/ui/theme/colors';

type Props = BottomTabScreenProps<TabParamList, 'Profile'>;

const ProfileScreenComponent = (_props: Props) => {
  const { dark, colors } = useTheme();
  const { t } = useTranslation();
  const sSemantic = pickSemantic(dark);
  const scaffoldStyles = useScreenScaffoldStyles(colors);

  const {
    data: userRes,
    isPending,
    isError,
    refetch,
    isFetching,
  } = useCurrentUser();
  const user = userRes?.data;
  console.log({ userRes });

  const displayName = (
    user?.full_name?.trim() ||
    [user?.name, user?.family].filter(Boolean).join(' ').trim() ||
    t('drawer.user.fallbackName')
  ).trim();
  const initials = initialsFromDisplayName(displayName);
  const avatarUri = resolveAvatarUri(user?.avatar);

  const cardStyles = React.useMemo(
    () =>
      StyleSheet.create({
        card: {
          width: '100%',
          maxWidth: 440,
          backgroundColor: colors.card,
          borderRadius: 12,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
          padding: spacing['2xl'],
          gap: spacing.lg,
        },
        headerRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.lg,
        },
        avatar: {
          width: 72,
          height: 72,
          borderRadius: 36,
          backgroundColor: sSemantic.tabActive,
          alignItems: 'center',
          justifyContent: 'center',
        },
        avatarImage: {
          width: 72,
          height: 72,
          borderRadius: 36,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
        },
        initials: {
          color: colorPrimitives.white,
          fontSize: fontSize['2xl'],
          fontWeight: fontWeight.bold,
        },
        name: {
          flex: 1,
          fontSize: fontSize.xl,
          fontWeight: fontWeight.bold,
          color: colors.text,
        },
        meta: { gap: spacing.sm },
        row: { gap: spacing.xs },
        label: {
          fontSize: fontSize.sm,
          fontWeight: fontWeight.semibold,
          color: sSemantic.textSecondary,
        },
        value: {
          fontSize: fontSize.base,
          color: colors.text,
          writingDirection: 'ltr',
        },
        footerNote: {
          fontSize: fontSize.sm,
          color: sSemantic.textMuted,
          marginTop: spacing.sm,
        },
        centered: {
          minHeight: 120,
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing.md,
          width: '100%',
          maxWidth: 440,
        },
        errorTitleAlign: {
          textAlign: 'center',
          alignSelf: 'center',
        },
        errorRetryDisabled: {
          opacity: 0.5,
        },
        scrollContent: {
          ...flashListContentGutters.standard,
          alignItems: 'center',
        },
      }),
    [
      colors.border,
      colors.card,
      colors.text,
      sSemantic.tabActive,
      sSemantic.textMuted,
      sSemantic.textSecondary,
    ],
  );

  let body: React.ReactNode;
  if (isPending && !user) {
    body = (
      <View style={cardStyles.centered} accessibilityRole="progressbar">
        <ActivityIndicator size="large" color={colors.text} />
        <Text style={scaffoldStyles.subtitle}>
          {t('screens.profile.loading')}
        </Text>
      </View>
    );
  } else if (isError || !user) {
    body = (
      <View style={cardStyles.centered}>
        <Text style={[scaffoldStyles.sectionTitle, cardStyles.errorTitleAlign]}>
          {t('screens.profile.error')}
        </Text>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => {
            refetch();
          }}
          disabled={isFetching}
        >
          <Text
            style={[
              scaffoldStyles.subtitle,
              isFetching ? cardStyles.errorRetryDisabled : null,
            ]}
          >
            {isFetching
              ? t('screens.profile.loading')
              : t('screens.profile.retry')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  } else {
    body = (
      <View style={cardStyles.card}>
        <View style={cardStyles.headerRow}>
          {avatarUri ? (
            <Image
              accessibilityIgnoresInvertColors
              source={{ uri: avatarUri }}
              style={cardStyles.avatarImage}
              resizeMode="cover"
            />
          ) : (
            <View style={cardStyles.avatar}>
              <Text style={cardStyles.initials} numberOfLines={1}>
                {initials}
              </Text>
            </View>
          )}
          <Text style={cardStyles.name} numberOfLines={2}>
            {displayName}
          </Text>
        </View>
        <View style={cardStyles.meta}>
          <View style={cardStyles.row}>
            <Text style={cardStyles.label}>{t('screens.profile.email')}</Text>
            <Text style={cardStyles.value} selectable>
              {user.email}
            </Text>
          </View>
          <View style={cardStyles.row}>
            <Text style={cardStyles.label}>{t('screens.profile.mobile')}</Text>
            <Text style={cardStyles.value} selectable>
              {user.mobile}
            </Text>
          </View>
          <View style={cardStyles.row}>
            <Text style={cardStyles.label}>
              {t('screens.profile.lastLogin')}
            </Text>
            <Text style={cardStyles.value} selectable>
              {user.last_login}
            </Text>
          </View>
        </View>
        <Text style={cardStyles.footerNote}>
          {user.is_active
            ? t('screens.profile.accountActive')
            : t('screens.profile.accountInactive')}
        </Text>
      </View>
    );
  }

  return (
    <ScreenScaffold
      title={t('screens.profile.title')}
      subtitle={t('screens.profile.subtitle')}
    >
      <ScrollView
        contentContainerStyle={cardStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {body}
      </ScrollView>
    </ScreenScaffold>
  );
};

export const ProfileScreen = React.memo(ProfileScreenComponent);
ProfileScreen.displayName = 'ProfileScreen';
