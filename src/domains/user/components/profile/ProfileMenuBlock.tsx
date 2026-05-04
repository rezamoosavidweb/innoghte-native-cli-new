import * as React from 'react';
import { View } from 'react-native';

import type { ProfileMenuListItem } from '@/domains/user/model/profileMenu.types';
import type { ProfileScreenMenuStyleSet } from '@/domains/user/ui/profileScreen.styles';
import type { AppLeafRouteName } from '@/shared/contracts/navigationApp';
import { SectionDivider } from '@/ui/components/SectionDivider';
import type { SectionDividerStyleSet } from '@/ui/theme';

import { ProfileMenuSection } from './ProfileMenuSection';

export type ProfileMenuBlockStyles = Readonly<{
  menu: ProfileScreenMenuStyleSet;
  divider: SectionDividerStyleSet;
}>;

export type ProfileMenuBlockProps = Readonly<{
  title: string;
  items: readonly ProfileMenuListItem[];
  onNavigate: (route: AppLeafRouteName) => void;
  styles: ProfileMenuBlockStyles;
  extraContent?: React.ReactNode;
}>;

export const ProfileMenuBlock = React.memo(function ProfileMenuBlock({
  title,
  items,
  onNavigate,
  styles,
  extraContent,
}: ProfileMenuBlockProps) {
  return (
    <>
      <View style={styles.menu.sectionSpacing}>
        <SectionDivider title={title} styles={styles.divider} />
      </View>
      <ProfileMenuSection
        items={items}
        menuStyles={styles.menu}
        onNavigate={onNavigate}
        footer={extraContent}
      />
    </>
  );
});
ProfileMenuBlock.displayName = 'ProfileMenuBlock';
