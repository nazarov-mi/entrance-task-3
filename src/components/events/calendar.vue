
<script>
	import crEventTooltip from '@/components/root/event-tooltip'
	import { mapState, mapGetters } from 'vuex'

	export default {
		name: 'cr-events-calendar',

		components: {
			crEventTooltip
		},

		props: {
			list: Object
		},

		data() {
			return {
				currentEvent: null
			}
		},

		mounted() {
			this.tooltip = this.$refs.tooltip
		},

		beforeDestroy() {
			this.tooltip = null
		},

		computed: {
			...mapState([
				'startOfDay',
				'endOfDay',
				'currentDate'
			]),
			...mapGetters([
				'start',
				'end',
				'duration',
				'getEventsByRoomId',
				'getEmptySlotsByRoomId'
			]),

			cols() {
				return this.endOfDay - this.startOfDay + 1
			},
			showCurrentTime() {
				return (
					this.currentDate >= this.start &&
					this.currentDate <= this.end
				)
			},
			timeStyles() {
				const percent = (this.currentDate - this.start) / this.duration

				return {
					left: (percent * 100) + '%'
				}
			}
		},

		methods: {
			getStyleByDate(date) {
				const duration = this.duration
				const start = Math.max(date.start - this.start, 0)
				const end = Math.min(date.end - this.start, duration)

				return {
					left: (start / duration * 100) + '%',
					width: ((end - start) / duration * 100) + '%'
				}
			},
			roomSelect(roomId) {
				this.$emit('room-select', roomId)
			},
			createEvent(date, room) {
				this.$router.push({
					name: 'event.create',
					params: {
						date,
						room
					}
				})
			},
			updateEvent(id) {
				// this.$router.push({
				// 	name: 'event.edit',
				// 	params: {
				// 		id
				// 	}
				// })
			},
			showModal(e, id) {
				this.tooltip.open(e.pageX, e.pageY, id)
			}
		}
	}
</script>

<template>
	<div class="eventsCalendar">
		<cr-event-tooltip ref="tooltip"></cr-event-tooltip>
		<div class="eventsCalendar-time" :style="timeStyles" v-if="showCurrentTime"></div>
		<div class="eventsCalendar-lines">
			<div class="eventsCalendar-line" v-for="_ in cols">
			</div>
		</div>
		<div class="eventsCalendar-rows">
			<div class="eventsCalendar-group" v-for="rooms in list">
				<div class="eventsCalendar-row" v-for="room in rooms">
					<div
						class="eventsCalendarRow"
						@mouseover="roomSelect(room.id)"
						@mouseout="roomSelect(null)">
						<div
							class="eventsCalendarRow-empty"
							v-for="date in getEmptySlotsByRoomId(room.id)"
							:style="getStyleByDate(date)"
							@click="createEvent(date, room.id)">
						</div>
						<div
							class="eventsCalendarRow-event"
							v-for="event in getEventsByRoomId(room.id)"
							:style="getStyleByDate(event.date)"
							@click="showModal($event, event.id)">
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>