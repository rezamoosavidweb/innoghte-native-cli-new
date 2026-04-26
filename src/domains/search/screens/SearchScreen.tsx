import * as React from 'react';
import { useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { ScreenScaffold } from '@/ui/components/ScreenScaffold';

const SearchScreenComponent = () => {
  const route = useRoute();
  const query = (route.params as { query?: string } | undefined)?.query;
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
