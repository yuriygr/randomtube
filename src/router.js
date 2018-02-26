import Vue from 'vue'
import VueRouter from 'vue-router'

import Player from './Player'

Vue.use(VueRouter)

const routes = [
	{ path: '/', component: Player, children: [
		{ path: ':board',  component: Player, children: [
			{ path: '', redirect: { name: 'player-board' } },
			{ path: '/', name: 'player-board', component: Player },
			{ path: '/res/:thread', name: 'player-board-thread', component: Player }
		] },
	]},
	{ path: '*', redirect: 'player-board' }
]

const router = new VueRouter({
	routes,
	mode: 'history',
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