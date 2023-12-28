/**
 * Я решил перенести все управление плейлистом в vuex потому что выглядит сексуально
 * 
 * @version 1.0.0
 */
export default {
  namespaced: true,
  state() {
    return {
      sources: [],
      reactions: [],
      filters: [],

      currentPage: 1,
      currentIndex: 0,

      zen: false,
      loading: false,
      error: false
    }
  },
  mutations: {
    'SET_SOURCES'(state, payload) {
      state.sources = [ ...state.sources, ...payload.items ]
    },
    'SPLICE_SOURCE'(state, index) {
      state.sources.splice(index, 1)
    },
    'RESET_SOURCES'(state) {
      state.sources = []
    },

    'SET_CURRENT_INDEX'(state, payload) {
      state.currentIndex = payload
    },
    'SET_CURRENT_PAGE'(state, payload) {
      state.currentPage = payload
    },

    'SET_LOADING'(state, payload) {
      state.loading = payload
    },
    'SET_ERROR'(state, payload) {
      state.error = payload
    },

    'SET_ZEN'(state, payload) {
      state.zen = payload
    }
  },
  actions: {
    fetch({ commit }, payload = {}) {
      commit('SET_ERROR', false)
      commit('SET_LOADING', true)

      this.$api.get(`entries/${payload.type}`, payload.params)
      .then(result => {
        commit('SET_SOURCES', result)
      })
      .catch(error => {
        commit('SET_ERROR', error)
      })
      .then(_ => commit('SET_LOADING', false))
    },
    report({ getters }, payload) {
      return this.$api.post('entries/report', {
        id: getters.currentFile.id,
        ...payload
      })
      .then(result => {
        return result
      })
      .catch(error => {
        return error
      })
    },
    reaction({ state, getters }, payload) {
      return this.$api.post('entries/reaction', {
        id: getters.currentFile.id,
        type: getters.currentFile.reactions.current == ""
          ? 'add'
          : (getters.currentFile.reactions.current == payload.action ? 'remove' : 'add'),
        ...payload
      })
      .then(result => {
        state.sources[state.currentIndex].reactions =  Object.assign({}, result.payload)
        return result.status
      })
      .catch(error => {
        return error
      })
    },


    moveBackward({ state, getters, commit }) {
      if (getters.canPlayPrev)
        commit('SET_CURRENT_INDEX', state.currentIndex - 1)
    },
    moveForward({ state, getters, commit }) {
      if (getters.canPlayNext)
        commit('SET_CURRENT_INDEX', state.currentIndex + 1)
    },
    changeCurrentIndex({ commit }, payload) {
      commit('SET_CURRENT_INDEX', payload)
    },

    toggleZen({ commit, state }) {
      commit('SET_ZEN', !state.zen)
    }
  },
  getters: {
    currentFile(state) {
      return state.sources[state.currentIndex] || false
    },
    currentFileReactions(state, getters) {
      if (!getters.currentFile) return false
      return Object.assign({
        current: "",
        items: []
      }, getters.currentFile.reactions)
    },
    nextFile(state) {
      return state.sources[state.currentIndex + 1] || false
    },
    canPlayPrev(state) {
      return !(state.currentIndex == 0)
    },
    canPlayNext(state) {
      return !(state.currentIndex >= state.sources.length - 1)
    },
    emptyWithLoading(state) {
      return state.sources.length == 0 && state.loading
    },
    emptyWithError(state) {
      return state.sources.length == 0 && state.error
    }
  }
}