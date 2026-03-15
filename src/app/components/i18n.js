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

const customRule = (choice, choicesLength, orgRule) => {
  if (choice === 0) {
    return 0
  }

  const teen = choice > 10 && choice < 20
  const endsWithOne = choice % 10 === 1
  if (!teen && endsWithOne) {
    return 1
  }
  if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
    return 2
  }

  return choicesLength < 4 ? 2 : 3
}

const i18n = createI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || 'ru',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'ru',
  messages: loadLocaleMessages(),
  pluralizationRules: {
    ru: customRule
  }
})

export default i18n