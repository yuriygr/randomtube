import { createStore } from 'vuex'

// Load modules from folder
const modules = {}
const requireModule = require.context('./modules', false,  /\.js$/)
requireModule.keys().forEach(filename => {
  const moduleName = filename.replace(/(\.\/|\.js)/g, '').replace(/^\w/, c => c.toLowerCase())
  modules[moduleName] = requireModule(filename).default || requireModule(filename)
})

// Create store
const store = createStore({
  modules,
  state () {
    return {
      
    }
  },
  mutations: {

  },
  actions: {
    initApplication({ dispatch }) {
      Object.keys(modules).forEach(moduleName => {
        let action = `${moduleName}/init`
        this._actions[action] && dispatch(action)
      })
    }
  },
  getters: {
    
  }
})

/** Подписка на изменения */
store.subscribe((mutation, state) => {
  mutation.type == "app/SET_THEME" && localStorage.setItem('theme', mutation.payload)
  mutation.type == "app/TOGGLE_THEME" && localStorage.setItem('theme', state.app.theme)
})

export default store
