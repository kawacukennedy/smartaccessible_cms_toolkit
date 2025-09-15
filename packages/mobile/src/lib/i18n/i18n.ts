import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import en from '../../assets/locales/en/common.json';
import fr from '../../assets/locales/fr/common.json';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    compatibilityJSON: 'v3',
    resources: {
      en: {
        common: en,
      },
      fr: {
        common: fr,
      },
    },
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    ns: ['common'],
    defaultNS: 'common',
  });

export default i18n;
