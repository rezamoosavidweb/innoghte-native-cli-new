import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { DrawerActions, useTheme } from '@react-navigation/native';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PUBLIC_WEB_ORIGIN } from '@/shared/config/publicWebOrigin';
import { Text } from '@/shared/ui/Text';
import { Button } from '@/ui/components/Button';
import { SectionDivider } from '@/ui/components/SectionDivider';
import {
  staticDrawerStyles,
  useCustomDrawerDynamicStyles,
} from '@/ui/layout/customDrawerContent.styles';
import { DrawerFooterSocials } from '@/ui/layout/DrawerFooterSocials';
import { useShellDrawerModel } from '@/ui/layout/ShellDrawerContext';
import {
  createSectionDividerStyles,
  drawerChrome,
  pickSemantic,
} from '@/ui/theme';
import { version as appVersion } from 'appPackage';

import HandHeartIcon from '@/assets/icons/hand-heart.svg';
import AlbumIcon from '@/assets/icons/inn/album.svg';
import ConsultantIcon from '@/assets/icons/inn/consultant.svg';
import CourseIcon from '@/assets/icons/inn/course.svg';
import DocIcon from '@/assets/icons/inn/doc.svg';
import Doc2Icon from '@/assets/icons/inn/doc2.svg';
import EventIcon from '@/assets/icons/inn/event.svg';
import ListeningIcon from '@/assets/icons/inn/listening.svg';
import LiveIcon from '@/assets/icons/inn/live.svg';
import MeditationIcon from '@/assets/icons/inn/meditation.svg';
import PodcastIcon from '@/assets/icons/inn/podcast.svg';
import ReadingIcon from '@/assets/icons/inn/reading.svg';
import ShieldIcon from '@/assets/icons/inn/shield.svg';
import WritingIcon from '@/assets/icons/inn/writing.svg';
import StarIcon from '@/assets/icons/star.svg';
import Star2Icon from '@/assets/icons/star2.svg';

const REGISTER_WEB_URL = `${PUBLIC_WEB_ORIGIN}/auth/register`;

type SvgProps = { width?: number; height?: number; color?: string };
type IconSizing = number | { width?: number; height?: number };

const svgIcon =
  (Svg: React.ComponentType<SvgProps>, color: string, sizing?: IconSizing) =>
  ({ size }: { color: string; size: number }) =>
    (
      <Svg
        width={typeof sizing === 'object' ? sizing?.width : size}
        height={typeof sizing === 'object' ? sizing?.height : size}
        color={color}
      />
    );

