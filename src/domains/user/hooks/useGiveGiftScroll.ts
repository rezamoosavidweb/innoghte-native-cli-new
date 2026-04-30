import * as React from 'react';
import {
  type LayoutChangeEvent,
  ScrollView,
} from 'react-native';

export function useGiveGiftScroll() {
  const scrollRef = React.useRef<ScrollView | null>(null);
  const formContainerY = React.useRef(0);
  const mobileFieldY = React.useRef(0);

  const [shouldScrollToMobile, setShouldScrollToMobile] = React.useState(false);

  const onFormSectionLayout = React.useCallback((e: LayoutChangeEvent) => {
    formContainerY.current = e.nativeEvent.layout.y;
  }, []);

  const onMobileBlockLayout = React.useCallback((e: LayoutChangeEvent) => {
    mobileFieldY.current = e.nativeEvent.layout.y;
  }, []);

  React.useEffect(() => {
    if (!shouldScrollToMobile) return;
    const y = Math.max(
      formContainerY.current + mobileFieldY.current - 24,
      0,
    );
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ y, animated: true });
    });
    setShouldScrollToMobile(false);
  }, [shouldScrollToMobile]);

  const requestScrollToMobile = React.useCallback(() => {
    setShouldScrollToMobile(true);
  }, []);

  return {
    scrollRef,
    onFormSectionLayout,
    onMobileBlockLayout,
    requestScrollToMobile,
  };
}
