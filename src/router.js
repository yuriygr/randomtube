import Vue from 'vue'
import Router from 'vue-router'

import Player from '@/components/Player'

Vue.use(Router)

const routes = [
	{ path: '/', name: 'home', component: Player, children: [
		{ path: ':board/', component: Player, children: [
			{ path: '', redirect: { name: 'player-board' } },
			{ path: '/', name: 'player-board', component: Player },
			{ path: 'res/:thread.html', name: 'player-board-thread', component: Player }
		] },
	]},
	{ path: '*', redirect: 'home' }
]

const router = new Router({
	routes,
	mode: 'history',
	pathToRegexOptions: { strict: true },
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