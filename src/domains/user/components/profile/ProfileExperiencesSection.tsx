import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { SectionDivider } from '@/ui/components/SectionDivider';
import type { SectionDividerStyleSet } from '@/ui/theme';
import type { ProfileMenuListItem } from '@/domains/user/model/profileMenu.types';
import type { ProfileScreenMenuStyleSet } from '@/domains/user/ui/profileScreen.styles';
import type { AppLeafRouteName } from '@/shared/contracts/navigationApp';

import { ProfileMenuSection } from './ProfileMenuSection';

export type ProfileExperiencesSectionProps = {
  items: readonly ProfileMenuListItem[];
  menuStyles: ProfileScreenMenuStyleSet;
  dividerStyles: SectionDividerStyleSet;
  onNavigate: (route: AppLeafRouteName) => void;
};

export const ProfileExperiencesSection = React.memo(
  function ProfileExperiencesSection({
    items,
    menuStyles,
    dividerStyles,
    onNavigate,
  }: ProfileExperiencesSectionProps) {
    const { t } = useTranslation();

    return (
      <>
        <View style={menuStyles.sectionSpacing}>
          <SectionDivider
            title={t('screens.profile.sectionExperiences')}
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
  },
);
ProfileExperiencesSection.displayName = 'ProfileExperiencesSection';
