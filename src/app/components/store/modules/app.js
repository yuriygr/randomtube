/**
 * Основной компонент приложения, который я планирую реиспользовать в других пет-проектах.
 * Данные по умолчанию берутся из файла окружения
 * 
 * @version 1.0.1
 */
export default {
  namespaced: true,
  state() {
    return {
      title:    process.env.VUE_APP_TITLE,
      basePath: process.env.VUE_APP_BASE_URL,
      theme:    process.env.VUE_APP_DEFAULT_THEME,
      locale:   process.env.VUE_APP_I18N_LOCALE,
      version:  process.env.PACKAGE_VERSION,
      mode:     process.env.VUE_APP_MODE,

      loading: false,
      error: {}
    }
  },
  mutations: {
    'SET_THEME'(state, payload) {
      state.theme = payload
    },
    'SET_LOCALE'(state, payload) {
      state.locale = payload
    }, 
    'SET_LOADING'(state, payload) {
      state.loading = payload
    },
    'SET_ERROR'(state, payload) {
      Object.keys(payload).forEach(key => {
        state.error[key] = payload[key]
      })
    },
    'CLEAN_ERRORS'(state) {
      state.error = {}
    }
  },
  actions: {
    init({ commit, state }) {
      commit('SET_THEME', localStorage.getItem('theme') || state.theme)
      commit('SET_LOCALE', localStorage.getItem('locale') || state.locale)
    },
    toggleTheme({ commit, state }) {
      commit('SET_THEME', (state.theme == 'white') ? 'black' : 'white')
    }
  },
  getters: {
    themeStatusBar(state) {
      let colors = []
      colors['black'] = '#0f0f0f'
      colors['white'] = '#ffffff'
      return colors[state.theme]
    },
    getLoading() {

    },
    getError() {

    }
  }
}