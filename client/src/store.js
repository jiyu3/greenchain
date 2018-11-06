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
			if (process.env.NODE_ENV === "production") {
				return "https://manga.green:55001/"
			} else {
				return "http://localhost:55000/"
			}
		}
	},
	actions: {
	}
})
