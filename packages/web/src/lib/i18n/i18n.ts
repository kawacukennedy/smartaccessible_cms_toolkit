import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from '../../../public/locales/en/common.json';
import fr from '../../../public/locales/fr/common.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        common: en,
      },
      fr: {
        common: fr,
      },
    },
    ns: ['common'],
    defaultNS: 'common',
  });

export default i18n;
