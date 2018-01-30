<template>
	<div id="app">
		<transition name="fade" v-if="isFetching">
			<div class="loading">
				<div class="loading-logo">
					<c-icon id="asset_logo" width="175" height="26"></c-icon>
				</div>
				<div class="loading-title">Подождите, загружаются данные</div>
				<div class="loading-spinner"></div>
			</div>
		</transition>
		<cr-header></cr-header>
		<div class="screen">
			<router-view></router-view>
		</div>
		<cr-event-created-modal ref="eventCreatedModal"></cr-event-created-modal>
	</div>
</template>

<script>
	import crEventCreatedModal from '@/components/root/event-created-modal'
	import crHeader from '@/components/root/header'
	import cIcon from '@/components/general/icon'
	import { mapState, mapActions } from 'vuex'

	export default {
		name: 'root',

		components: {
			crEventCreatedModal,
			crHeader,
			cIcon
		},

		created() {
			this.fetchAll()
			this.intervalId = setInterval(() => {
				this.setCurrentDate(new Date())
			}, 1000 * 30)

			this.$root.$on('event-created', this.createdEvent)
		},

		mounted() {
			this.eventCreatedModal = this.$refs.eventCreatedModal
		},

		beforeDestroy() {
			this.eventCreatedModal = null
			clearInterval(this.intervalId)
			this.$root.$off('event-created', this.createdEvent)
		},

		computed: mapState([
			'isFetching'
		]),

		methods: {
			...mapActions([
			'setCurrentDate',
			'fetchAll'
			]),

			createdEvent(id) {
				this.eventCreatedModal.open(id)
			}
		}
	}
</script>

<style lang="sass">
	@import 'assets/sass/app.sass'
</style>