import Player from '@/views/Player'
import Gallery from '@/views/Gallery'

export default [
	{ path: '/', name: 'home', component: Player, children: [
		{ path: '/:board/', name: 'player-board', children: [
			{ path: '', redirect: { name: 'player-board' } },
			{ path: 'res/:thread.html', name: 'player-board-thread' }
		] },
	] }
]