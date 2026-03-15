export default {
  namespaced: true,
  state: () => ({
    data: [],
    total_items: 0,

    filters: {  },

    controller: false,
    loading: false,
    error: null
  }),
  mutations: {
    SET_DATA: (state, payload) => state.data = payload,
    ADD_DATA: (state, payload) => state.data.push(...payload),
    SET_TOTAL_ITEMS: (state, payload) => state.total_items = payload,
    CLEAR_DATA: (state) => {
      state.data = []
      state.total_items = 0
    },
    SET_FILTERS: (state, payload) => state.filters = { ...payload },
    CLEAR_FILTERS: (state) => state.filters = { },
    SET_LOADING: (state, payload) => state.loading = payload,
    SET_ERROR: (state, payload) => state.error = payload,
    ADD_CONTROLLER: (state, payload) => state.controller = payload,
    REMOVE_CONTROLLER: (state) => state.controller = false
  },
  actions: {
    fetch({ state, commit }, initial = true) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
  
      const controller = new AbortController()
      commit('ADD_CONTROLLER', controller)

      return this.$api.get('entries/likes', state.filters, controller.signal)
      .then(result => {
        commit(initial ? 'SET_DATA' : 'ADD_DATA', result.items)
        commit('SET_TOTAL_ITEMS', result.total_items)
      })
      .catch(error => {
        commit('SET_ERROR', error)
      })
      .then(_ => {
        commit('REMOVE_CONTROLLER')
        commit('SET_LOADING', false)
      })
    },

    async refresh({ dispatch, commit }) {
      await commit('SET_FILTERS', { offset: 0 })
      dispatch('fetch', true)
    },

    async more({ state, dispatch, commit }) {
      await commit('SET_FILTERS', { offset: state.data.length })
      dispatch('fetch', false)
    },

    clear({ commit, state }) {
      if (state.controller)
        state.controller.abort()
      commit('REMOVE_CONTROLLER')
      commit('CLEAR_DATA')
      commit('CLEAR_FILTERS')
    },

    setFilters({ commit }, payload) {
      commit('SET_FILTERS', payload)
    }
  },
  getters: {
    hasMoreItems: state => state.data.length < state.total_items
  }
}