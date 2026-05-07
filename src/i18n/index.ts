import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from './locales/en';
import { zh } from './locales/zh';

const LANGUAGE_KEY = 'bankx_language';

const savedLanguage = localStorage.getItem(LANGUAGE_KEY) || 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    zh: { translation: zh },
  },
  lng: savedLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,    // React already escapes
  },
});

/**
 * Change app language and persist to localStorage.
 */
export function changeLanguage(lang: 'en' | 'zh') {
  i18n.changeLanguage(lang);
  localStorage.setItem(LANGUAGE_KEY, lang);
}

export default i18n;