import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import allEN from './en/all.json';

// the translations
const resources = {
  en: {
    all: allEN,
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    ns: ['all'],
    resources,
    lng: 'en',
    fallbackLng: 'en', // 可針對不同語系給予預設語系
    keySeparator: false, // we do not use keys in form messages.welcome
    interpolation: {
      escapeValue: false,
    },
    react: {
      wait: true,
    },
  });

export default i18n;
