import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { i18nextPlugin } from 'translation-check'

import translationEN from './en.json'
import translationES from './es.json'

i18n.use(initReactI18next)

if (process?.env?.REACT_APP_DEBUGTRANSLATIONS === 1 || process?.env?.REACT_APP_DEBUGTRANSLATIONS === '1') {
  i18n.use(i18nextPlugin)
}

i18n
  .use(i18nextPlugin)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    saveMissing: true, // send not translated keys to endpoint
    saveMissingTo: "current",
    fallbackLng: false,
    debug:true,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    // the translations
    resources: {
      en: {
        translation: translationEN
      },
      es: {
        translation: translationES
      }
    }
  });
export default i18n;

