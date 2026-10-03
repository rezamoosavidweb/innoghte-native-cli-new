import * as React from 'react';
import { Modal } from 'react-native';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';
import { I18nextProvider } from 'react-i18next';

import { WelcomeGuide } from '@/domains/onboarding';
import { WELCOME_GUIDE_STORAGE_KEY } from '@/domains/onboarding/model/welcomeGuide';
import i18n, { initI18n } from '@/shared/infra/i18n';
import { StorageService } from '@/shared/infra/storage/storage.service';
import { TypographyProvider } from '@/shared/ui/TypographyContext';
import { AppThemeProvider } from '@/ui/theme';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 24, bottom: 24, left: 0, right: 0 }),
}));

jest.mock('react-native-reanimated-carousel', () => {
  const ReactRuntime = require('react');
  const { View } = require('react-native');
  return ReactRuntime.forwardRef((props: any, ref: any) => {
    const [index, setIndex] = ReactRuntime.useState(props.defaultIndex);
    ReactRuntime.useImperativeHandle(ref, () => ({
      scrollTo: ({ index: next }: { index: number }) => {
        setIndex(next);
        props.onSnapToItem(next);
      },
    }));
    return (
      <View testID="test-carousel" onSnapToItem={props.onSnapToItem}>
        {props.renderItem({ item: props.data[index], index })}
      </View>
    );
  });
});

const values = new Map<string, string>();
let renderer: ReactTestRenderer;

function tree(ready = true) {
  return (
    <I18nextProvider i18n={i18n}>
      <TypographyProvider>
        <AppThemeProvider colorScheme="dark">
          <WelcomeGuide ready={ready} />
        </AppThemeProvider>
      </TypographyProvider>
    </I18nextProvider>
  );
}

function press(testID: string) {
  act(() => renderer.root.findAllByProps({ testID })[0].props.onPress());
}

function measurePager() {
  const viewport = renderer.root.findAll(node => !!node.props.onLayout)[0];
  act(() =>
    viewport.props.onLayout({
      nativeEvent: { layout: { width: 360, height: 480 } },
    }),
  );
}

function mount(ready = true) {
  act(() => {
    renderer = create(tree(ready));
  });
  if (ready && renderer.root.findAllByType(Modal).length) measurePager();
}

beforeEach(async () => {
  values.clear();
  jest
    .spyOn(StorageService, 'getString')
    .mockImplementation(key => values.get(key) ?? null);
  jest.spyOn(StorageService, 'setString').mockImplementation((key, value) => {
    values.set(key, value);
  });
  await initI18n('fa');
});

afterEach(() => {
  act(() => renderer?.unmount());
  jest.restoreAllMocks();
});

test('waits for bootstrap and does not mark an interrupted tour as completed', () => {
  mount(false);
  expect(renderer.root.findAllByType(Modal)).toHaveLength(0);
  act(() => renderer.update(tree(true)));
  expect(renderer.root.findAllByType(Modal)).toHaveLength(1);
  expect(values.has(WELCOME_GUIDE_STORAGE_KEY)).toBe(false);
  act(() => renderer.unmount());
  mount();
  expect(
    renderer.root.findAllByProps({ testID: 'welcome-guide-slide-welcome' })
      .length,
  ).toBeGreaterThan(0);
});

test('visits all five Persian slides, goes back, then completes and stays dismissed on remount', () => {
  mount();
  expect(
    renderer.root.findAllByProps({ testID: 'welcome-guide-previous' }),
  ).toHaveLength(0);
  for (const slide of ['courses', 'albums', 'live', 'profile']) {
    press('welcome-guide-next');
    expect(
      renderer.root.findAllByProps({ testID: `welcome-guide-slide-${slide}` })
        .length,
    ).toBeGreaterThan(0);
  }
  expect(values.has(WELCOME_GUIDE_STORAGE_KEY)).toBe(false);
  press('welcome-guide-previous');
  expect(
    renderer.root.findAllByProps({ testID: 'welcome-guide-slide-live' }).length,
  ).toBeGreaterThan(0);
  press('welcome-guide-next');
  press('welcome-guide-next');
  expect(renderer.root.findAllByType(Modal)).toHaveLength(0);
  expect(values.get(WELCOME_GUIDE_STORAGE_KEY)).toBe('1');
  act(() => renderer.unmount());
  mount();
  expect(renderer.root.findAllByType(Modal)).toHaveLength(0);
});

test.each(['skip', 'android-back'])('%s dismisses persistently', action => {
  mount();
  if (action === 'skip') press('welcome-guide-skip');
  else act(() => renderer.root.findByType(Modal).props.onRequestClose());
  expect(values.get(WELCOME_GUIDE_STORAGE_KEY)).toBe('1');
  expect(renderer.root.findAllByType(Modal)).toHaveLength(0);
  act(() => renderer.unmount());
  mount();
  expect(renderer.root.findAllByType(Modal)).toHaveLength(0);
});

test('a Persian swipe updates the selected dot and Continue uses the new page', () => {
  mount();
  act(() =>
    renderer.root
      .findAllByProps({ testID: 'test-carousel' })[0]
      .props.onSnapToItem(3),
  );
  expect(
    renderer.root.findAllByProps({ testID: 'welcome-guide-dot-1' })[0].props
      .accessibilityState.selected,
  ).toBe(true);
  press('welcome-guide-next');
  expect(
    renderer.root.findAllByProps({ testID: 'welcome-guide-slide-albums' })
      .length,
  ).toBeGreaterThan(0);
  press('welcome-guide-dot-0');
  expect(
    renderer.root.findAllByProps({ testID: 'welcome-guide-slide-welcome' })
      .length,
  ).toBeGreaterThan(0);
});

test('English navigation preserves the same logical order with LTR offsets', async () => {
  await initI18n('en');
  mount();
  press('welcome-guide-next');
  expect(
    renderer.root.findAllByProps({ testID: 'welcome-guide-slide-courses' })
      .length,
  ).toBeGreaterThan(0);
  press('welcome-guide-dot-4');
  expect(
    renderer.root.findAllByProps({ testID: 'welcome-guide-slide-profile' })
      .length,
  ).toBeGreaterThan(0);
  press('welcome-guide-previous');
  expect(
    renderer.root.findAllByProps({ testID: 'welcome-guide-slide-live' }).length,
  ).toBeGreaterThan(0);
});
