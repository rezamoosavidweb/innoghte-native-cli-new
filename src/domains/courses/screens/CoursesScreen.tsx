import { useTheme } from '@react-navigation/native';
import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CourseListCard } from '@/domains/courses/ui/cards/CourseListCard';
import type { Course } from '@/domains/courses/model/entities';
import { useCourses } from '@/domains/courses/hooks/useCourses';
import {
  flashListContentGutters,
  flashListEstimatedItemSize,
  flashListRowSeparators,
  useNavScreenShellStyles,
} from '@/ui/theme';

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

const CoursesScreenComponent = () => {
  const { data, isPending, isError, error } = useCourses();
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
        estimatedItemSize={flashListEstimatedItemSize.course}
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
