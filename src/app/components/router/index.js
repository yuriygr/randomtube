import { createRouter, createWebHistory } from 'vue-router'

import About from '@/views/About'
import Search from '@/views/Search'
import Likes from '@/views/Likes'

import GalleryRoutes from '@/app/components/router/modules/gallery'
import PlayerRoutes from '@/app/components/router/modules/player'
import HelpRoutes from '@/app/components/router/modules/help'

const routes = [
	...(process.env.VUE_APP_MODE == 'Video'
		? PlayerRoutes
		: GalleryRoutes),

	...HelpRoutes,

	{ path: '/likes', name: 'likes', component: Likes },
	{ path: '/search', name: 'search', component: Search },
	{ path: '/about', name: 'about', component: About },

	{ path: '/:pathMatch(.*)*', redirect: { name: 'home' } }
]

// Create router
const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
	pathToRegexpOptions: { strict: true },
	scrollBehavior (to, from, savedPosition) {
		if (savedPosition)
			return savedPosition
		else if (to.hash)
			return { selector: to.hash }
		else
			return { x: 0, y: 0 }
	}
})

export default  {
	install(app, options) {
		router.install(app)

		router.beforeEach((to, from, next) => {
			app.config.globalProperties.$modals.close()
			app.config.globalProperties.$popover.close()
			app.config.globalProperties.$alerts.close()
		
			next()
		})
	}
}