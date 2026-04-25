/**
 * @format
 */

import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';

if (__DEV__) {
  void import('./reactotron.config');
}

async function bootstrap() {
  try {
    const { readAppLanguageFromStorage } = require('./src/shared/bootstrap/readAppLanguage');
    const { applyRtlForLanguage } = require('./src/shared/utils/i18n-rtl');
    const { initI18n } = require('./src/shared/translations');

    const lang = readAppLanguageFromStorage();
    applyRtlForLanguage(lang);
    await initI18n(lang);
  } catch (e) {
    console.warn('[bootstrap] Language init failed, using defaults.', e);
    const { applyRtlForLanguage } = require('./src/shared/utils/i18n-rtl');
    const { initI18n } = require('./src/shared/translations');
    applyRtlForLanguage('fa');
    await initI18n('fa');
  }

  const App = require('./App').default;
  AppRegistry.registerComponent(appName, () => App);
}

bootstrap();
