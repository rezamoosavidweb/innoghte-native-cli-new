import * as React from 'react';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { ScreenScaffold } from '@/shared/components/ScreenScaffold';
import type { TabParamList } from '@/shared/navigation/types';

type Props = BottomTabScreenProps<TabParamList, 'Search'>;

const SearchScreenComponent = (_props: Props) => {
  const route = useRoute<Props['route']>();
  const query = route.params?.query;
  const { t } = useTranslation();

  const subtitle = query
    ? t('screens.search.subtitleWithQuery', { query })
    : t('screens.search.subtitleDefault');

  return (
    <ScreenScaffold title={t('screens.search.title')} subtitle={subtitle} />
  );
};

export const SearchScreen = React.memo(SearchScreenComponent);
SearchScreen.displayName = 'SearchScreen';
