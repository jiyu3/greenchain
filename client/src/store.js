import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		loader: null,
		block: {
			latest: 3
		}
	},
	mutations: {
	},
	getters: {
		api_url() {
			return "https://manga.green:55001/"
		}
	},
	actions: {
	}
})
