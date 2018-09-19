import Vue from 'vue'
import Meta from 'vue-meta'

import App from '@/components/App'
import filters from '@/filters'
import router from '@/router'

// some styles
import 'reset-css/reset.css'
import 'assets/style.css'

// some metakeys
Vue.use(Meta);

// register global utility filters
Object.keys(filters).forEach((key) =>
	Vue.filter(key, filters[key])
);

// create application
const app = new Vue({
	router,
	...App
});
app.$mount('#app');
