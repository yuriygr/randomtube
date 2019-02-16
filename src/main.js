import Vue from 'vue'
import VueAnalytics from 'vue-analytics'

import App from '@/components/App'
import filters from '@/filters'
import router from '@/router'

// some styles
import 'reset-css/reset.css'
import 'assets/style.css'

// register global utility filters
Object.keys(filters).forEach(key =>
	Vue.filter(key, filters[key])
)

Vue.use(VueAnalytics, {
	id: 'UA-56787403-6',
	router
})

// create application
const app = new Vue({
	router,
	...App
})
app.$mount('#app')