export const CustomDrawerContent = React.memo(function CustomDrawerContent(
  props: DrawerContentComponentProps,
) {
  const { state, navigation } = props;
  const { t } = useTranslation();
  const { user: drawerUser } = useShellDrawerModel();
  const theme = useTheme();
  const { colors } = theme;
  const s = pickSemantic(theme);

  const icons = React.useMemo(
    () => ({
      courses: svgIcon(CourseIcon, colors.text, 20),
      albums: svgIcon(AlbumIcon, colors.text, 20),
      liveMeetings: svgIcon(LiveIcon, colors.text, 21),
      meditation: svgIcon(MeditationIcon, colors.text, 45),
      writing: svgIcon(WritingIcon, colors.text, 45),
      listening: svgIcon(ListeningIcon, colors.text, 45),
      reading: svgIcon(ReadingIcon, colors.text, 45),
      consultant: svgIcon(ConsultantIcon, colors.text, 45),
      event: svgIcon(EventIcon, colors.text, 45),
      docPlain: svgIcon(DocIcon, colors.text),
      docText: svgIcon(Doc2Icon, colors.text),
      shield: svgIcon(ShieldIcon, colors.text),
      star: svgIcon(StarIcon, colors.text),
      handHeart: svgIcon(HandHeartIcon, colors.text),
      star2: svgIcon(Star2Icon, colors.text),
      podcast: svgIcon(PodcastIcon, colors.text),
    }),
    [colors.text],
  );
  const displayName = drawerUser.displayName;
  const emailLine = drawerUser.emailLine;
  const avatarInitials = drawerUser.avatarInitials;

  const dynamicStyles = useCustomDrawerDynamicStyles(colors, s);

  const onLogin = React.useCallback(() => {
    navigation.navigate('Login');
  }, [navigation]);

  const onRegister = React.useCallback(() => {
    Linking.openURL(REGISTER_WEB_URL);
  }, []);

  const onProfilePress = React.useCallback(() => {
    navigation.navigate('MainTabs', { screen: 'Profile' });
  }, [navigation]);

  const isAuthed = drawerUser.isAuthenticated;

  const sectionDividerStyles = React.useMemo(
    () => createSectionDividerStyles(colors, theme),
    [colors, theme],
  );

  const currentRoute = state.routes[state.index]?.name;

  const go = (routeName: string) => () =>
    navigation.dispatch({
      ...DrawerActions.jumpTo(routeName),
      target: state.key,
    });

  const itemProps = {
    style: drawerChrome.drawerItem,
    labelStyle: drawerChrome.drawerLabel,
    activeTintColor: s.drawerActiveTint,
    inactiveTintColor: s.drawerInactiveTint,
    activeBackgroundColor: s.drawerActiveBg,
  };

  return (
    <SafeAreaView style={staticDrawerStyles.safe} edges={['top', 'bottom']}>
      <View style={dynamicStyles.sheet}>
        {isAuthed ? (
          <>
            <TouchableOpacity
              style={dynamicStyles.profileSection}
              onPress={onProfilePress}
              activeOpacity={0.7}
            >
              <View style={dynamicStyles.avatar}>
                <Text style={staticDrawerStyles.avatarText}>
                  {avatarInitials}
                </Text>
              </View>
              <View style={staticDrawerStyles.profileInfo}>
                <Text style={dynamicStyles.userName}>{displayName}</Text>
                <Text style={dynamicStyles.userEmail}>{emailLine}</Text>
              </View>
            </TouchableOpacity>
            <View style={dynamicStyles.divider} />
          </>
        ) : (
          <>
            <View style={staticDrawerStyles.guestActions}>
              <Button
                layout="auto"
                variant="filled"
                title={t('drawer.guest.login')}
                style={dynamicStyles.guestBtnPrimary}
                onPress={onLogin}
                contentStyle={{ width: '100%' }}
              >
                <Text style={dynamicStyles.guestBtnPrimaryLabel}>
                  {t('drawer.guest.login')}
                </Text>
              </Button>
              <Button
                layout="auto"
                variant="outlined"
                title={t('drawer.guest.register')}
                style={dynamicStyles.guestBtnOutline}
                onPress={onRegister}
                contentStyle={{ width: '100%' }}
              >
                <Text style={dynamicStyles.guestBtnOutlineLabel}>
                  {t('drawer.guest.register')}
                </Text>
              </Button>
            </View>
            <View style={dynamicStyles.divider} />
          </>
        )}

        <DrawerContentScrollView
          {...props}
          contentContainerStyle={staticDrawerStyles.scrollContent}
        >
          <View style={staticDrawerStyles.sectionDividerWrapper}>
            <SectionDivider
              title={t('drawer.section.services')}
              styles={sectionDividerStyles}
            />
          </View>
          <DrawerItem
            {...itemProps}
            label={t('drawer.publicCourses')}
            icon={icons.courses}
            focused={currentRoute === 'Courses'}
            onPress={go('Courses')}
          />
          <DrawerItem
            {...itemProps}
            label={t('drawer.publicAlbums')}
            icon={icons.albums}
            focused={currentRoute === 'Albums'}
            onPress={go('Albums')}
          />
          <DrawerItem
            {...itemProps}
            label={t('drawer.liveMeetings')}
            icon={icons.liveMeetings}
            focused={currentRoute === 'LiveMeetings'}
            onPress={go('LiveMeetings')}
          />

          <View style={staticDrawerStyles.sectionDividerWrapper}>
            <SectionDivider
              title={t('drawer.section.experience')}
              styles={sectionDividerStyles}
            />
          </View>
          <DrawerItem
            {...itemProps}
            label={t('drawer.podcast')}
            icon={icons.podcast}
            focused={currentRoute === 'Podcast'}
            onPress={go('Podcast')}
          />
          <DrawerItem
            {...itemProps}
            label={t('drawer.meditation')}
            icon={icons.meditation}
            focused={currentRoute === 'Meditation'}
            onPress={go('Meditation')}
          />
          <DrawerItem
            {...itemProps}
            label={t('drawer.reading')}
            icon={icons.reading}
            focused={currentRoute === 'Reading'}
            onPress={go('Reading')}
          />
          <DrawerItem
            {...itemProps}
            label={t('drawer.listening')}
            icon={icons.listening}
            focused={currentRoute === 'Listening'}
            onPress={go('Listening')}
          />
          <DrawerItem
            {...itemProps}
            label={t('drawer.writing')}
            icon={icons.writing}
            focused={currentRoute === 'Writing'}
            onPress={go('Writing')}
          />
          <DrawerItem
            {...itemProps}
            label={t('drawer.privateConsultation')}
            icon={icons.consultant}
            focused={currentRoute === 'PrivateConsultation'}
            onPress={go('PrivateConsultation')}
          />

          <DrawerItem
            {...itemProps}
            label={t('drawer.events')}
            icon={icons.star}
            focused={currentRoute === 'Events'}
            onPress={go('Events')}
          />
          <DrawerItem
            {...itemProps}
            label={t('drawer.donation')}
            icon={icons.handHeart}
            focused={currentRoute === 'Donation'}
            onPress={go('Donation')}
          />
          <DrawerItem
            {...itemProps}
            label={t('drawer.aboutUs')}
            icon={icons.star2}
            focused={currentRoute === 'AboutUs'}
            onPress={go('AboutUs')}
          />
          <DrawerItem
            {...itemProps}
            label={t('drawer.collaboration')}
            icon={icons.handHeart}
            focused={currentRoute === 'Collaboration'}
            onPress={go('Collaboration')}
          />
        </DrawerContentScrollView>

        <View style={staticDrawerStyles.footer}>
          <View style={dynamicStyles.divider} />
          <DrawerFooterSocials />
          <Text style={dynamicStyles.version}>
            {t('drawerFooter.version', { version: appVersion })}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
});

CustomDrawerContent.displayName = 'CustomDrawerContent';
