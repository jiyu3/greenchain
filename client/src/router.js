import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		{
			path: '/',
			name: 'Home',
			// lazy load
			component: () => import(/* webpackChunkName: "about" */ './components/Home/index.vue'),
			meta: { skipAuth: true }
		},
		{
			path: '/block/:id',
			name: 'Block',
			// lazy load
			component: () => import(/* webpackChunkName: "about" */ './components/Block/index.vue')
		},
		{
			path: '/sponsor',
			name: 'Sponsor',
			// lazy load
			component: () => import(/* webpackChunkName: "about" */ './components/Sponsor/index.vue')
		}
	]
})
