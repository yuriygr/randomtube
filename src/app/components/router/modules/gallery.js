import Gallery from '@/views/Gallery'

export default [
	{ path: '/', name: 'home', component: Gallery },
	{ path: '/:board/', name: 'player-board', component: Gallery },
	{ path: '/:board/res/:thread.html', name: 'player-board-thread', component: Gallery },
	{ path: '/:pathMatch(.*)*', redirect: { name: 'home' } }
]