import { createApp } from 'vue'

import '@/registerServiceWorker'

import App from '@/App.vue'

// app components & services
import Norma from '@/app/index.js'

// some styles
import '@/assets/scss/main.scss'

createApp(App)
  .use(Norma)
  .mount('#app')