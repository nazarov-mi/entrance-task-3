
import Vue from 'vue'
import Root from './Root'
import store from './store'
import router from './router'
import dateFilter from './utils/date-filter'

Vue.config.productionTip = false

Vue.filter('date', dateFilter)

new Vue({
	el: '#app',
	store,
	router,
	render: h => h(Root)
})