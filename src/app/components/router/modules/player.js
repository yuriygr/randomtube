import Player from '@/views/Player'

export default [
	{ path: '/', name: 'home', component: Player },
	{ path: '/:board/', name: 'player-board', component: Player },
	{ path: '/:board/res/:thread.html', name: 'player-board-thread', component: Player },
	{ path: '/:pathMatch(.*)*', redirect: { name: 'home' } }
]