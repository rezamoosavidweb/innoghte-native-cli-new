import {
  BottomSheetBackdrop,
  BottomSheetModal,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useBottomSheet } from '@/shared/ui/bottomSheet/useBottomSheet';
import { radius, useThemeColors } from '@/ui/theme';
import { hexAlpha } from '@/ui/theme/utils/colorUtils';

export type BottomSheetProps<T> = {
  controller: ReturnType<typeof useBottomSheet<T>>;
  renderContent: (data: T) => React.ReactNode;
  snapPoints?: (string | number)[];
};

const defaultSnapPoints: (string | number)[] = ['92%'];

export function BottomSheet<T>({
  controller,
  renderContent,
  snapPoints = defaultSnapPoints,
}: BottomSheetProps<T>) {
  const colors = useThemeColors();
  const chrome = React.useMemo(
    () =>
      StyleSheet.create({
        sheetBg: {
          borderTopLeftRadius: radius.lg,
          borderTopRightRadius: radius.lg,
          backgroundColor: colors.surface,
        },
        handle: {
          width: 40,
          height: 4,
          borderRadius: 2,
          backgroundColor: hexAlpha(colors.text, 0.2),
        },
      }),
    [colors.surface, colors.text],
  );

  const { sheetRef, data, onDismiss } = controller;
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 8);

  const renderBackdrop = React.useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.45}
        pressBehavior="close"
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={sheetRef}
      name="BottomSheet"
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      enablePanDownToClose
      android_keyboardInputMode="adjustResize"
      bottomInset={bottomInset}
      onDismiss={onDismiss}
      backdropComponent={renderBackdrop}
      backgroundStyle={chrome.sheetBg}
      handleIndicatorStyle={chrome.handle}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      animationConfigs={{
        damping: 80,
        stiffness: 300,
        mass: 1,
      }}
    >
      {data ? renderContent(data) : null}
    </BottomSheetModal>
  );
}
