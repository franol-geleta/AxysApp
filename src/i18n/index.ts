import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en';
import ja from './ja';

const resources = {
  en: { translation: en },
  ja: { translation: ja },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v4',
});

export default i18n;
