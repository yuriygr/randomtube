export default {
  namespaced: true,
  state () {
    return {
      data: [],
      loading: false,
      error: false
    }
  },
  mutations: {
    'SET_DATA'(state, payload) {
      state.data = payload
    },
    'SET_LOADING'(state, payload) {
      state.loading = payload
    },
    'SET_ERROR'(state, payload) {
      state.error = payload
    }
  },
  actions: {
    init({ dispatch }) {
      dispatch('fetch')
    },
    fetch({ commit }, type = 'Video') {
      commit('SET_ERROR', false)
      commit('SET_LOADING', true)

      return this.$api.get('entries/boards', { type })
      .then(data => {
        commit('SET_DATA', data)
      })
      .catch(error => {
        commit('SET_ERROR', error)
      }) 
      .then(_ => commit('SET_LOADING', false))
    }
  },
  getters: {
    
  }
}