
import Vue from 'vue'
import VueX from 'vuex'
import mutations from './mutations'
import * as actions from './actions'
import * as getters from './getters'
import { IN_PROD } from '@/config'

Vue.use(VueX)

const state = {
	isFetching: false,
	messages: [],

	startOfDay: 8,
	endOfDay: 23,
	currentDate: (new Date()).valueOf(),
	showingDate: (new Date()).valueOf(),

	events: [],
	rooms: [],
	users: []
}

export default new VueX.Store({
	strict: !IN_PROD,
	mutations,
	actions,
	getters,
	state
})