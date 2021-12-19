import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import Backend from 'i18next-http-backend' // нужно установить: npm install i18next-http-backend
import LanguageDetector from 'i18next-browser-languagedetector' // и это тоже npm install i18next-browser-languagedetector

i18n
  // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
  // learn more: https://github.com/i18next/i18next-http-backend
  .use(Backend) // Это вроде бы lazy loading
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: 'en', // use en if detected lng is not available
    //debug: true,
    //whitelist: availableLanguages,
    //keySeparator: false, // we do not use keys in form messages.welcome
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default. React already safes from xss
    }
  })


export default i18n
