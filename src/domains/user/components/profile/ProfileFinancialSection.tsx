import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import type { ProfileMenuListItem } from '@/domains/user/model/profileMenu.types';
import { SectionDivider } from '@/ui/components/SectionDivider';
import type { SectionDividerStyleSet } from '@/ui/theme';
import type { ProfileScreenMenuStyleSet } from '@/domains/user/ui/profileScreen.styles';
import type { AppLeafRouteName } from '@/shared/contracts/navigationApp';

import { ProfileMenuSection } from './ProfileMenuSection';

export type ProfileFinancialSectionProps = {
  items: readonly ProfileMenuListItem[];
  menuStyles: ProfileScreenMenuStyleSet;
  dividerStyles: SectionDividerStyleSet;
  onNavigate: (route: AppLeafRouteName) => void;
};

export const ProfileFinancialSection = React.memo(function ProfileFinancialSection({
  items,
  menuStyles,
  dividerStyles,
  onNavigate,
}: ProfileFinancialSectionProps) {
  const { t } = useTranslation();

  return (
    <>
      <View style={menuStyles.sectionSpacing}>
        <SectionDivider
          title={t('screens.profile.sectionFinancial')}
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
ProfileFinancialSection.displayName = 'ProfileFinancialSection';
