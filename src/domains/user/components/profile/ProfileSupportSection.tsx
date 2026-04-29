import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import type { ProfileMenuListItem } from '@/domains/user/model/profileMenu.types';
import { SectionDivider } from '@/ui/components/SectionDivider';
import type { SectionDividerStyleSet } from '@/ui/theme';
import type { ProfileScreenMenuStyleSet } from '@/domains/user/ui/profileScreen.styles';
import type { AppLeafRouteName } from '@/shared/contracts/navigationApp';

import { ProfileMenuSection } from './ProfileMenuSection';

export type ProfileSupportSectionProps = {
  items: readonly ProfileMenuListItem[];
  menuStyles: ProfileScreenMenuStyleSet;
  dividerStyles: SectionDividerStyleSet;
  onNavigate: (route: AppLeafRouteName) => void;
};

export const ProfileSupportSection = React.memo(function ProfileSupportSection({
  items,
  menuStyles,
  dividerStyles,
  onNavigate,
}: ProfileSupportSectionProps) {
  const { t } = useTranslation();

  return (
    <>
      <View style={menuStyles.sectionSpacing}>
        <SectionDivider
          title={t('screens.profile.sectionSupportLegal')}
          styles={dividerStyles}
        />
      </View>
      <ProfileMenuSection
        items={items}
        menuStyles={menuStyles}
        onNavigate={onNavigate}
      />
    </>
  );
});
ProfileSupportSection.displayName = 'ProfileSupportSection';
