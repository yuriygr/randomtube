import { createRouter, createWebHistory } from 'vue-router'

import About from '@/views/About'
import Search from '@/views/Search'

import PlayerRoutes from '@/app/components/router/modules/player'
import HelpRoutes from '@/app/components/router/modules/help'

const routes = [
	...PlayerRoutes,
	...HelpRoutes,

	{ path: '/search', name: 'search', component: Search },
	{ path: '/about', name: 'about', component: About },

	{ path: '/:pathMatch(.*)*', redirect: { name: 'home' } }
]

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

export default router
