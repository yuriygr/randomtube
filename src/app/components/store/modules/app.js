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
      pwa:      process.env.VUE_APP_PWA_ENABLED,
      mode:     process.env.VUE_APP_MODE,

      loading: {
        global: false,
        trailing: false
      },
  
      error: {}
    }
  },
  mutations: {
    'SET_THEME'(state, payload) {
      state.theme = payload
    },
    'SET_PWA'(state, payload) {
      state.pwa = payload
    },
    'SET_LOADING'(state, payload) {
      Object.keys(payload).forEach(key => {
        state.loading[key] = payload[key]
      })
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
      commit('SET_PWA', localStorage.getItem('pwa') || state.pwa)
    },
    toggleTheme({ commit, state }) {
      commit('SET_THEME', (state.theme == 'white') ? 'black' : 'white')
    }
  },
  getters: {
    themeStatusBar(state) {
      let colors = []
      colors['black'] = '#0f0f0f'
      colors['white'] = '#fcfcfc'
      return colors[state.theme]
    },
    getLoading() {

    },
    getError() {

    }
  }
}