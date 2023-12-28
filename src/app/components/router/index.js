import { createRouter, createWebHistory } from 'vue-router'

import Help from '@/views/Help'
import Search from '@/views/Search'

import PlayerRoutes from '@/app/components/router/modules/player'

const routes = [
	...PlayerRoutes,

	{ path: '/search', name: 'search', component: Search },

	{ path: '/help', name: 'help', component: Help, children: [

	] },

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
