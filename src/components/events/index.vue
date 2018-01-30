
<script>
	import crCalendar from './calendar'
	import crTimeline from './timeline'
	import crSidebar from './sidebar'
	import crDate from './date'
	import { mapState, mapGetters, mapActions } from 'vuex'

	const getPosXFromEvent = e => {
		const touches = e.targetTouches

		if (touches && touches.length) {
			return touches[0].pageX
		}

		return e.pageX
	}

	export default {
		name: 'cr-events',

		components: {
			crCalendar,
			crTimeline,
			crSidebar,
			crDate
		},

		data() {
			return {
				selectedRoom: null,
				scroll: 0
			}
		},

		mounted() {
			const el = this.$el

			document.addEventListener('touchend', this.handleStopDrag, false)
			document.addEventListener('touchmove', this.handleDragging, false)
			document.addEventListener('mouseup', this.handleStopDrag, false)
			document.addEventListener('mousemove', this.handleDragging, false)

			window.addEventListener('resize', this.handleResize, false)
		},

		beforeDestroy() {
			const el = this.$el

			document.removeEventListener('touchend', this.handleStopDrag)
			document.removeEventListener('touchmove', this.handleDragging)
			document.removeEventListener('mouseup', this.handleStopDrag)
			document.removeEventListener('mousemove', this.handleDragging)

			window.removeEventListener('resize', this.handleResize)
		},

		computed: {
			...mapState([
				'showingDate'
			]),
			...mapGetters([
				'roomsGroupedByFloor'
			])
		},

		methods: {
			...mapActions([
				'setShowingDate'
			]),

			roomSelect(roomId) {
				this.selectedRoom = roomId
			},
			handleStartDrag(e) {
				const left = getPosXFromEvent(e)

				this.isDrag = true
				this.startPoint = left

				document.documentElement.classList.add('is-drag')
			},
			handleStopDrag(e) {
				this.isDrag = false

				document.documentElement.classList.remove('is-drag')
			},
			handleDragging(e) {
				if (this.isDrag) {
					const main = this.$refs.main
					const left = getPosXFromEvent(e)

					main.scrollLeft += this.startPoint - left
					this.startPoint = left
					this.scroll = main.scrollLeft
				}
			},
			handleResize(e) {
				const main = this.$refs.main
				this.scroll = main.scrollLeft
			},
		}
	}
</script>

<template>
	<div
		class="events"
		@touchstart="handleStartDrag"
		@mousedown="handleStartDrag">
		<div class="events-navigation">
			<div class="events-navigationSidebar">
				<cr-date
					:value="showingDate"
					@change="setShowingDate">
				</cr-date>
			</div>
			<div class="events-navigationContent">
				<cr-timeline :scroll="scroll"></cr-timeline>
			</div>
		</div>
		<div class="events-main" ref="main">
			<div class="events-mainSidebar">
				<cr-sidebar :list="roomsGroupedByFloor" :scroll="scroll" :selected-room="selectedRoom"></cr-sidebar>
			</div>
			<div class="events-mainContent">
				<cr-calendar :list="roomsGroupedByFloor" @room-select="roomSelect"></cr-calendar>
			</div>
		</div>
	</div>
</template>