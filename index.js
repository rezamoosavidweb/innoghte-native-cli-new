/**
 * @format
 */

import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';

async function bootstrap() {
  try {
    const { readAppLanguageFromStorage } = require('./src/bootstrap/readAppLanguage');
    const { applyRtlForLanguage } = require('./src/utils/i18n-rtl');
    const { initI18n } = require('./src/translations');

    const lang = readAppLanguageFromStorage();
    applyRtlForLanguage(lang);
    await initI18n(lang);
  } catch (e) {
    console.warn('[bootstrap] Language init failed, using defaults.', e);
    const { applyRtlForLanguage } = require('./src/utils/i18n-rtl');
    const { initI18n } = require('./src/translations');
    applyRtlForLanguage('fa');
    await initI18n('fa');
  }

  const App = require('./App').default;
  AppRegistry.registerComponent(appName, () => App);
}

bootstrap();
