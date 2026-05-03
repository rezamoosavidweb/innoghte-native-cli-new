import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import * as React from 'react';
import { ScrollView } from 'react-native';

import { ProfileErrorState } from '@/domains/user/components/profile/ProfileErrorState';
import { ProfileLoadingState } from '@/domains/user/components/profile/ProfileLoadingState';
import { ProfileView } from '@/domains/user/components/profile/ProfileView';
import { useProfileScreenModel } from '@/domains/user/hooks/useProfileScreenModel';
import type { TabParamList } from '@/shared/contracts/navigationApp';

type Props = BottomTabScreenProps<TabParamList, 'Profile'>;

const ProfileScreenComponent = (_props: Props) => {
  const model = useProfileScreenModel();

  return (
    <ScrollView
      contentContainerStyle={model.styles.menu.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      {model.isPending && !model.user ? (
        <ProfileLoadingState
          shellStyles={model.styles.shell}
          subtitleStyle={model.styles.scaffoldSubtitle}
          message={model.loadingMessage}
          activityColor={model.styles.activityColor}
        />
      ) : model.isError || !model.user || !model.profileUser ? (
        <ProfileErrorState
          shellStyles={model.styles.shell}
          errorTitleStyle={model.styles.scaffoldSectionTitle}
          retryBaseStyle={model.styles.scaffoldSubtitle}
          onRetry={model.actions.onRetry}
          isFetching={model.isFetching}
        />
      ) : (
        <ProfileView
          profileUser={model.profileUser}
          initials={model.initials}
          avatarUri={model.avatarUri}
          sections={model.sections}
          styles={{
            header: model.styles.header,
            menu: model.styles.menu,
            divider: model.styles.divider,
          }}
          actions={{
            onNavigate: model.actions.onNavigate,
            onProfileShortcut: model.actions.onProfileShortcut,
            onStartVerify: model.actions.onStartVerify,
          }}
        />
      )}
    </ScrollView>
  );
};

export const ProfileScreen = React.memo(ProfileScreenComponent);
ProfileScreen.displayName = 'ProfileScreen';
