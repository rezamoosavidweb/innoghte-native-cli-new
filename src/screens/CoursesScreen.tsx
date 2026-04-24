import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '@react-navigation/native';
import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CourseListCard } from '../features/courses/components/CourseListCard';
import type { Course } from '../features/courses/data/seedCourses';
import { useCoursesQuery } from '../features/courses/hooks/useCoursesQuery';
import type { TabParamList } from '../navigation/types';
import {
  flashListContentGutters,
  flashListRowSeparators,
  useNavScreenShellStyles,
} from '../theme/navScreenLayout';

type Props = BottomTabScreenProps<TabParamList, 'Courses'>;

/**
 * Approximate average row height for a course card (FlashList uses this to
 * size the initial window; see https://shopify.github.io/flash-list/docs/estimated-item-size).
 * Prefer slightly smaller than true average when unsure (FlashList guidance).
 */
const ESTIMATED_COURSE_ITEM_SIZE = 300;

const Separator = React.memo(function CoursesListSeparator() {
  return <View style={flashListRowSeparators.h12} />;
});
Separator.displayName = 'CoursesListSeparator';

const renderCourseItem: ListRenderItem<Course> = ({ item }) => (
  <CourseListCard course={item} />
);

function keyExtractor(item: Course): string {
  return String(item.id);
}

const CoursesScreenComponent = (_props: Props) => {
  const { data, isPending, isError, error } = useCoursesQuery();
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const shell = useNavScreenShellStyles(colors);

  if (isPending) {
    return (
      <View style={shell.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={shell.loadingText}>{t('screens.courses.loading')}</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={shell.centered}>
        <Text style={shell.errorText}>{t('screens.courses.error')}</Text>
        <Text style={shell.errorDetail}>
          {error instanceof Error ? error.message : String(error)}
        </Text>
      </View>
    );
  }

  const listData = data ?? [];

  return (
    <SafeAreaView style={shell.safe} edges={['left', 'right', 'bottom']}>
      <FlashList<Course>
        data={listData}
        renderItem={renderCourseItem}
        keyExtractor={keyExtractor}
        estimatedItemSize={ESTIMATED_COURSE_ITEM_SIZE}
        ItemSeparatorComponent={Separator}
        contentContainerStyle={flashListContentGutters.standard}
        showsVerticalScrollIndicator={false}
        extraData={i18n.language}
      />
    </SafeAreaView>
  );
};

export const CoursesScreen = React.memo(CoursesScreenComponent);
CoursesScreen.displayName = 'CoursesScreen';
