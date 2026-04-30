import * as React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '@react-navigation/native';
import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import { useShallow } from 'zustand/react/shallow';
import { useTranslation } from 'react-i18next';

import { FaqExpandableRow } from '@/domains/support/faqs/ui/list/FaqExpandableRow';
import { useFaqs } from '@/domains/support/faqs/hooks/useFaqs';
import type { TabParamList } from '@/shared/contracts/navigationApp';
import {
  flashListEstimatedItemSize,
  flashListRowSeparators,
  pickSemantic,
  useNavScreenShellStyles,
} from '@/ui/theme';
import {
  useFaqsCategoryChipStyles,
  useFaqsScreenLayoutStyles,
  useFaqsSearchInputStyles,
} from '@/domains/support/faqs/ui';
import { useFaqHubStore } from '@/domains/support/faqs/model/faqHub.store';

type Props = BottomTabScreenProps<TabParamList, 'Faqs'>;

type FaqRow = {
  id: number;
  question: string;
  answer: string;
};

const CategoryChip = React.memo(function CategoryChip({
  title,
  active,
  onPress,
}: {
  title: string;
  active: boolean;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  const s = useFaqsCategoryChipStyles(colors, active);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => [s.press, pressed ? s.pressDim : null]}
    >
      <Text style={s.label}>{title}</Text>
    </Pressable>
  );
});
CategoryChip.displayName = 'CategoryChip';

const ListSep = React.memo(function ListSep() {
  return <View style={flashListRowSeparators.h10} />;
});
ListSep.displayName = 'ListSep';

const FaqsScreenComponent = (_props: Props) => {
  const { data, isPending, isError, error } = useFaqs();
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const { colors } = theme;
  const semantic = pickSemantic(theme);
  const shell = useNavScreenShellStyles(colors);
  const inputS = useFaqsSearchInputStyles(colors);
  const layout = useFaqsScreenLayoutStyles();
  const { activeCategoryId, searchQuery, setActiveCategoryId, setSearchQuery } =
    useFaqHubStore(
      useShallow(s => ({
        activeCategoryId: s.activeCategoryId,
        searchQuery: s.searchQuery,
        setActiveCategoryId: s.setActiveCategoryId,
        setSearchQuery: s.setSearchQuery,
      })),
    );
  React.useEffect(() => {
    if (data?.length && activeCategoryId === null) {
      setActiveCategoryId(data[0].id);
    }
  }, [data, activeCategoryId, setActiveCategoryId]);

  const rows = React.useMemo((): readonly FaqRow[] => {
    if (!data?.length || activeCategoryId === null) return [];
    const cat = data.find(c => c.id === activeCategoryId);
    if (!cat) return [];
    const q = searchQuery.trim().toLowerCase();
    return cat.faqs
      .filter(f => {
        if (!q) return true;
        return (
          f.question.toLowerCase().includes(q) ||
          f.answer.toLowerCase().includes(q)
        );
      })
      .map(f => ({
        id: f.id,
        question: f.question,
        answer: f.answer,
      }));
  }, [data, activeCategoryId, searchQuery]);

  const renderItem: ListRenderItem<FaqRow> = React.useCallback(
    ({ item }) => <FaqExpandableRow question={item.question} answer={item.answer} />,
    [],
  );

  const keyExtractor = React.useCallback((item: FaqRow) => String(item.id), []);

  if (isPending) {
    return (
      <View style={shell.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={shell.loadingText}>{t('screens.faqs.loading')}</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={shell.centered}>
        <Text style={shell.errorText}>{t('screens.faqs.error')}</Text>
        <Text style={shell.errorDetail}>
          {error instanceof Error ? error.message : String(error)}
        </Text>
      </View>
    );
  }

  return (
    <View style={[shell.safe, layout.faqsRootPad]}>
      <TextInput
        accessibilityLabel={t('screens.faqs.searchLabel')}
        placeholder={t('screens.faqs.searchPlaceholder')}
        placeholderTextColor={semantic.textMuted}
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={inputS.input}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={layout.chipsRow}
      >
        {(data ?? []).map(cat => (
          <CategoryChip
            key={cat.id}
            title={cat.title}
            active={cat.id === activeCategoryId}
            onPress={() => {
              setActiveCategoryId(cat.id);
            }}
          />
        ))}
      </ScrollView>
      <FlashList<FaqRow>
        data={rows}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        estimatedItemSize={flashListEstimatedItemSize.faq}
        ItemSeparatorComponent={ListSep}
        contentContainerStyle={layout.listPad}
        extraData={`${i18n.language}-${rows.length}`}
      />
    </View>
  );
};

export const FaqsScreen = React.memo(FaqsScreenComponent);
FaqsScreen.displayName = 'FaqsScreen';
