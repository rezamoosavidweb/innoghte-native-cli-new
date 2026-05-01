import type { DrawerScreenProps } from '@react-navigation/drawer';
import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

import { GiftGiveForm } from '@/domains/user/components/giveGift/GiftGiveForm';
import { useGiveGiftCourses } from '@/domains/user/hooks/useGiveGiftCourses';
import { useGiveGiftForm } from '@/domains/user/hooks/useGiveGiftForm';
import { useGiveGiftScroll } from '@/domains/user/hooks/useGiveGiftScroll';
import { useGiveGiftSubmit } from '@/domains/user/hooks/useGiveGiftSubmit';
import { isDotIr } from '@/shared/config/resolveIsDotIr';
import type { DrawerParamList } from '@/shared/contracts/navigationApp';
import {
  flashListContentGutters,
  useNavScreenShellStyles,
  useThemeColors,
} from '@/ui/theme';
import { useFormFieldStyles } from '@/ui/theme/formField.styles';

type Props = DrawerScreenProps<DrawerParamList, 'GiftSend'>;

export const GiveGiftScreen = React.memo(function GiveGiftScreen(
  _props: Props,
) {
  const theme = useTheme();
  const { colors } = theme;
  const uiColors = useThemeColors();
  const shell = useNavScreenShellStyles(colors);
  const formField = useFormFieldStyles(uiColors);

  const { control, handleSubmit, getValues, formState, mobileDefaults } =
    useGiveGiftForm();
  const { errors } = formState;

  const courses = useGiveGiftCourses();
  const scroll = useGiveGiftScroll();

  const submit = useGiveGiftSubmit({
    form: { getValues, handleSubmit, formState },
    isDotIr,
    requestScrollToMobile: scroll.requestScrollToMobile,
  });

  return (
    <KeyboardAvoidingView
      style={shell.safe}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        ref={scroll.scrollRef}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={flashListContentGutters.standard}
      >
        <GiftGiveForm
          theme={theme}
          onFormSectionLayout={scroll.onFormSectionLayout}
          onMobileBlockLayout={scroll.onMobileBlockLayout}
          control={control}
          errors={errors}
          formField={formField}
          mobileDefaults={mobileDefaults}
          coursesPending={courses.coursesQuery.isPending}
          albumsPending={courses.albumsQuery.isPending}
          courseOptions={courses.courseOptions}
          albumOptions={courses.albumOptions}
          purchasedError={submit.purchasedError}
          setPurchasedError={submit.setPurchasedError}
          interactionBusy={submit.interactionBusy}
          handleSubmitPress={submit.handleSubmitPress}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
});
GiveGiftScreen.displayName = 'GiveGiftScreen';
