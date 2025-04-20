import { createI18n } from 'vue-i18n'
import en from './en'
import vi from './vi'

const language = localStorage.getItem('language') || 'en';

const i18n = createI18n({
  legacy: false,
  locale: language,
  fallbackLocale: 'en',
  messages: {
    en,
    vi,
  }
})

export default i18n