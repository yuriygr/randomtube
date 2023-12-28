import { createI18n } from 'vue-i18n'

const loadLocaleMessages = () => {
  const locales = require.context(
    // The relative path of the locales folder
    '@/app/locales',
    // Whether or not to look in subfolders
    true,
    // The regular expression used to match base locale filenames
    /[A-Za-z0-9-_,\s]+\.json$/i
  )
  
  const messages = {}

  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key)
    }
  })

  return messages
}

const i18n = createI18n({
  locale: window.navigator.language || process.env.VUE_APP_I18N_LOCALE || 'ru',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'ru',
  messages: loadLocaleMessages()
})

export default i18n