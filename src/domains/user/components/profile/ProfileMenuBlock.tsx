import * as React from 'react';
import { View } from 'react-native';

import type { ProfileMenuListItem } from '@/domains/user/model/profileMenu.types';
import type { ProfileScreenMenuStyleSet } from '@/domains/user/ui/profileScreen.styles';
import type { AppLeafRouteName } from '@/shared/contracts/navigationApp';
import { MenuSection } from '@/ui/components/MenuSection';
import { SectionDivider } from '@/ui/components/SectionDivider';
import type { SectionDividerStyleSet } from '@/ui/theme';

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
      <MenuSection
        items={items}
        styles={styles.menu}
        onNavigate={onNavigate}
        footer={extraContent}
      />
    </>
  );
});
ProfileMenuBlock.displayName = 'ProfileMenuBlock';
