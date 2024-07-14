import Help from '@/views/Help'

export default [
  {
    path: '/help',
    name: 'helps',
    component: Help,
    meta: { section: 'help' },
    redirect: { name: 'help-menu' },
    children: [
      { path: '', name: 'help-menu', component: Help },
      { path: 'all-questions', name: 'help-all-questions', component: Help },
      { path: 'my-questions', name: 'help-my-questions', component: Help },
      { path: 'add-question', name: 'help-add-question', component: Help },
      { path: ':uuid', name: 'help-page', component: Help },
	    { path: ':pathMatch(.*)*', redirect: { name: 'help-menu' } }
	] }
]