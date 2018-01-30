import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/app/main'
import Form from '@/app/form'

Vue.use(Router)

export default new Router({
	routes: [
		{
			path: '/',
			name: 'main',
			component: Main
		},
		{
			path: '/event',
			name: 'event.create',
			props: true,
			component: Form
		},
		{
			path: '/event/:id(\\d+)',
			name: 'event.edit',
			component: Form
		}
	]
})