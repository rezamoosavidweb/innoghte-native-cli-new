import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { CategoryCatalogScreen } from '@/shared/ui/catalog/CategoryCatalogScreen';

const AUDIO_BOOK_CATEGORY_ID = 11;

const AudioBooksScreenComponent = () => {
  const { t } = useTranslation();
  return (
    <CategoryCatalogScreen
      categoryId={AUDIO_BOOK_CATEGORY_ID}
      detailKind="audioBook"
      copy={{
        loading: t('screens.audioBooks.loading'),
        error: t('screens.audioBooks.error'),
        empty: t('screens.audioBooks.empty'),
        retry: t('listStates.retry'),
      }}
    />
  );
};

export const AudioBooksScreen = React.memo(AudioBooksScreenComponent);
AudioBooksScreen.displayName = 'AudioBooksScreen';
