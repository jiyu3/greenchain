import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		token: null,
		config: require("./config.json"),
		loader: null
	},
	mutations: {
	},
	getters: {
		api_url(state) {
			return state.config[process.env.NODE_ENV].api.base_url
		}
	},
	actions: {
	}
})
