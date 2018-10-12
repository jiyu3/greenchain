/* eslint-disable */
process.title = "gc-client"

import Vue from 'vue'
import App from './App.vue'
import i18n from './i18n'
import router from './router'
import store from './store'

import axios from 'axios'
import VueAxios from 'vue-axios'
axios.defaults.timeout = 100000;
Vue.use(VueAxios, axios)

import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.min.css'
Vue.use(Loading)

import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue);
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import Toasted from 'vue-toasted';
Vue.use(Toasted)

import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

Vue.config.productionTip = false

Vue.mixin({
	methods: {
		rpc(table, method, params = null, loading_overlay = false) {
			let url = this.$store.getters.api_url + table + "/" + method
			let data = {
				jsonrpc: "2.0",
				method: "login",
				params: params
			}
			let error_count = 0
			let interval = 100

			if (loading_overlay) {
				this.$store.state.loader = this.$loading.show()
			}
			return new Promise((resolve, reject) => {
				let loop = setInterval(() => {
					if (params == null || params.token !== null) {
						clearInterval(loop)

						this.axios.post(
							url, data
						).then(r => {
							let result = JSON.parse(r.data).result
							resolve(result)
						}).catch(e => {
							reject(e)
						}).finally(r => {
							if (this.$store.state.loader != null) {
								this.$store.state.loader.hide()
							}
						})
					} else {
						if (++error_count >= (3000 / interval)) {
							clearInterval(loop)
							this.$router.push("/")
						}
						params.token = this.$store.state.token
					}
				}, interval)
			})
		},
		overlay_show() {
			this.$store.state.loader = this.$loading.show()
		},
		overlay_hide() {
			this.$store.state.loader.hide()
		}
	}
})

router.beforeEach((to, from, next) => {
	if (store.state.loader != null) {
		store.state.loader.hide()
	}
	next()
})

new Vue({
	i18n,
	router,
	store,
	render: h => h(App)
}).$mount('#app')

